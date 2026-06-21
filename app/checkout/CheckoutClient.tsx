"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import Image from "next/image";
import { CheckCircle, CaretLeft, LockSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { HoldTimer } from "@/components/booking/HoldTimer";
import { Stepper } from "@/components/booking/Stepper";
import { type PaymentMethod } from "@/components/booking/PaymentMethods";
import { PriceSummary, type PriceBreakdown } from "@/components/booking/PriceSummary";
import {
  StepTrip,
  StepIdentity,
  StepPayment,
  ADDON_PRICES,
  type Mode,
  type Scheme,
  type AddonKey,
  type IdentityForm,
} from "@/components/booking/CheckoutSteps";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatDate, formatDateRange, daysBetween } from "@/lib/format";
import type { UiCar } from "@/lib/repo";
import { createBookingAction } from "./actions";

const identitySchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(8),
  email: z.string().email(),
  idType: z.enum(["ktp", "passport"]),
}) satisfies z.ZodType<IdentityForm>;

function nextDay(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export function CheckoutClient({ car }: { car: UiCar }) {
  const t = useT();
  const router = useRouter();
  const params = useSearchParams();

  const mode: Mode = params.get("mode") === "withDriver" ? "withDriver" : "selfDrive";
  const from = params.get("from") ?? nextDay(1);
  const to = params.get("to") ?? nextDay(4);

  const [step, setStep] = useState(0);
  const [addons, setAddons] = useState<Record<AddonKey, boolean>>({
    insurance: false,
    child: false,
    delivery: false,
  });
  const [scheme, setScheme] = useState<Scheme>("full");
  const [payment, setPayment] = useState<PaymentMethod>("qris");
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<IdentityForm>({
    resolver: zodResolver(identitySchema),
    mode: "onChange",
    defaultValues: { idType: "ktp" },
  });
  const idType = watch("idType");

  const price: PriceBreakdown = useMemo(() => {
    const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
    const days = daysBetween(from, to);
    const rentalSubtotal = rate * days;
    const addonsTotal = (Object.keys(addons) as AddonKey[]).reduce(
      (sum, k) => sum + (addons[k] ? ADDON_PRICES[k] : 0),
      0
    );
    const deposit = car.deposit;
    const goods = rentalSubtotal + addonsTotal;
    const total = goods + deposit;
    const dueNow = (scheme === "dp" ? Math.round(goods * 0.3) : goods) + deposit;
    return { days, rentalSubtotal, addonsTotal, deposit, total, dueNow };
  }, [car, mode, from, to, addons, scheme]);

  const steps = [t("checkout.step1"), t("checkout.step2"), t("checkout.step3")];
  const canPlace = isValid && agree;

  const place = async () => {
    setSubmitting(true);
    const id = watch();
    const res = await createBookingAction({
      slug: car.slug,
      mode,
      from,
      to,
      fullName: id.fullName,
      phone: id.phone,
      email: id.email,
      addonsTotal: price.addonsTotal,
    });
    if (res.ok) {
      toast.success(t("confirm.title"));
      router.push(`/konfirmasi/${res.code}`);
      return;
    }
    setSubmitting(false);
    toast.error(
      res.error === "double_booking"
        ? t("checkout.errorDoubleBooking")
        : t("checkout.errorGeneric")
    );
  };

  return (
    <main className="bg-[var(--color-canvas-warm)] pb-20">
      <div className="container-folka pt-7">
        <button type="button" onClick={() => router.back()} className="link-arrow cursor-pointer">
          <CaretLeft size={16} weight="bold" />
          {t("common.back")}
        </button>
        <h1 className="mt-4 display-sm">{t("checkout.title")}</h1>
      </div>

      <div className="container-folka mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-6">
          <HoldTimer />
          <div className="rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 sm:p-6">
            <Stepper steps={steps} current={step} />
            <div className="mt-7">
              {step === 0 && <StepTrip car={car} mode={mode} range={formatDateRange(from, to)} />}
              {step === 1 && <StepIdentity register={register} errors={errors} idType={idType} />}
              {step === 2 && (
                <StepPayment
                  addons={addons}
                  setAddons={setAddons}
                  scheme={scheme}
                  setScheme={setScheme}
                  payment={payment}
                  setPayment={setPayment}
                />
              )}
            </div>

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-5">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                {t("common.back")}
              </Button>
              {step < 2 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={() => setStep((s) => Math.min(2, s + 1))}
                  disabled={step === 1 && !isValid}
                >
                  {t("common.next")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  loading={submitting}
                  disabled={!canPlace}
                  onClick={place}
                >
                  {t("checkout.placeOrder")}
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 sm:p-6">
            <h2 className="text-[16px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
              {t("checkout.cancelPolicy")}
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-[14px] text-[var(--color-body)]">
              <li className="flex items-center gap-2">
                <CheckCircle size={17} weight="fill" className="text-[var(--color-success)]" />
                {t("checkout.cancelFree", { date: formatDate(from) })}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-mute)]" aria-hidden />
                {t("checkout.cancelPartial")}
              </li>
            </ul>
          </div>
        </div>

        <aside>
          <div className="sticky top-24 flex flex-col gap-5 rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-5 shadow-md sm:p-6">
            <div className="flex items-center gap-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-[10px] bg-[var(--color-canvas-soft)]">
                <Image src={car.exterior} alt={car.name} fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <span className="label-caps">{car.brand}</span>
                <p className="truncate text-[15px] font-bold text-[var(--color-ink)]">{car.name}</p>
                <p className="text-[12px] text-[var(--color-mute)]">
                  {mode === "withDriver" ? t("hero.modeWithDriver") : t("hero.modeSelfDrive")}
                </p>
              </div>
            </div>

            <div className="border-t border-[var(--color-hairline)] pt-5">
              <PriceSummary price={price} />
            </div>

            <label className="flex cursor-pointer items-start gap-2.5 rounded-[10px] bg-[var(--color-canvas-soft)] p-3 text-[13px] text-[var(--color-body)]">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[var(--color-accent)]"
              />
              {t("checkout.agree")}
            </label>

            <Button
              type="button"
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
              disabled={!canPlace}
              onClick={place}
            >
              {t("checkout.placeOrder")}
            </Button>

            <p className="inline-flex items-center justify-center gap-1.5 text-[12px] text-[var(--color-mute)]">
              <LockSimple size={14} weight="fill" className="text-[var(--color-success)]" />
              {t("checkout.secure")}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
