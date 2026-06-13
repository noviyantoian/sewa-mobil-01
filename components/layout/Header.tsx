"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { LangSwitch } from "./LangSwitch";

export function Header() {
  const t = useT();
  return (
    <header
      className="sticky top-0 z-40 bg-[var(--color-canvas)] border-b border-[var(--color-hairline)]"
      style={{ height: 64 }}
    >
      <div className="container-folka h-full flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block w-8 h-8 bg-[var(--color-primary)]" aria-hidden />
          <span className="font-bold text-[18px] tracking-[0.5px] text-[var(--color-ink)]">
            {t("brand.name")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/cari" className="text-[14px] text-[var(--color-ink)] hover:text-[var(--color-primary)]">
            {t("nav.fleet")}
          </Link>
          <Link href="/cara-kerja" className="text-[14px] text-[var(--color-ink)] hover:text-[var(--color-primary)]">
            {t("nav.howItWorks")}
          </Link>
          <Link href="/faq" className="text-[14px] text-[var(--color-ink)] hover:text-[var(--color-primary)]">
            {t("nav.support")}
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch />
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="secondary" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
          <Link href="/cari" className="inline-flex">
            <Button variant="primary" size="sm">
              {t("nav.search")}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
