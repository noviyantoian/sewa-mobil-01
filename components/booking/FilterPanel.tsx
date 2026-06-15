"use client";

import { useT } from "@/lib/i18n/I18nProvider";
import { categoryColor } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatIDR, cn } from "@/lib/format";
import type { CarCategory, CarTransmission } from "@/lib/mock/cars";

export type FilterState = {
  category: CarCategory | "all";
  transmission: CarTransmission | "all";
  minSeats: number;
  minPrice: number;
  maxPrice: number;
};

const PRICE_MIN = 250_000;
const PRICE_MAX = 2_500_000;
const PRICE_STEP = 50_000;

export const categories: { value: CarCategory | "all"; label: string }[] = [
  { value: "all", label: "" },
  { value: "mpv", label: "MPV" },
  { value: "suv", label: "SUV" },
  { value: "citycar", label: "City Car" },
  { value: "premium", label: "Premium" },
  { value: "ev", label: "Electric" },
];

const transmissions: { value: CarTransmission | "all"; key: string }[] = [
  { value: "all", key: "common.all" },
  { value: "auto", key: "common.auto" },
  { value: "manual", key: "common.manual" },
];

const seatOptions = [0, 5, 7];

export const chip =
  "cursor-pointer rounded-full border px-3 py-1.5 text-[13px] font-semibold transition-colors";
export const chipActive = "border-[var(--color-ink)] bg-[var(--color-ink)] text-white";
export const chipIdle =
  "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-[var(--color-body)] hover:border-[var(--color-ink)]";

export function FilterPanel({
  value,
  onChange,
  onReset,
  className,
}: {
  value: FilterState;
  onChange: (next: FilterState) => void;
  onReset?: () => void;
  className?: string;
}) {
  const t = useT();
  const set = (patch: Partial<FilterState>) => onChange({ ...value, ...patch });
  const minPct = ((value.minPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((value.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  return (
    <div className={cn("flex flex-col gap-7", className)}>
      <fieldset>
        <legend className="label-caps mb-3">{t("search.category")}</legend>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => {
            const active = value.category === c.value;
            const dot = c.value === "all" ? undefined : categoryColor[c.value];
            return (
              <button
                key={c.value}
                type="button"
                aria-pressed={active}
                onClick={() => set({ category: c.value })}
                className={cn("inline-flex items-center gap-1.5", chip, active ? chipActive : chipIdle)}
              >
                {dot && (
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} aria-hidden />
                )}
                {c.value === "all" ? t("common.all") : c.label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-caps mb-3">{t("search.transmission")}</legend>
        <div className="flex flex-wrap gap-2">
          {transmissions.map((tr) => {
            const active = value.transmission === tr.value;
            return (
              <button
                key={tr.value}
                type="button"
                aria-pressed={active}
                onClick={() => set({ transmission: tr.value })}
                className={cn(chip, active ? chipActive : chipIdle)}
              >
                {tr.value === "all" ? t("common.all") : t(tr.key)}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <legend className="label-caps mb-3">{t("search.capacity")}</legend>
        <div className="flex flex-wrap gap-2">
          {seatOptions.map((n) => {
            const active = value.minSeats === n;
            return (
              <button
                key={n}
                type="button"
                aria-pressed={active}
                onClick={() => set({ minSeats: n })}
                className={cn(chip, active ? chipActive : chipIdle)}
              >
                {n === 0 ? t("common.all") : t("search.minSeats", { n })}
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset>
        <div className="mb-3 flex items-baseline justify-between">
          <legend className="label-caps">{t("search.priceRange")}</legend>
          <span className="tnum text-[13px] font-bold text-[var(--color-ink)]">
            {formatIDR(value.minPrice, { compact: true })} – {formatIDR(value.maxPrice, { compact: true })}
          </span>
        </div>
        <div className="relative flex h-5 items-center">
          <div className="absolute h-1.5 w-full rounded-full bg-[var(--color-hairline)]" />
          <div
            className="absolute h-1.5 rounded-full bg-[var(--color-accent)]"
            style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
          />
          <input
            type="range"
            className="range-dual"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={value.minPrice}
            aria-label={`${t("search.priceRange")} min`}
            onChange={(e) => set({ minPrice: Math.min(Number(e.target.value), value.maxPrice - PRICE_STEP) })}
          />
          <input
            type="range"
            className="range-dual"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={PRICE_STEP}
            value={value.maxPrice}
            aria-label={`${t("search.priceRange")} max`}
            onChange={(e) => set({ maxPrice: Math.max(Number(e.target.value), value.minPrice + PRICE_STEP) })}
          />
        </div>
        <div className="mt-2 flex justify-between text-[12px] text-[var(--color-mute)]">
          <span className="tnum">{formatIDR(PRICE_MIN, { compact: true })}</span>
          <span className="tnum">{formatIDR(PRICE_MAX, { compact: true })}</span>
        </div>
      </fieldset>

      {onReset && (
        <Button type="button" variant="secondary" size="md" onClick={onReset} className="w-full">
          {t("search.reset")}
        </Button>
      )}
    </div>
  );
}

export const FILTER_BOUNDS = { PRICE_MIN, PRICE_MAX };

export const defaultFilters: FilterState = {
  category: "all",
  transmission: "all",
  minSeats: 0,
  minPrice: PRICE_MIN,
  maxPrice: PRICE_MAX,
};
