"use client";

import Image from "next/image";
import { CheckCircle, Star } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { SearchBar } from "@/components/booking/SearchBar";

export function Hero() {
  const t = useT();

  const trustChips = [t("hero.noHidden"), t("hero.freeCancel"), t("hero.instant")];
  const stats = [
    { value: "4.9", label: t("hero.statRating") },
    { value: "120+", label: t("hero.statFleet") },
    { value: "3", label: t("hero.statCities") },
  ];

  return (
    <section className="relative overflow-hidden bg-[var(--color-canvas-warm)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
      />
      <div className="container-folka relative grid items-center gap-10 pb-14 pt-10 md:pt-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-28 lg:pt-20">
        <div className="min-w-0 max-w-2xl">
          <span className="eyebrow">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            {t("hero.eyebrow")}
          </span>

          <h1 className="display-2xl mt-5 text-balance">
            <span className="block">{t("hero.title")}</span>
            <span className="block text-[var(--color-accent)]">{t("hero.titleAccent")}</span>
          </h1>

          <p className="body-lg mt-6 max-w-xl text-[var(--color-body-mid)]">{t("hero.subtitle")}</p>

          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {trustChips.map((chip) => (
              <li key={chip} className="inline-flex items-center gap-2 text-[14px] font-semibold text-[var(--color-ink-strong)]">
                <CheckCircle size={18} weight="fill" className="text-[var(--color-success)]" />
                {chip}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <SearchBar variant="hero" />
          </div>

          <div className="mt-7 flex items-center gap-7">
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <span className="tnum text-[24px] font-bold leading-none tracking-[-0.02em] text-[var(--color-ink)]">
                  {s.value}
                </span>
                <span className="mt-1 text-[12px] font-medium text-[var(--color-mute)]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] shadow-xl">
            <Image
              src="/images/hero-mobile.webp"
              alt="Mobil FolkaDrive di jalan pesisir saat matahari terbit"
              fill
              priority
              sizes="48vw"
              className="object-cover object-center"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/40 to-transparent"
            />
          </div>

          <div className="glass absolute -left-7 top-10 flex items-center gap-3 rounded-[16px] border border-white/40 p-3.5 shadow-lg">
            <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-[var(--color-accent)]">
              <Star size={20} weight="fill" className="text-white" />
            </div>
            <div>
              <div className="tnum text-[18px] font-bold leading-none text-[var(--color-ink)]">4.9 / 5.0</div>
              <div className="mt-0.5 text-[12px] text-[var(--color-body-mid)]">2.400+ ulasan</div>
            </div>
          </div>

          <div className="glass absolute -bottom-6 right-2 max-w-[210px] rounded-[16px] border border-white/40 p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-60" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-success)]" />
              </span>
              <span className="text-[12px] font-bold uppercase tracking-[0.06em] text-[var(--color-success)]">
                {t("common.available")}
              </span>
            </div>
            <div className="mt-1.5 text-[15px] font-bold leading-tight text-[var(--color-ink)]">
              42 mobil siap hari ini
            </div>
            <div className="mt-0.5 text-[12px] text-[var(--color-body-mid)]">Jakarta · Bandung · Bali</div>
          </div>
        </div>
      </div>
    </section>
  );
}
