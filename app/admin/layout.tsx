"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { useT } from "@/lib/i18n/I18nProvider";

const tabs = [
  { href: "/admin", key: "title" },
  { href: "/admin/armada", key: "fleet" },
  { href: "/admin/kalender", key: "calendar" },
  { href: "/admin/booking", key: "bookings" },
  { href: "/admin/verifikasi", key: "verification" },
  { href: "/admin/sopir", key: "drivers" },
] as const;

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useT();
  const pathname = usePathname();

  return (
    <>
      <Header />
      <div className="bg-[var(--color-surface-soft)] border-b border-[var(--color-hairline)]">
        <div className="container-folka flex items-center gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const active = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={
                  active
                    ? "px-4 py-4 text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-ink)] border-b-2 border-[var(--color-ink)]"
                    : "px-4 py-4 text-[12px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] border-b-2 border-transparent hover:text-[var(--color-ink)]"
                }
              >
                {t(`admin.${tab.key}`)}
              </Link>
            );
          })}
        </div>
      </div>
      <main className="bg-[var(--color-canvas)] py-12">
        <div className="container-folka">{children}</div>
      </main>
    </>
  );
}
