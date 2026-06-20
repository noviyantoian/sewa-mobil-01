"use client";

import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import type { UiCar } from "@/lib/repo";
import { CarCard } from "@/components/booking/CarCard";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function FeaturedCars({ cars }: { cars: UiCar[] }) {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas-warm)]">
      <div className="container-folka">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="eyebrow">{t("featured.eyebrow")}</span>
            <h2 className="display-lg mt-4">{t("featured.title")}</h2>
            <p className="body-lg mt-4 text-[var(--color-body-mid)]">{t("featured.subtitle")}</p>
          </div>
          <Link href="/cari" className="hidden shrink-0 md:inline-flex">
            <Button variant="secondary" size="lg">
              {t("featured.cta")}
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
        </Reveal>

        <div className="rail mt-10 sm:mt-12 sm:grid sm:grid-cols-2 sm:gap-5 sm:mx-0 sm:px-0 sm:overflow-visible lg:grid-cols-3">
          {cars.map((car, i) => (
            <Reveal key={car.slug} delay={((i % 3) + 1) as 1 | 2 | 3} className="min-w-[80%] sm:min-w-0">
              <CarCard car={car} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:hidden">
          <Link href="/cari" className="inline-flex w-full">
            <Button variant="secondary" size="lg" className="w-full">
              {t("featured.cta")}
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
