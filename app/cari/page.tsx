"use client";

import { useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CarCard } from "@/components/booking/CarCard";
import { Button } from "@/components/ui/Button";
import { Select, Label } from "@/components/ui/Input";
import { cars, type CarCategory, type CarTransmission } from "@/lib/mock/cars";
import { useT } from "@/lib/i18n/I18nProvider";

type Mode = "selfDrive" | "withDriver";

export default function SearchPage() {
  const t = useT();
  const [mode, setMode] = useState<Mode>("selfDrive");
  const [category, setCategory] = useState<CarCategory | "all">("all");
  const [transmission, setTransmission] = useState<CarTransmission | "all">("all");
  const [capacityMin, setCapacityMin] = useState<number>(0);
  const [sort, setSort] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const rateOf = (c: typeof cars[number]) => (mode === "withDriver" ? c.rateWithDriver : c.rateSelfDrive);
    const list = cars
      .filter((c) => (category === "all" ? true : c.category === category))
      .filter((c) => (transmission === "all" ? true : c.transmission === transmission))
      .filter((c) => c.capacity >= capacityMin)
      .sort((a, b) => (sort === "asc" ? rateOf(a) - rateOf(b) : rateOf(b) - rateOf(a)));
    return list;
  }, [mode, category, transmission, capacityMin, sort]);

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)] py-12 md:py-16">
        <div className="container-folka">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h1 className="text-[32px] md:text-[40px] font-bold">{t("search.title")}</h1>
            <div className="flex items-center gap-2 text-[13px] text-[var(--color-muted)]">
              <span>{filtered.length} unit</span>
            </div>
          </div>

          <div className="flex gap-2 mb-8 flex-wrap">
            {(["selfDrive", "withDriver"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
                className={
                  mode === m
                    ? "px-4 py-2 text-[12px] font-bold uppercase tracking-[1.5px] bg-[var(--color-ink)] text-[var(--color-on-dark)] border border-[var(--color-ink)]"
                    : "px-4 py-2 text-[12px] font-bold uppercase tracking-[1.5px] bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                }
              >
                {m === "selfDrive" ? t("search.modeSelfDrive") : t("search.modeWithDriver")}
              </button>
            ))}
          </div>

          <div className="grid gap-8 md:grid-cols-12">
            <aside className="md:col-span-3">
              <h2 className="label-uppercase text-[var(--color-ink)] mb-6">{t("search.filtersTitle")}</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="cat">{t("search.filterCategory")}</Label>
                  <Select id="cat" value={category} onChange={(e) => setCategory(e.target.value as CarCategory | "all")}>
                    <option value="all">{t("common.all")}</option>
                    <option value="mpv">{t("categories.mpv")}</option>
                    <option value="suv">{t("categories.suv")}</option>
                    <option value="citycar">{t("categories.citycar")}</option>
                    <option value="premium">{t("categories.premium")}</option>
                    <option value="ev">{t("categories.ev")}</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="trans">{t("search.filterTransmission")}</Label>
                  <Select id="trans" value={transmission} onChange={(e) => setTransmission(e.target.value as CarTransmission | "all")}>
                    <option value="all">{t("common.all")}</option>
                    <option value="auto">{t("search.transmissionAuto")}</option>
                    <option value="manual">{t("search.transmissionManual")}</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="cap">{t("search.filterCapacity")}</Label>
                  <Select id="cap" value={String(capacityMin)} onChange={(e) => setCapacityMin(Number(e.target.value))}>
                    <option value="0">{t("common.all")}</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                    <option value="7">7+</option>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sort">{t("search.filterPrice")}</Label>
                  <Select id="sort" value={sort} onChange={(e) => setSort(e.target.value as "asc" | "desc")}>
                    <option value="asc">{t("search.sortPriceAsc")}</option>
                    <option value="desc">{t("search.sortPriceDesc")}</option>
                  </Select>
                </div>
              </div>
            </aside>

            <section className="md:col-span-9">
              {filtered.length === 0 ? (
                <div className="border border-[var(--color-hairline)] p-12 text-center">
                  <p className="text-[18px] font-bold mb-2">{t("search.empty")}</p>
                  <p className="text-[14px] text-[var(--color-muted)] mb-6">{t("search.emptyHint")}</p>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setCategory("all");
                      setTransmission("all");
                      setCapacityMin(0);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              ) : (
                <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((car) => (
                    <li key={car.slug}>
                      <CarCard car={car} mode={mode} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
