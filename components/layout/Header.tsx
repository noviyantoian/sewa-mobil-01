"use client";

import Link from "next/link";
import { useState } from "react";
import { List, X } from "@phosphor-icons/react";
import { useT } from "@/lib/i18n/I18nProvider";
import { Button } from "@/components/ui/Button";
import { LangSwitch } from "./LangSwitch";
import { Logo } from "./Logo";

const navItems = [
  { href: "/cari", key: "nav.fleet" },
  { href: "/cara-kerja", key: "nav.howItWorks" },
  { href: "/faq", key: "nav.support" },
  { href: "/kontak", key: "nav.contact" },
] as const;

export function Header() {
  const t = useT();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-hairline)] bg-[color-mix(in_srgb,var(--color-canvas)_82%,transparent)] backdrop-blur-md">
      <div className="container-folka flex h-16 items-center justify-between gap-6">
        <Link href="/" className="shrink-0" aria-label="FolkaDrive">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Utama">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[14px] font-semibold text-[var(--color-ink)] transition-colors hover:text-[var(--color-accent)]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LangSwitch />
          </div>
          <Link href="/login" className="hidden md:inline-flex">
            <Button variant="ghost" size="sm">
              {t("nav.login")}
            </Button>
          </Link>
          <Link href="/cari" className="hidden md:inline-flex">
            <Button variant="primary" size="sm">
              {t("nav.search")}
            </Button>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)] md:hidden"
            aria-label={open ? "Tutup menu" : "Buka menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--color-hairline)] bg-[var(--color-canvas)] md:hidden">
          <nav className="container-folka flex flex-col gap-1 py-4" aria-label="Mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-[10px] px-3 py-3 text-[16px] font-semibold text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]"
              >
                {t(item.key)}
              </Link>
            ))}
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-[var(--color-hairline)] pt-4">
              <LangSwitch />
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="secondary" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/cari" onClick={() => setOpen(false)}>
                  <Button variant="primary" size="sm">
                    {t("nav.search")}
                  </Button>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
