"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { locales } from "@/lib/i18n/config";

export function LangSwitch() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className="inline-flex items-center rounded-full border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-0.5"
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={
            "cursor-pointer rounded-full px-2.5 py-1 text-[12px] font-semibold uppercase tracking-wide transition-colors " +
            (locale === l
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-mute)] hover:text-[var(--color-ink)]")
          }
        >
          {l}
        </button>
      ))}
    </div>
  );
}
