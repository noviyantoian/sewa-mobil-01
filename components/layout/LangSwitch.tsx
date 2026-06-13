"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { locales, type Locale } from "@/lib/i18n/config";

export function LangSwitch() {
  const { locale } = useI18n();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const setLocale = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `folkadrive_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    startTransition(() => router.refresh());
  };

  return (
    <div className="hidden sm:inline-flex items-center gap-px bg-[var(--color-canvas-soft)] border border-[var(--color-hairline)] rounded-[6px] p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          className={
            l === locale
              ? "px-2.5 py-1 text-[12px] font-medium rounded-[4px] bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-sm"
              : "px-2.5 py-1 text-[12px] font-medium rounded-[4px] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
          }
          aria-pressed={l === locale}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
