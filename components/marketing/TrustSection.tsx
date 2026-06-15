"use client";

import Image from "next/image";
import { ShieldCheck, Sparkle, Lock, Headset, type Icon } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";

const points: { key: "p1" | "p2" | "p3" | "p4"; icon: Icon }[] = [
  { key: "p1", icon: ShieldCheck },
  { key: "p2", icon: Sparkle },
  { key: "p3", icon: Lock },
  { key: "p4", icon: Headset },
];

const stats: { key: "statBookings" | "statRepeat" | "statResponse"; value: string }[] = [
  { key: "statBookings", value: "12.800+" },
  { key: "statRepeat", value: "24%" },
  { key: "statResponse", value: "< 2 mnt" },
];

export function TrustSection() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-surface-dark)] text-[var(--color-on-dark)]">
      <div className="container-folka">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("trust.eyebrow")}</span>
          <h2 className="display-lg mt-4 text-white">{t("trust.title")}</h2>
          <p className="body-lg mt-4 text-[var(--color-on-dark-soft)]">{t("trust.subtitle")}</p>
        </Reveal>

        <div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-6 sm:mt-12 sm:gap-x-10 sm:gap-y-9">
          {points.map((p, i) => (
            <Reveal
              key={p.key}
              delay={((i % 3) + 1) as 1 | 2 | 3}
              className="flex gap-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] text-[var(--color-accent)] sm:h-12 sm:w-12">
                <p.icon size={24} weight="fill" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[19px]">
                  {t(`trust.${p.key}Title`)}
                </h3>
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[var(--color-on-dark-soft)] sm:text-[15px]">
                  {t(`trust.${p.key}Desc`)}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 overflow-hidden rounded-[24px] border border-[var(--color-hairline-dark)] sm:mt-14">
          <div className="relative aspect-[21/9] w-full">
            <Image
              src="/images/trust-fleet.webp"
              alt={t("trust.title")}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-dark)] via-transparent to-transparent"
            />
          </div>

          <div className="grid grid-cols-3 divide-x divide-[var(--color-hairline-dark)] bg-[var(--color-surface-dark-soft)]">
            {stats.map((s) => (
              <div key={s.key} className="flex flex-col items-center px-3 py-6 text-center sm:px-6 sm:py-8">
                <span className="tnum text-[28px] font-bold leading-none tracking-[-0.03em] text-white sm:text-[40px] md:text-[48px]">
                  {s.value}
                </span>
                <span className="mt-2.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--color-on-dark-soft)] sm:text-[13px]">
                  {t(`trust.${s.key}`)}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
