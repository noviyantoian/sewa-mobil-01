"use client";

// TODO SEO: admin noindex. This shell is a client component, so it cannot
// export `metadata`/robots, and admin pages are client components too. When
// auth lands, gate /admin behind auth (auth'd routes are excluded from
// indexing) or move noindex to middleware / a server route group wrapper.

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Gauge,
  Car as CarIcon,
  CalendarBlank,
  ListChecks,
  IdentificationCard,
  SteeringWheel,
  MapPin,
  UsersThree,
  GearSix,
  List,
  X,
  ArrowSquareOut,
  SignOut,
} from "@phosphor-icons/react";
import { Logo } from "@/components/layout/Logo";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

type NavItem = {
  href: string;
  key: string;
  icon: ReactNode;
};

const nav: NavItem[] = [
  { href: "/admin", key: "admin.navOverview", icon: <Gauge size={20} /> },
  { href: "/admin/armada", key: "admin.navFleet", icon: <CarIcon size={20} /> },
  { href: "/admin/kalender", key: "admin.navCalendar", icon: <CalendarBlank size={20} /> },
  { href: "/admin/booking", key: "admin.navBookings", icon: <ListChecks size={20} /> },
  { href: "/admin/verifikasi", key: "admin.navVerification", icon: <IdentificationCard size={20} /> },
  { href: "/admin/sopir", key: "admin.navDrivers", icon: <SteeringWheel size={20} /> },
  { href: "/admin/lokasi", key: "admin.navLocations", icon: <MapPin size={20} /> },
  { href: "/admin/pengguna", key: "admin.navUsers", icon: <UsersThree size={20} /> },
  { href: "/admin/pengaturan", key: "admin.navSettings", icon: <GearSix size={20} /> },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const t = useT();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await createClient().auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  };

  // Login page renders bare (no admin shell — user isn't authenticated yet).
  if (pathname === "/admin/login") return <>{children}</>;

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const navList = (
    <nav className="flex flex-col gap-1" aria-label={t("admin.title")}>
      {nav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[14px] font-semibold tracking-[-0.01em] transition-colors duration-150",
              active
                ? "bg-[var(--color-accent)] text-white"
                : "text-[var(--color-on-dark-soft)] hover:bg-white/10 hover:text-white"
            )}
          >
            <span className={cn(active ? "text-white" : "text-[var(--color-on-dark-soft)] group-hover:text-white")}>
              {item.icon}
            </span>
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInner = (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <div className="flex items-center justify-between px-2">
        <Link href="/admin" aria-label="FolkaDrive">
          <Logo dark />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-on-dark-soft)] hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <span className="mx-2 inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold tracking-[0.04em] text-[var(--color-on-dark-soft)]">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-success)]" aria-hidden />
        {t("admin.live")}
      </span>

      {navList}

      <div className="mt-auto flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--color-on-dark-soft)] transition-colors hover:bg-white/10 hover:text-white"
        >
          <ArrowSquareOut size={17} />
          FolkaDrive
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex cursor-pointer items-center gap-2 rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-[var(--color-on-dark-soft)] transition-colors hover:bg-white/10 hover:text-white"
        >
          <SignOut size={17} />
          {t("admin.logout")}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-canvas-soft)] lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-[var(--color-surface-dark)] lg:block">
        {sidebarInner}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-hairline)] bg-[var(--color-canvas)] px-4 py-3 lg:hidden">
        <Link href="/admin" aria-label="FolkaDrive">
          <Logo />
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]"
          aria-label="Open menu"
        >
          <List size={20} />
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[var(--color-surface-dark)] shadow-xl">
            {sidebarInner}
          </aside>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <div className="mx-auto max-w-[1200px] px-4 py-7 md:px-8 md:py-10">{children}</div>
      </main>
    </div>
  );
}
