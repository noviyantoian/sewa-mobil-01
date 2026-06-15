"use client";

import { Star, Quotes } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Reveal } from "@/components/ui/Reveal";

const items = ["t1", "t2", "t3"] as const;

export function Testimonials() {
  const t = useT();

  return (
    <section className="section bg-[var(--color-canvas)]">
      <div className="container-folka">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("testimonials.eyebrow")}</span>
          <h2 className="display-lg mt-4">{t("testimonials.title")}</h2>
        </Reveal>

        <div className="rail mt-10 md:mt-12 md:grid md:grid-cols-3 md:gap-5 md:mx-0 md:px-0 md:overflow-visible">
          {items.map((key, i) => (
            <Reveal key={key} delay={((i % 3) + 1) as 1 | 2 | 3} className="min-w-[85%] md:min-w-0">
              <figure className="flex h-full flex-col rounded-[20px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-7 shadow-sm transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:shadow-md">
                <Quotes
                  size={28}
                  weight="fill"
                  className="text-[var(--color-accent)] opacity-90"
                  aria-hidden
                />
                <div className="mt-4 flex items-center gap-0.5" aria-label="5 / 5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={16} weight="fill" className="text-[var(--color-accent)]" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-[var(--color-body)]">
                  {t(`testimonials.${key}`)}
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--color-hairline)] pt-5">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[15px] font-bold text-[var(--color-ink)]">
                    {t(`testimonials.${key}Name`).charAt(0)}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[15px] font-semibold leading-tight text-[var(--color-ink)]">
                      {t(`testimonials.${key}Name`)}
                    </span>
                    <span className="mt-0.5 text-[13px] text-[var(--color-mute)]">
                      {t(`testimonials.${key}Role`)}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
