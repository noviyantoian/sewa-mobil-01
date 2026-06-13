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
    <div className="flex items-center gap-1 text-[12px] font-bold uppercase tracking-[1px]">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span className="text-[var(--color-hairline-strong)]">/</span>}
          <button
            type="button"
            onClick={() => setLocale(l)}
            className={
              l === locale
                ? "text-[var(--color-ink)]"
                : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
            }
            aria-pressed={l === locale}
          >
            {l.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  );
}
