"use client";

import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import { calcPrice } from "@/lib/pricing";
import type { BookingMode } from "@/lib/db/schema";
import { createManualBookingAction } from "./actions";

export interface ManualCar {
  id: string;
  name: string;
  brand: string;
  rateSelfDrive: number;
  rateWithDriver: number;
  deposit: number;
}
export interface ManualOption {
  id: string;
  label: string;
}

const selectClass =
  "w-full cursor-pointer appearance-none rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 py-2.5 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="card shadow-sm">
      <h2 className="mb-4 text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ManualBookingForm({
  cars,
  drivers,
  locations,
}: {
  cars: ManualCar[];
  drivers: ManualOption[];
  locations: ManualOption[];
}) {
  const t = useT();
  const router = useRouter();
  const [f, setF] = useState({
    carId: cars[0]?.id ?? "",
    mode: "selfDrive" as BookingMode,
    from: "",
    to: "",
    customerName: "",
    customerPhone: "",
    pickupLocationId: "",
    returnLocationId: "",
    driverId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const car = cars.find((c) => c.id === f.carId);
  const preview = useMemo(() => {
    if (!car || !f.from || !f.to) return null;
    const fromAt = new Date(`${f.from}T08:00:00+07:00`);
    const toAt = new Date(`${f.to}T08:00:00+07:00`);
    if (Number.isNaN(fromAt.getTime()) || Number.isNaN(toAt.getTime()) || toAt <= fromAt)
      return null;
    return calcPrice(car, f.mode, fromAt, toAt);
  }, [car, f.from, f.to, f.mode]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await createManualBookingAction({
      carId: f.carId,
      mode: f.mode,
      from: f.from,
      to: f.to,
      customerName: f.customerName.trim(),
      customerPhone: f.customerPhone.trim(),
      pickupLocationId: f.pickupLocationId || undefined,
      returnLocationId: f.returnLocationId || undefined,
      driverId: f.driverId || undefined,
    });
    if (res.ok) {
      toast.success(t("admin.saved"));
      router.push(`/admin/booking/${encodeURIComponent(res.code)}`);
      router.refresh();
      return;
    }
    setLoading(false);
    setError(
      res.error === "double_booking"
        ? t("admin.bkErrDouble")
        : res.error === "car_not_found"
          ? t("admin.bkErrCarNotFound")
          : t("admin.errFailed"),
    );
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <Link
            href="/admin/booking"
            className="inline-flex w-fit items-center gap-1.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          >
            <ArrowLeft size={15} weight="bold" />
            {t("admin.bkBack")}
          </Link>
          <h1 className="display-sm">{t("admin.bkNew")}</h1>
        </div>
        <Button type="submit" variant="primary" loading={loading}>
          {t("admin.bkCreate")}
        </Button>
      </header>

      <Section title={t("admin.car")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.bkSelectCar")} htmlFor="car">
            <select id="car" value={f.carId} onChange={set("carId")} className={selectClass} required>
              {cars.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("admin.bkMode")} htmlFor="mode">
            <select id="mode" value={f.mode} onChange={set("mode")} className={selectClass}>
              <option value="selfDrive">{t("admin.bkSelfDrive")}</option>
              <option value="withDriver">{t("admin.bkWithDriver")}</option>
            </select>
          </Field>
          <Field label={t("admin.bkFrom")} htmlFor="from">
            <Input id="from" type="date" value={f.from} onChange={set("from")} required />
          </Field>
          <Field label={t("admin.bkTo")} htmlFor="to">
            <Input id="to" type="date" value={f.to} onChange={set("to")} required />
          </Field>
        </div>
      </Section>

      <Section title={t("admin.customer")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label={t("admin.fName")} htmlFor="cname">
            <Input id="cname" value={f.customerName} onChange={set("customerName")} required />
          </Field>
          <Field label={t("admin.bkPhone")} htmlFor="cphone">
            <Input id="cphone" value={f.customerPhone} onChange={set("customerPhone")} required placeholder="0812..." />
          </Field>
        </div>
      </Section>

      <Section title={t("admin.bkLocations")}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label={t("admin.bkPickupLoc")} htmlFor="pickup">
            <select id="pickup" value={f.pickupLocationId} onChange={set("pickupLocationId")} className={selectClass}>
              <option value="">{t("admin.bkNone")}</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("admin.bkReturnLoc")} htmlFor="ret">
            <select id="ret" value={f.returnLocationId} onChange={set("returnLocationId")} className={selectClass}>
              <option value="">{t("admin.bkNone")}</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("admin.bkOptDriver")} htmlFor="driver">
            <select id="driver" value={f.driverId} onChange={set("driverId")} className={selectClass}>
              <option value="">{t("admin.bkNone")}</option>
              {drivers.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.label}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Section>

      {preview && (
        <section className="card shadow-sm">
          <div className="flex items-baseline justify-between py-1">
            <span className="text-[13px] text-[var(--color-mute)]">
              {t("admin.bkSubtotal")} ({preview.days} {t("admin.bkDays")} × {formatIDR(preview.dailyRate)})
            </span>
            <span className="tnum text-[15px] font-bold text-[var(--color-ink)]">{formatIDR(preview.subtotal)}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-[var(--color-hairline)] py-1 pt-2.5">
            <span className="text-[13px] text-[var(--color-mute)]">{t("admin.bkDeposit")}</span>
            <span className="tnum text-[14px] font-semibold text-[var(--color-body)]">{formatIDR(preview.deposit)}</span>
          </div>
        </section>
      )}

      {error && (
        <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)]">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2.5">
        <Button type="button" variant="secondary" onClick={() => router.push("/admin/booking")}>
          {t("admin.cancel")}
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {t("admin.bkCreate")}
        </Button>
      </div>
    </form>
  );
}
