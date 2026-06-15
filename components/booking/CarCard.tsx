"use client";

import Image from "next/image";
import Link from "next/link";
import { Users, GearSix, GasPump, Star, ArrowRight } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, cn } from "@/lib/format";
import { categoryColor } from "@/components/ui/Badge";
import type { Car } from "@/lib/mock/cars";

const catLabel: Record<string, string> = {
  mpv: "MPV",
  suv: "SUV",
  citycar: "City Car",
  premium: "Premium",
  ev: "Electric",
};

export function CarCard({
  car,
  mode = "selfDrive",
  rating = 4.9,
  dense = false,
}: {
  car: Car;
  mode?: "selfDrive" | "withDriver";
  rating?: number;
  dense?: boolean;
}) {
  const t = useT();
  const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
  const accent = categoryColor[car.category];
  const disabled = !car.available;

  return (
    <Link
      href={`/mobil/${car.slug}?mode=${mode}`}
      className={cn(
        "group relative flex overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-[var(--color-hairline-strong)] hover:shadow-lg focus-visible:-translate-y-1",
        dense ? "flex-row sm:flex-col" : "flex-col",
      )}
      aria-label={`${car.brand} ${car.name}`}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-[var(--color-canvas-soft)]",
          dense
            ? "aspect-auto w-[40%] shrink-0 self-stretch sm:aspect-[16/11] sm:w-full"
            : "aspect-[16/11]",
        )}
      >
        <Image
          src={car.exterior}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-[color-mix(in_srgb,var(--color-canvas)_88%,transparent)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--color-ink)] backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden />
          {catLabel[car.category]}
        </span>
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--color-primary)_82%,transparent)] px-2 py-1 text-[11px] font-bold text-white backdrop-blur">
          <Star size={12} weight="fill" className="text-[#ffcb45]" />
          {rating.toFixed(1)}
        </span>
        {disabled && (
          <span className="absolute bottom-3 left-3 rounded-full bg-[var(--color-primary)] px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-white">
            {t("common.unavailable")}
          </span>
        )}
      </div>

      <div className={cn("flex min-w-0 flex-1 flex-col", dense ? "p-3.5 sm:p-5" : "p-5")}>
        <span className="label-caps">{car.brand}</span>
        <h3
          className={cn(
            "mt-1 font-bold leading-tight tracking-[-0.02em] text-[var(--color-ink)]",
            dense ? "text-[17px] sm:text-[19px]" : "text-[19px]",
          )}
        >
          {car.name}
        </h3>

        <ul
          className={cn(
            "mt-3 flex flex-wrap items-center gap-y-1.5 text-[13px] text-[var(--color-body-mid)]",
            dense ? "gap-x-3 sm:gap-x-4" : "gap-x-4",
          )}
        >
          <li className="inline-flex items-center gap-1.5">
            <Users size={15} className="text-[var(--color-mute)]" /> {car.capacity} {t("common.seats")}
          </li>
          <li className="inline-flex items-center gap-1.5">
            <GearSix size={15} className="text-[var(--color-mute)]" />
            {car.transmission === "auto" ? t("common.auto") : t("common.manual")}
          </li>
          <li className={cn("items-center gap-1.5", dense ? "hidden sm:inline-flex" : "inline-flex")}>
            <GasPump size={15} className="text-[var(--color-mute)]" /> {car.fuel}
          </li>
        </ul>

        <div
          className={cn(
            "flex items-end justify-between border-t border-[var(--color-hairline)]",
            dense ? "mt-3 pt-3 sm:mt-5 sm:pt-4" : "mt-5 pt-4",
          )}
        >
          <div className="min-w-0">
            <div className="flex items-baseline gap-1">
              <span className={cn("tnum font-bold leading-none tracking-[-0.02em] text-[var(--color-ink)]", dense ? "text-[19px] sm:text-[22px]" : "text-[22px]")}>
                {formatIDR(rate)}
              </span>
              <span className="text-[13px] font-medium text-[var(--color-mute)]">{t("common.perDay")}</span>
            </div>
            <div className="mt-1 text-[12px] text-[var(--color-mute)]">
              {t("common.deposit")} {formatIDR(car.deposit, { compact: true })}
            </div>
          </div>
          <span
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-ink)] transition-colors duration-200 group-hover:bg-[var(--color-accent)] group-hover:text-white",
              dense ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-10",
            )}
          >
            <ArrowRight size={18} weight="bold" />
          </span>
        </div>
      </div>
    </Link>
  );
}
