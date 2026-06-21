"use client";

import Link from "next/link";
import { DriverForm, type DriverFormState } from "../DriverForm";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatDateRange } from "@/lib/format";
import type { BookingStatus } from "@/lib/db/schema";

export interface DriverBookingVM {
  code: string;
  customerName: string;
  carName: string;
  fromAt: string; // ISO
  toAt: string; // ISO
  status: BookingStatus;
}

export function DriverDetail({
  driverId,
  initial,
  bookings,
}: {
  driverId: string;
  initial: DriverFormState;
  bookings: DriverBookingVM[];
}) {
  const t = useT();
  return (
    <div className="flex flex-col gap-6">
      <DriverForm driverId={driverId} initial={initial} />

      <section className="card shadow-sm p-6">
        <h2 className="mb-3 text-[15px] font-bold uppercase tracking-[0.08em] text-[var(--color-mute)]">
          {t("admin.driverAssignedBookings")}
        </h2>
        {bookings.length === 0 ? (
          <p className="text-[14px] text-[var(--color-mute)]">{t("admin.driverNoBookings")}</p>
        ) : (
          <ul className="flex flex-col">
            {bookings.map((b) => (
              <li
                key={b.code}
                className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-hairline)] py-3 first:border-t-0 first:pt-0"
              >
                <div className="flex flex-col gap-0.5">
                  <Link
                    href={`/admin/booking/${encodeURIComponent(b.code)}`}
                    className="tnum text-[13px] font-semibold text-[var(--color-accent)] hover:underline"
                  >
                    {b.code}
                  </Link>
                  <span className="text-[13px] text-[var(--color-body)]">
                    {b.carName} · {b.customerName}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="tnum text-[12px] text-[var(--color-mute)]">
                    {formatDateRange(b.fromAt.slice(0, 10), b.toAt.slice(0, 10))}
                  </span>
                  <StatusBadge status={b.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
