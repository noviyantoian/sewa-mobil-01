"use client";

import type { UseFormRegister, FieldErrors } from "react-hook-form";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Input, Select, Field } from "@/components/ui/Input";
import { DocumentUpload } from "@/components/booking/DocumentUpload";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, cn } from "@/lib/format";
import type { Car } from "@/lib/mock/cars";

export type Mode = "selfDrive" | "withDriver";
export type Scheme = "full" | "dp";

export const ADDON_PRICES = { insurance: 120_000, child: 50_000, delivery: 150_000 } as const;
export type AddonKey = keyof typeof ADDON_PRICES;

export type IdentityForm = {
  fullName: string;
  phone: string;
  email: string;
  idType: "ktp" | "passport";
};

export function StepTrip({ car, mode, range }: { car: Car; mode: Mode; range: string }) {
  const t = useT();
  const rows = [
    { label: t("hero.labelLocation"), value: `${car.brand} ${car.name}` },
    { label: t("checkout.step1"), value: range },
    {
      label: t("car.pricePerDay"),
      value: mode === "withDriver" ? t("hero.modeWithDriver") : t("hero.modeSelfDrive"),
    },
  ];
  return (
    <div>
      <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
        {t("checkout.yourTrip")}
      </h2>
      <dl className="mt-4 divide-y divide-[var(--color-hairline)]">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-3">
            <dt className="label-caps">{r.label}</dt>
            <dd className="text-[15px] font-semibold text-[var(--color-ink)]">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function StepIdentity({
  register,
  errors,
  idType,
}: {
  register: UseFormRegister<IdentityForm>;
  errors: FieldErrors<IdentityForm>;
  idType: "ktp" | "passport";
}) {
  const t = useT();
  return (
    <div>
      <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
        {t("checkout.identity")}
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label={t("checkout.fullName")} htmlFor="fullName" error={errors.fullName && t("checkout.fullName")}>
          <Input id="fullName" autoComplete="name" {...register("fullName")} />
        </Field>
        <Field label={t("checkout.phone")} htmlFor="phone" error={errors.phone && t("checkout.phone")}>
          <Input id="phone" inputMode="tel" autoComplete="tel" {...register("phone")} />
        </Field>
        <Field label={t("checkout.email")} htmlFor="email" error={errors.email && t("checkout.email")}>
          <Input id="email" type="email" autoComplete="email" {...register("email")} />
        </Field>
        <Field label={t("checkout.idType")} htmlFor="idType">
          <Select id="idType" {...register("idType")}>
            <option value="ktp">{t("checkout.idKtp")}</option>
            <option value="passport">{t("checkout.idPassport")}</option>
          </Select>
        </Field>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DocumentUpload label={idType === "passport" ? t("checkout.idPassport") : t("checkout.uploadId")} />
        <DocumentUpload label={t("checkout.uploadLicense")} />
      </div>
    </div>
  );
}

export function StepPayment({
  addons,
  setAddons,
  scheme,
  setScheme,
  pickupAddress,
  setPickupAddress,
  returnAddress,
  setReturnAddress,
}: {
  addons: Record<AddonKey, boolean>;
  setAddons: (next: Record<AddonKey, boolean>) => void;
  scheme: Scheme;
  setScheme: (s: Scheme) => void;
  pickupAddress: string;
  setPickupAddress: (v: string) => void;
  returnAddress: string;
  setReturnAddress: (v: string) => void;
}) {
  const t = useT();
  const addonList: { key: AddonKey; title: string; desc: string }[] = [
    { key: "insurance", title: t("checkout.addonInsurance"), desc: t("checkout.addonInsuranceDesc") },
    { key: "child", title: t("checkout.addonChild"), desc: t("checkout.addonChildDesc") },
    { key: "delivery", title: t("checkout.addonDelivery"), desc: t("checkout.addonDeliveryDesc") },
  ];

  return (
    <div className="flex flex-col gap-7">
      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {t("checkout.addons")}
        </h2>
        <div className="mt-4 flex flex-col gap-3">
          {addonList.map((a) => {
            const on = addons[a.key];
            return (
              <label
                key={a.key}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-3 rounded-[12px] border p-4 transition-colors",
                  on
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)]"
                    : "border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                )}
              >
                <span className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={(e) => setAddons({ ...addons, [a.key]: e.target.checked })}
                    className="mt-0.5 h-4 w-4 cursor-pointer accent-[var(--color-accent)]"
                  />
                  <span>
                    <span className="block text-[14px] font-semibold text-[var(--color-ink)]">{a.title}</span>
                    <span className="block text-[13px] text-[var(--color-mute)]">{a.desc}</span>
                  </span>
                </span>
                <span className="tnum shrink-0 text-[14px] font-bold text-[var(--color-ink)]">
                  +{formatIDR(ADDON_PRICES[a.key], { compact: true })}
                </span>
              </label>
            );
          })}
        </div>
        {addons.delivery && (
          <div className="mt-4 grid grid-cols-1 gap-4 rounded-[12px] border border-[var(--color-accent)] bg-[var(--color-accent-soft)] p-4 sm:grid-cols-2">
            <Field label={t("checkout.deliveryAddrPickup")} htmlFor="pickupAddr">
              <Input
                id="pickupAddr"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
                placeholder={t("checkout.deliveryAddrPlaceholder")}
              />
            </Field>
            <Field label={t("checkout.deliveryAddrReturn")} htmlFor="returnAddr">
              <Input
                id="returnAddr"
                value={returnAddress}
                onChange={(e) => setReturnAddress(e.target.value)}
                placeholder={t("checkout.deliveryAddrPlaceholder")}
              />
            </Field>
            <p className="text-[12px] text-[var(--color-mute)] sm:col-span-2">
              {t("checkout.deliveryAddrHint")}
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {t("checkout.payScheme")}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {(["full", "dp"] as Scheme[]).map((s) => {
            const active = scheme === s;
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => setScheme(s)}
                className={cn(
                  "cursor-pointer rounded-[12px] border px-4 py-3 text-[14px] font-semibold transition-colors",
                  active
                    ? "border-[var(--color-accent)] bg-[var(--color-accent-soft)] text-[var(--color-accent-ink)]"
                    : "border-[var(--color-hairline-strong)] text-[var(--color-body)] hover:border-[var(--color-ink)]"
                )}
              >
                {s === "full" ? t("checkout.payFull") : t("checkout.payDp")}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
          {t("checkout.payment")}
        </h2>
        <div className="mt-4 flex items-start gap-3 rounded-[12px] border border-[var(--color-hairline-strong)] bg-[var(--color-surface-soft)] p-4">
          <WhatsappLogo
            size={22}
            weight="fill"
            className="mt-0.5 shrink-0 text-[var(--color-success)]"
          />
          <div>
            <p className="text-[14px] font-semibold text-[var(--color-ink)]">
              {t("checkout.waPayTitle")}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-mute)]">
              {t("checkout.waPayDesc")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
