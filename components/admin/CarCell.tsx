"use client";

import Image from "next/image";
import { categoryColor } from "@/components/ui/Badge";
import type { Car } from "@/lib/mock/cars";

export function CarCell({ car }: { car: Car | undefined }) {
  if (!car) return <span className="text-[var(--color-mute)]">—</span>;
  return (
    <div className="flex items-center gap-3">
      <span className="relative h-10 w-14 shrink-0 overflow-hidden rounded-[8px] bg-[var(--color-canvas-soft)]">
        <Image
          src={car.exterior}
          alt={`${car.brand} ${car.name}`}
          fill
          sizes="56px"
          className="object-cover"
        />
        <span
          className="absolute left-1 top-1 h-1.5 w-1.5 rounded-full ring-1 ring-white/70"
          style={{ background: categoryColor[car.category] }}
          aria-hidden
        />
      </span>
      <div className="min-w-0">
        <div className="truncate font-semibold text-[var(--color-ink)]">{car.name}</div>
        <div className="text-[12px] text-[var(--color-mute)]">{car.brand}</div>
      </div>
    </div>
  );
}
