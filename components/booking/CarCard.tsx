"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import type { Car } from "@/lib/mock/cars";

export function CarCard({ car, mode = "selfDrive" }: { car: Car; mode?: "selfDrive" | "withDriver" }) {
  const t = useT();
  const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;

  return (
    <Link
      href={`/mobil/${car.slug}`}
      className="group block bg-[var(--color-canvas)] border border-[var(--color-hairline)] hover:border-[var(--color-ink)] transition-colors"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden">
        <Image
          src={car.exterior}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {!car.available && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-[var(--color-surface-dark)] text-[var(--color-on-dark)] text-[11px] font-bold uppercase tracking-[1.5px]">
            {t("common.noData")}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] mb-1">
          {car.brand}
        </div>
        <h3 className="text-[18px] font-bold text-[var(--color-ink)] mb-3 leading-tight">
          {car.name}
        </h3>
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-[var(--color-body)] mb-4">
          <li>{car.capacity} {t("carDetail.capacity").toLowerCase()}</li>
          <li>{car.transmission === "auto" ? t("search.transmissionAuto") : t("search.transmissionManual")}</li>
          <li>{car.fuel}</li>
        </ul>
        <div className="flex items-baseline justify-between border-t border-[var(--color-hairline)] pt-4">
          <div>
            <div className="text-[20px] font-bold text-[var(--color-ink)] leading-none">
              {formatIDR(rate)}
            </div>
            <div className="text-[12px] text-[var(--color-muted)] mt-1">{t("search.perDay")}</div>
          </div>
          <span className="label-uppercase text-[var(--color-ink)] group-hover:text-[var(--color-primary)]">
            {t("search.viewDetail")} {">"}
          </span>
        </div>
      </div>
    </Link>
  );
}
