"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { SlidersHorizontal, X, CaretDown, CarProfile, MagnifyingGlass } from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SearchBar } from "@/components/booking/SearchBar";
import { CarCard } from "@/components/booking/CarCard";
import {
  FilterPanel,
  defaultFilters,
  type FilterState,
} from "@/components/booking/FilterPanel";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { filterCars, type Car } from "@/lib/mock/cars";
import { cn } from "@/lib/format";
import { locations } from "@/lib/mock/locations";
import { formatDate, daysBetween } from "@/lib/format";

type Mode = "selfDrive" | "withDriver";
type Sort = "recommended" | "priceLow" | "priceHigh";

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function rateOf(car: Car, mode: Mode): number {
  return mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
}

function SearchResults() {
  const t = useT();
  const params = useSearchParams();

  const mode: Mode = params.get("mode") === "withDriver" ? "withDriver" : "selfDrive";
  const pickup: "self" | "deliver" = params.get("pickup") === "deliver" ? "deliver" : "self";
  const loc = params.get("loc") ?? locations[0].id;
  const from = params.get("from") ?? addDays(1);
  const to = params.get("to") ?? addDays(4);

  const locationLabel = useMemo(() => {
    const found = locations.find((l) => l.id === loc);
    if (found) return `${found.city} · ${found.area}`;
    // Delivery: loc is a city slug (e.g. "jakarta") — capitalize it.
    return loc.charAt(0).toUpperCase() + loc.slice(1);
  }, [loc]);

  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [sort, setSort] = useState<Sort>("recommended");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const modeLabel = mode === "withDriver" ? t("hero.modeWithDriver") : t("hero.modeSelfDrive");
  const pickupLabel = pickup === "deliver" ? t("hero.pickupDeliver") : t("hero.pickupSelf");

  const results = useMemo(() => {
    const list = filterCars({
      category: filters.category,
      transmission: filters.transmission,
      capacityMin: filters.minSeats || undefined,
      priceMin: filters.minPrice,
      priceMax: filters.maxPrice,
      mode,
    });
    const sorted = [...list];
    if (sort === "priceLow") sorted.sort((a, b) => rateOf(a, mode) - rateOf(b, mode));
    else if (sort === "priceHigh") sorted.sort((a, b) => rateOf(b, mode) - rateOf(a, mode));
    else sorted.sort((a, b) => Number(b.available) - Number(a.available));
    return sorted;
  }, [filters, sort, mode]);

  const days = daysBetween(from, to);

  return (
    <main className="bg-[var(--color-canvas-warm)] pb-20">
      <div className="sticky top-16 z-30 border-b border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-canvas)_92%,transparent)] backdrop-blur-md">
        <div className="container-folka py-3">
          {/* Slim collapsed summary — all breakpoints */}
          <button
            type="button"
            onClick={() => setSearchOpen((o) => !o)}
            aria-expanded={searchOpen}
            className="group flex min-h-[56px] w-full items-center gap-3 rounded-[12px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-4 py-2.5 text-left transition-colors hover:border-[var(--color-ink)]"
          >
            <MagnifyingGlass size={18} weight="bold" className="shrink-0 text-[var(--color-accent)]" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[14px] font-bold text-[var(--color-ink)]">{locationLabel}</span>
              <span className="block truncate text-[12px] text-[var(--color-mute)]">{`${formatDate(from)} – ${formatDate(to)} · ${modeLabel} · ${pickupLabel}`}</span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-[9px] bg-[var(--color-accent)] px-3.5 py-2 text-[13px] font-semibold text-white shadow-accent transition-colors group-hover:bg-[var(--color-accent-hover)]">
              <SlidersHorizontal size={15} weight="bold" />
              {t("search.edit")}
            </span>
          </button>

          {/* Full search expands inline under the summary — all breakpoints */}
          <div className={cn(searchOpen ? "mt-3 block" : "hidden")}>
            <SearchBar variant="compact" initial={{ mode, loc, from, to, pickup }} />
          </div>
        </div>
      </div>

      <div className="container-folka pt-9">
        <div className="flex flex-col gap-1.5">
          <h1 className="display-sm">{t("search.title")}</h1>
          <p className="body-lg text-[var(--color-body-mid)]">
            {t("search.resultsFor", { count: results.length, location: locationLabel })}
          </p>
          <p className="text-[14px] text-[var(--color-mute)]">
            {t("search.resultsRange", { from: formatDate(from), to: formatDate(to), days })}
          </p>
        </div>

        <div className="mt-7 flex items-center justify-between gap-3 border-y border-[var(--color-hairline)] py-3">
          <Dialog.Root open={sheetOpen} onOpenChange={setSheetOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-4 py-2.5 text-[14px] font-semibold text-[var(--color-ink)] transition-colors hover:border-[var(--color-ink)] lg:hidden"
              >
                <SlidersHorizontal size={17} weight="bold" />
                {t("search.filters")}
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-[rgba(8,8,8,0.45)] backdrop-blur-sm" />
              <Dialog.Content className="fixed inset-y-0 left-0 z-[70] flex w-[86vw] max-w-[340px] flex-col bg-[var(--color-canvas)] shadow-xl focus:outline-none">
                <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-6 py-4">
                  <Dialog.Title className="text-[19px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                    {t("search.filters")}
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label={t("common.back")}
                      className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]"
                    >
                      <X size={20} weight="bold" />
                    </button>
                  </Dialog.Close>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-2">
                  <FilterPanel value={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
                </div>
                <div className="sticky bottom-0 border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] px-6 pb-6 pt-4">
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => setSheetOpen(false)}
                  >
                    {t("search.title")} · {results.length}
                  </Button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>

          <label className="ml-auto inline-flex items-center gap-2 text-[13px] text-[var(--color-mute)]">
            <span className="hidden sm:inline">{t("search.sort")}</span>
            <span className="relative inline-flex items-center">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                aria-label={t("search.sort")}
                className="cursor-pointer appearance-none rounded-[10px] border border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] py-2 pl-3 pr-8 text-[14px] font-semibold text-[var(--color-ink)] outline-none transition-colors hover:border-[var(--color-ink)] focus:border-[var(--color-accent)]"
              >
                <option value="recommended">{t("search.sortRecommended")}</option>
                <option value="priceLow">{t("search.sortPriceLow")}</option>
                <option value="priceHigh">{t("search.sortPriceHigh")}</option>
              </select>
              <CaretDown
                size={14}
                weight="bold"
                className="pointer-events-none absolute right-3 text-[var(--color-mute)]"
              />
            </span>
          </label>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-40">
              <FilterPanel value={filters} onChange={setFilters} onReset={() => setFilters(defaultFilters)} />
            </div>
          </aside>

          {results.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {results.map((car) => (
                <CarCard key={car.slug} car={car} mode={mode} dense />
              ))}
            </div>
          ) : (
            <EmptyState onReset={() => setFilters(defaultFilters)} />
          )}
        </div>
      </div>
    </main>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const t = useT();
  return (
    <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] px-6 py-20 text-center">
      <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-mute)]">
        <CarProfile size={30} weight="duotone" />
      </span>
      <h2 className="text-[22px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">{t("search.empty")}</h2>
      <p className="mt-2 max-w-xs text-[15px] text-[var(--color-body-mid)]">{t("search.emptyDesc")}</p>
      <Button type="button" variant="secondary" size="md" className="mt-6" onClick={onReset}>
        {t("search.reset")}
      </Button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-[60vh]" />}>
        <SearchResults />
      </Suspense>
      <Footer />
    </>
  );
}
