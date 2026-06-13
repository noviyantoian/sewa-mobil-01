"use client";

import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import { bookings } from "@/lib/mock/bookings";
import { getCarBySlug } from "@/lib/mock/cars";

const statusColor: Record<string, string> = {
  pending: "bg-[var(--color-warning)] text-white",
  confirmed: "bg-[var(--color-primary)] text-white",
  active: "bg-[var(--color-success)] text-white",
  completed: "bg-[var(--color-surface-strong)] text-[var(--color-ink)]",
  cancelled: "bg-[var(--color-hairline-strong)] text-[var(--color-ink)]",
};

export default function AccountBookingPage() {
  const t = useT();

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)] py-12 md:py-16">
        <div className="container-folka">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-2">{t("account.title")}</h1>
          <p className="text-[var(--color-body)] mb-10">{t("account.subtitle")}</p>

          <ul className="border-t border-[var(--color-hairline)]">
            {bookings.map((b) => {
              const car = getCarBySlug(b.carSlug);
              return (
                <li key={b.id} className="border-b border-[var(--color-hairline)] py-6 grid gap-4 md:grid-cols-12 md:items-center">
                  <div className="md:col-span-3 label-uppercase text-[var(--color-muted)]">
                    {t("account.bookingId", { id: b.id })}
                  </div>
                  <div className="md:col-span-4">
                    <div className="text-[16px] font-bold text-[var(--color-ink)]">
                      {car?.name ?? b.carSlug}
                    </div>
                    <div className="text-[13px] text-[var(--color-muted)]">{car?.brand} - {car?.color}</div>
                  </div>
                  <div className="md:col-span-3 text-[13px] text-[var(--color-body)]">
                    {formatDateRange(b.pickupAt, b.returnAt)}
                  </div>
                  <div className="md:col-span-1">
                    <span className={`inline-block px-2 py-1 text-[10px] font-bold uppercase tracking-[1.5px] ${statusColor[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="md:col-span-1 text-right font-bold">{formatIDR(b.total)}</div>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 text-center">
            <Link href="/cari"><Button variant="primary">{t("nav.search")}</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
