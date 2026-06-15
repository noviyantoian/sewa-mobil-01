"use client";

import {
  CalendarBlank,
  GearSix,
  GasPump,
  Users,
  Tag,
  type Icon,
} from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { categoryColor } from "@/components/ui/Badge";
import type { Car } from "@/lib/mock/cars";

const catLabel: Record<string, string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium",
  ev: "Electric",
};

export function SpecGrid({ car }: { car: Car }) {
  const t = useT();

  const specs: { icon: Icon; label: string; value: string; tint?: string }[] = [
    { icon: CalendarBlank, label: t("car.year"), value: String(car.year) },
    {
      icon: GearSix,
      label: t("car.transmission"),
      value: car.transmission === "auto" ? t("common.auto") : t("common.manual"),
    },
    { icon: GasPump, label: t("car.fuel"), value: car.fuel },
    { icon: Users, label: t("car.capacity"), value: `${car.capacity} ${t("common.seats")}` },
    {
      icon: Tag,
      label: t("car.category"),
      value: catLabel[car.category],
      tint: categoryColor[car.category],
    },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {specs.map((s) => (
        <div
          key={s.label}
          className="flex items-center gap-3 rounded-[12px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-3.5"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[var(--color-canvas-soft)]"
            style={s.tint ? { color: s.tint } : { color: "var(--color-ink)" }}
          >
            <s.icon size={18} weight="bold" />
          </span>
          <span className="min-w-0">
            <dt className="label-caps">{s.label}</dt>
            <dd className="mt-0.5 truncate text-[14px] font-semibold text-[var(--color-ink)]">
              {s.value}
            </dd>
          </span>
        </div>
      ))}
    </dl>
  );
}
