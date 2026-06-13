"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import type { Car } from "@/lib/mock/cars";

const categoryAccent: Record<string, string> = {
  mpv: "#7a3dff",
  suv: "#ed52cb",
  citycar: "#00d722",
  premium: "#3b89ff",
  ev: "#ff6b00",
};

export function CarCard({ car, mode = "selfDrive" }: { car: Car; mode?: "selfDrive" | "withDriver" }) {
  const t = useT();
  const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
  const accent = categoryAccent[car.category];

  return (
    <Link
      href={`/mobil/${car.slug}`}
      className="group block bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[12px] overflow-hidden hover:shadow-level-2 transition-shadow"
    >
      <div className="relative aspect-[4/3] bg-[var(--color-canvas-soft)] overflow-hidden">
        <Image
          src={car.exterior}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span
          className="absolute top-3 left-3 inline-block px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.6px] rounded-[4px] text-white"
          style={{ backgroundColor: accent }}
        >
          {car.category.toUpperCase()}
        </span>
        {!car.available && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[11px] font-medium uppercase tracking-[0.6px] rounded-[4px]">
            Penuh
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="text-[12px] font-medium uppercase tracking-[0.6px] text-[var(--color-mute)] mb-1">
          {car.brand}
        </div>
        <h3 className="text-[20px] font-semibold tracking-[-0.16px] text-[var(--color-ink)] mb-3 leading-tight">
          {car.name}
        </h3>
        <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-[var(--color-body)] mb-4">
          <li>{car.capacity} kursi</li>
          <li>·</li>
          <li>{car.transmission === "auto" ? t("search.transmissionAuto") : t("search.transmissionManual")}</li>
          <li>·</li>
          <li>{car.fuel}</li>
        </ul>
        <div className="flex items-baseline justify-between border-t border-[var(--color-hairline)] pt-4">
          <div>
            <div className="text-[22px] font-semibold tracking-[-0.16px] text-[var(--color-ink)] leading-none">
              {formatIDR(rate)}
            </div>
            <div className="text-[12px] text-[var(--color-mute)] mt-1">{t("search.perDay")}</div>
          </div>
          <span className="text-[13px] font-medium text-[var(--color-ink)] group-hover:text-[var(--color-accent-blue-deep)]">
            {t("search.viewDetail")} →
          </span>
        </div>
      </div>
    </Link>
  );
}
