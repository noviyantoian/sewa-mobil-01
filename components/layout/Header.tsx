"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { LangSwitch } from "./LangSwitch";

export function Header() {
  const t = useT();
  return (
    <header className="sticky top-0 z-40 bg-[var(--color-canvas)]/95 backdrop-blur border-b border-[var(--color-hairline)]">
      <div className="container-folka h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="relative inline-flex items-center justify-center w-8 h-8 rounded-[6px] bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[14px] font-semibold">
            F
          </span>
          <span className="font-semibold text-[16px] tracking-[-0.16px] text-[var(--color-ink)]">
            {t("brand.name")}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          <Link href="/cari" className="text-[14px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent-blue-deep)] transition-colors">
            {t("nav.fleet")}
          </Link>
          <Link href="/cara-kerja" className="text-[14px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent-blue-deep)] transition-colors">
            {t("nav.howItWorks")}
          </Link>
          <Link href="/faq" className="text-[14px] font-medium text-[var(--color-ink)] hover:text-[var(--color-accent-blue-deep)] transition-colors">
            {t("nav.support")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
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
