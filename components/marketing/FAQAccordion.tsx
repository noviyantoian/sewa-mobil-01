"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";

const keys = ["q1", "q2", "q3", "q4", "q5"] as const;

export function FAQAccordion() {
  const t = useT();
  const [open, setOpen] = useState<string | null>(keys[0]);

  return (
    <section className="bg-[var(--color-canvas-soft)] py-20 md:py-[96px]">
      <div className="container-folka grid lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="eyebrow text-[var(--color-mute)] mb-4">FAQ</div>
          <h2 className="!text-[44.8px] md:!text-[56px] !leading-[1.04]">{t("faq.title")}</h2>
        </div>

        <div className="lg:col-span-8">
          <ul className="bg-[var(--color-canvas)] border border-[var(--color-hairline)] rounded-[12px] overflow-hidden">
            {keys.map((k, i) => {
              const isOpen = open === k;
              const answerKey = k.replace("q", "a") as `a${1 | 2 | 3 | 4 | 5}`;
              return (
                <li
                  key={k}
                  className={i > 0 ? "border-t border-[var(--color-hairline)]" : ""}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpen(isOpen ? null : k)}
                    className="w-full flex items-center justify-between gap-6 p-6 text-left hover:bg-[var(--color-canvas-soft)] transition-colors"
                  >
                    <span className="text-[18px] md:text-[20px] font-medium text-[var(--color-ink)]">
                      {t(`faq.${k}`)}
                    </span>
                    <span
                      aria-hidden
                      className={`flex-shrink-0 w-9 h-9 rounded-full border border-[var(--color-hairline)] flex items-center justify-center text-[18px] font-light transition-transform ${isOpen ? "rotate-45 bg-[var(--color-primary)] text-[var(--color-on-primary)] border-[var(--color-primary)]" : "text-[var(--color-ink)]"}`}
                    >
                      +
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 -mt-2">
                      <p className="text-[16px] text-[var(--color-body)] leading-relaxed max-w-2xl">
                        {t(`faq.${answerKey}`)}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
