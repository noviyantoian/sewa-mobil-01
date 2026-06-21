"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, ArrowRight } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { asset } from "@/lib/asset";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function ModeCompare() {
  const t = useT();

  const selfBullets = [t("modes.selfDriveB1"), t("modes.selfDriveB2"), t("modes.selfDriveB3")];
  const driverBullets = [t("modes.withDriverB1"), t("modes.withDriverB2"), t("modes.withDriverB3")];

  return (
    <section className="section bg-[var(--color-canvas-soft)]">
      <div className="container-folka">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("modes.eyebrow")}</span>
          <h2 className="display-lg mt-4">{t("modes.title")}</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Self-drive — light card */}
          <Reveal delay={1}>
            <article className="flex h-full flex-col overflow-hidden rounded-[24px] border border-[var(--color-hairline)] bg-[var(--color-canvas)]">
              <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={asset("/images/feature-self-drive.webp")}
                  alt={t("modes.selfDriveTitle")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[600ms] ease-out hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7 md:p-8">
                <h3 className="display-sm">{t("modes.selfDriveTitle")}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-body-mid)]">
                  {t("modes.selfDriveDesc")}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {selfBullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] text-[var(--color-ink-strong)]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
                        <Check size={14} weight="bold" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex-1" />
                <Link href="/cari?mode=selfDrive" className="inline-flex">
                  <Button variant="primary" size="lg" className="w-full sm:w-auto">
                    {t("modes.cta")}
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                </Link>
              </div>
            </article>
          </Reveal>

          {/* With-driver — dark card */}
          <Reveal delay={2}>
            <article className="flex h-full flex-col overflow-hidden rounded-[24px] bg-[var(--color-surface-dark)] text-[var(--color-on-dark)]">
              <div className="relative aspect-[2/1] overflow-hidden sm:aspect-[16/10]">
                <Image
                  src={asset("/images/feature-with-driver.webp")}
                  alt={t("modes.withDriverTitle")}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[600ms] ease-out hover:scale-[1.03]"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7 md:p-8">
                <h3 className="display-sm text-white">{t("modes.withDriverTitle")}</h3>
                <p className="mt-3 text-[16px] leading-relaxed text-[var(--color-on-dark-soft)]">
                  {t("modes.withDriverDesc")}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {driverBullets.map((b) => (
                    <li key={b} className="flex items-center gap-3 text-[15px] text-white">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] text-[var(--color-accent)]">
                        <Check size={14} weight="bold" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 flex-1" />
                <Link href="/cari?mode=withDriver" className="inline-flex">
                  <Button variant="secondary-dark" size="lg" className="w-full sm:w-auto">
                    {t("modes.cta")}
                    <ArrowRight size={18} weight="bold" />
                  </Button>
                </Link>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
