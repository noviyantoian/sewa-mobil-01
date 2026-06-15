"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlass,
  IdentificationCard,
  Key,
  ArrowRight,
  type Icon,
} from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

const steps: { key: "step1" | "step2" | "step3"; icon: Icon }[] = [
  { key: "step1", icon: MagnifyingGlass },
  { key: "step2", icon: IdentificationCard },
  { key: "step3", icon: Key },
];

export function HowItWorks() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas)]">
      <div className="container-folka">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="flex flex-col">
            <span className="eyebrow">{t("how.eyebrow")}</span>
            <h2 className="display-lg mt-4">{t("how.title")}</h2>
            <p className="body-lg mt-4 text-[var(--color-body-mid)]">{t("how.subtitle")}</p>

            <div className="relative mt-8 overflow-hidden rounded-[20px] border border-[var(--color-hairline)]">
              <div className="relative aspect-[16/10] sm:aspect-[4/3]">
                <Image
                  src="/images/how-2-pickup.webp"
                  alt={t("how.step3Title")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="mt-8 hidden lg:block">
              <Link href="/cari" className="inline-flex">
                <Button variant="primary" size="lg">
                  {t("how.cta")}
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </Link>
            </div>
          </Reveal>

          <ol className="flex flex-col">
            {steps.map((s, i) => {
              const last = i === steps.length - 1;
              return (
                <Reveal
                  key={s.key}
                  delay={((i % 3) + 1) as 1 | 2 | 3}
                  as="li"
                  className="flex gap-5"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-sm">
                      <s.icon size={24} weight="regular" />
                    </div>
                    {!last && (
                      <span
                        aria-hidden
                        className="my-2 w-px flex-1 bg-[var(--color-hairline)]"
                      />
                    )}
                  </div>
                  <div className={cn("pt-1.5", last ? "pb-0" : "pb-10")}>
                    <span className="tnum text-[13px] font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1.5 text-[22px] font-semibold leading-tight tracking-[-0.02em] text-[var(--color-ink)]">
                      {t(`how.${s.key}Title`)}
                    </h3>
                    <p className="mt-2 max-w-md text-[15px] leading-relaxed text-[var(--color-body-mid)]">
                      {t(`how.${s.key}Desc`)}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>

        <div className="mt-10 lg:hidden">
          <Link href="/cari" className="inline-flex w-full">
            <Button variant="primary" size="lg" className="w-full">
              {t("how.cta")}
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
