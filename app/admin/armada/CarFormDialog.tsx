"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import type { UiCar } from "@/lib/repo";
import { createCarAction, updateCarAction } from "./actions";

const CATEGORIES = ["mpv", "suv", "citycar", "premium", "ev"] as const;
const TRANSMISSIONS = ["auto", "manual"] as const;

type FormState = {
  slug: string;
  name: string;
  brand: string;
  category: string;
  color: string;
  capacity: string;
  transmission: string;
  fuel: string;
  year: string;
  rateSelfDrive: string;
  rateWithDriver: string;
  deposit: string;
  available: boolean;
  exterior: string;
  side: string;
  interior: string;
};

function initial(car: UiCar | null): FormState {
  return {
    slug: car?.slug ?? "",
    name: car?.name ?? "",
    brand: car?.brand ?? "",
    category: car?.category ?? "mpv",
    color: car?.color ?? "",
    capacity: car ? String(car.capacity) : "5",
    transmission: car?.transmission ?? "auto",
    fuel: car?.fuel ?? "",
    year: car?.year ? String(car.year) : "",
    rateSelfDrive: car ? String(car.rateSelfDrive) : "",
    rateWithDriver: car ? String(car.rateWithDriver) : "",
    deposit: car ? String(car.deposit) : "",
    available: car?.available ?? true,
    exterior: car?.exterior ?? "",
    side: car?.side ?? "",
    interior: car?.interior ?? "",
  };
}

const selectClass =
  "w-full cursor-pointer appearance-none rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-3 py-2.5 text-[14px] text-[var(--color-ink)] outline-none transition-colors focus:border-[var(--color-accent)]";

export function CarFormDialog({
  open,
  car,
  onClose,
}: {
  open: boolean;
  car: UiCar | null;
  onClose: () => void;
}) {
  const t = useT();
  const router = useRouter();
  const [f, setF] = useState<FormState>(() => initial(car));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const text =
    (k: Exclude<keyof FormState, "available">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      slug: f.slug.trim(),
      name: f.name.trim(),
      brand: f.brand.trim(),
      category: f.category,
      color: f.color.trim() || undefined,
      capacity: Number(f.capacity),
      transmission: f.transmission,
      fuel: f.fuel.trim() || undefined,
      year: f.year ? Number(f.year) : undefined,
      rateSelfDrive: Number(f.rateSelfDrive),
      rateWithDriver: Number(f.rateWithDriver),
      deposit: Number(f.deposit),
      available: f.available,
      images: {
        exterior: f.exterior.trim() || undefined,
        side: f.side.trim() || undefined,
        interior: f.interior.trim() || undefined,
      },
    };
    const res = car
      ? await updateCarAction(car.id, payload)
      : await createCarAction(payload);
    if (res.ok) {
      toast.success(t("admin.saved"));
      onClose();
      router.refresh();
      return;
    }
    setLoading(false);
    setError(
      res.error === "slug_taken" ? t("admin.errSlugTaken") : t("admin.errFailed"),
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 flex max-h-[90vh] w-[calc(100vw-32px)] max-w-lg -translate-x-1/2 -translate-y-1/2 flex-col rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] shadow-xl">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
            <Dialog.Title className="text-[19px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
              {car ? t("admin.carEdit") : t("admin.addCar")}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("admin.cancel")}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-mute)] hover:bg-[var(--color-canvas-soft)] hover:text-[var(--color-ink)]"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
            <div className="grid grid-cols-1 gap-4 overflow-y-auto px-6 py-5 sm:grid-cols-2">
              <Field label={t("admin.fName")} htmlFor="name">
                <Input id="name" value={f.name} onChange={text("name")} required />
              </Field>
              <Field label={t("admin.fSlug")} htmlFor="slug">
                <Input id="slug" value={f.slug} onChange={text("slug")} required placeholder="avanza-silver" />
              </Field>
              <Field label={t("admin.fBrand")} htmlFor="brand">
                <Input id="brand" value={f.brand} onChange={text("brand")} required />
              </Field>
              <Field label={t("admin.fCategory")} htmlFor="category">
                <select id="category" value={f.category} onChange={text("category")} className={selectClass}>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c.toUpperCase()}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("admin.fColor")} htmlFor="color">
                <Input id="color" value={f.color} onChange={text("color")} />
              </Field>
              <Field label={t("admin.fCapacity")} htmlFor="capacity">
                <Input id="capacity" type="number" min={1} value={f.capacity} onChange={text("capacity")} required />
              </Field>
              <Field label={t("admin.fTransmission")} htmlFor="transmission">
                <select id="transmission" value={f.transmission} onChange={text("transmission")} className={selectClass}>
                  {TRANSMISSIONS.map((tr) => (
                    <option key={tr} value={tr}>
                      {tr === "auto" ? t("common.auto") : t("common.manual")}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("admin.fFuel")} htmlFor="fuel">
                <Input id="fuel" value={f.fuel} onChange={text("fuel")} placeholder="Bensin" />
              </Field>
              <Field label={t("admin.fYear")} htmlFor="year">
                <Input id="year" type="number" min={1990} value={f.year} onChange={text("year")} />
              </Field>
              <Field label={t("admin.fRateSelf")} htmlFor="rateSelf">
                <Input id="rateSelf" type="number" min={0} value={f.rateSelfDrive} onChange={text("rateSelfDrive")} required />
              </Field>
              <Field label={t("admin.fRateDriver")} htmlFor="rateDriver">
                <Input id="rateDriver" type="number" min={0} value={f.rateWithDriver} onChange={text("rateWithDriver")} required />
              </Field>
              <Field label={t("admin.fDeposit")} htmlFor="deposit">
                <Input id="deposit" type="number" min={0} value={f.deposit} onChange={text("deposit")} required />
              </Field>

              <div className="sm:col-span-2">
                <Field label={t("admin.fImgExterior")} htmlFor="exterior">
                  <Input id="exterior" value={f.exterior} onChange={text("exterior")} placeholder="/images/mobil-01-exterior.webp" />
                </Field>
              </div>
              <Field label={t("admin.fImgSide")} htmlFor="side">
                <Input id="side" value={f.side} onChange={text("side")} />
              </Field>
              <Field label={t("admin.fImgInterior")} htmlFor="interior">
                <Input id="interior" value={f.interior} onChange={text("interior")} />
              </Field>

              <label className="flex cursor-pointer items-center gap-2.5 sm:col-span-2">
                <input
                  type="checkbox"
                  checked={f.available}
                  onChange={(e) => setF((p) => ({ ...p, available: e.target.checked }))}
                  className="h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
                />
                <span className="text-[14px] text-[var(--color-body)]">{t("admin.fAvailable")}</span>
              </label>

              {error && (
                <p className="rounded-[10px] bg-[var(--color-error-soft)] px-3 py-2 text-[13px] font-semibold text-[var(--color-error)] sm:col-span-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2.5 border-t border-[var(--color-hairline)] px-6 py-4">
              <Dialog.Close asChild>
                <Button type="button" variant="secondary" size="md">
                  {t("admin.cancel")}
                </Button>
              </Dialog.Close>
              <Button type="submit" variant="primary" size="md" loading={loading}>
                {t("admin.save")}
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
