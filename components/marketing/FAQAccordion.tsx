"use client";

import { useState } from "react";
import { useT } from "@/lib/i18n/I18nProvider";

const keys = ["q1", "q2", "q3", "q4", "q5"] as const;

export function FAQAccordion() {
  const t = useT();
  const [open, setOpen] = useState<string | null>(keys[0]);

  return (
    <section className="bg-[var(--color-canvas)] py-20 md:py-[80px]">
      <div className="container-folka max-w-3xl">
        <h2 className="text-[32px] md:text-[48px] font-bold mb-10">{t("faq.title")}</h2>
        <ul className="divide-y divide-[var(--color-hairline)] border-t border-b border-[var(--color-hairline)]">
          {keys.map((k) => {
            const isOpen = open === k;
            const answerKey = k.replace("q", "a") as `a${1 | 2 | 3 | 4 | 5}`;
            return (
              <li key={k}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : k)}
                  className="w-full flex items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-[18px] md:text-[20px] font-bold text-[var(--color-ink)]">
                    {t(`faq.${k}`)}
                  </span>
                  <span
                    aria-hidden
                    className={`text-[24px] font-light transition-transform ${isOpen ? "rotate-45" : ""} text-[var(--color-muted)]`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="pb-6 text-[16px] text-[var(--color-body)] leading-relaxed max-w-2xl">
                    {t(`faq.${answerKey}`)}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
