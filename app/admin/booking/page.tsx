"use client";

import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import { bookings } from "@/lib/mock/bookings";
import { getCarBySlug } from "@/lib/mock/cars";

export default function AdminBookingPage() {
  const t = useT();
  return (
    <>
      <h1 className="text-[32px] font-bold mb-8">{t("admin.bookings")}</h1>
      <ul className="border-t border-[var(--color-hairline)]">
        {bookings.map((b) => {
          const car = getCarBySlug(b.carSlug);
          return (
            <li key={b.id} className="border-b border-[var(--color-hairline)] py-5 grid gap-3 md:grid-cols-12 md:items-center">
              <div className="md:col-span-2 label-uppercase text-[var(--color-muted)]">{b.id}</div>
              <div className="md:col-span-3">
                <div className="font-bold">{b.customerName}</div>
                <div className="text-[12px] text-[var(--color-muted)]">{b.customerPhone}</div>
              </div>
              <div className="md:col-span-3">
                <div className="text-[14px]">{car?.name}</div>
                <div className="text-[12px] text-[var(--color-muted)]">{formatDateRange(b.pickupAt, b.returnAt)}</div>
              </div>
              <div className="md:col-span-1 text-[12px] uppercase tracking-[1.5px] font-bold">{b.status}</div>
              <div className="md:col-span-1 text-right font-bold">{formatIDR(b.total)}</div>
              <div className="md:col-span-2 flex gap-2 justify-end">
                <Button size="sm" variant="primary">{t("admin.actionConfirm")}</Button>
                <Button size="sm" variant="secondary">{t("admin.actionCancel")}</Button>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
