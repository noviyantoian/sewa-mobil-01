"use client";

import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import { bookings } from "@/lib/mock/bookings";
import { cars } from "@/lib/mock/cars";

export default function AdminDashboard() {
  const t = useT();
  const todayBookings = bookings.filter((b) => b.status === "active" || b.status === "confirmed").length;
  const availableUnits = cars.filter((c) => c.available).length;
  const revenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.total, 0);
  const pendingDocs = 3;

  const stats: Array<{ label: string; value: string }> = [
    { label: t("admin.todayBookings"), value: String(todayBookings) },
    { label: t("admin.available"), value: `${availableUnits} / ${cars.length}` },
    { label: t("admin.revenue"), value: formatIDR(revenue) },
    { label: t("admin.pendingDocs"), value: String(pendingDocs) },
  ];

  return (
    <>
      <h1 className="text-[32px] font-bold mb-10">{t("admin.title")}</h1>
      <ul className="grid gap-px bg-[var(--color-hairline)] grid-cols-2 md:grid-cols-4 border border-[var(--color-hairline)]">
        {stats.map((s) => (
          <li key={s.label} className="bg-[var(--color-canvas)] p-6">
            <div className="label-uppercase text-[var(--color-muted)] mb-3">{s.label}</div>
            <div className="text-[28px] md:text-[32px] font-bold text-[var(--color-ink)]">{s.value}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
