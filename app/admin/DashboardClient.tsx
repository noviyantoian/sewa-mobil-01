"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CalendarCheck,
  Car as CarIcon,
  CurrencyDollar,
  ChartPieSlice,
  ArrowRight,
  Check,
  X,
} from "@phosphor-icons/react";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CarCell } from "@/components/admin/CarCell";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import type { BookingStatus } from "@/lib/mock/bookings";
import type { UiCar } from "@/lib/repo";
import type { AdminBooking } from "./types";

const TODAY = "2026-06-14";
const REVENUE_STATUSES: BookingStatus[] = ["confirmed", "active", "completed"];

export function DashboardClient({
  cars,
  bookings,
}: {
  cars: UiCar[];
  bookings: AdminBooking[];
}) {
  const t = useT();
  const [queue, setQueue] = useState<AdminBooking[]>(() =>
    bookings.filter((b) => b.status === "pending")
  );

  const kpi = useMemo(() => {
    const todayCount = bookings.filter(
      (b) => b.pickupAt.startsWith(TODAY) || b.status === "active"
    ).length;
    const available = cars.filter((c) => c.available).length;
    const revenue = bookings
      .filter((b) => REVENUE_STATUSES.includes(b.status))
      .reduce((sum, b) => sum + b.total, 0);
    return { todayCount, available, revenue };
  }, [cars, bookings]);

  const recent = useMemo(
    () => [...bookings].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    [bookings]
  );

  const resolve = (id: string, approved: boolean) => {
    setQueue((q) => q.filter((b) => b.id !== id));
    toast(approved ? t("admin.approve") : t("admin.reject"), { description: id });
  };

  const columns: Column<AdminBooking>[] = [
    {
      key: "customer",
      header: t("admin.customer"),
      render: (b) => <span className="font-semibold text-[var(--color-ink)]">{b.customerName}</span>,
    },
    { key: "car", header: t("admin.car"), render: (b) => <CarCell car={b.car ?? undefined} /> },
    {
      key: "dates",
      header: t("admin.dates"),
      hideOnMobile: true,
      render: (b) => (
        <span className="tnum whitespace-nowrap text-[13px]">{formatDateRange(b.pickupAt, b.returnAt)}</span>
      ),
    },
    {
      key: "amount",
      header: t("admin.amount"),
      align: "right",
      render: (b) => <span className="tnum font-semibold text-[var(--color-ink)]">{formatIDR(b.total)}</span>,
    },
    {
      key: "status",
      header: t("admin.actions"),
      align: "right",
      render: (b) => <StatusBadge status={b.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <span className="eyebrow">{t("admin.title")}</span>
        <h1 className="display-sm">{t("admin.navOverview")}</h1>
        <p className="text-[14px] text-[var(--color-mute)]">{t("admin.today")} · 14 Jun 2026</p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label={t("admin.kpiBookings")}
          value={kpi.todayCount}
          icon={<CalendarCheck size={18} weight="bold" />}
          delta={{ value: "+2", up: true }}
          bars={[3, 5, 4, 6, 5, 8, 7]}
        />
        <StatCard
          label={t("admin.kpiAvailable")}
          value={`${kpi.available}/${cars.length}`}
          icon={<CarIcon size={18} weight="bold" />}
        />
        <StatCard
          label={t("admin.kpiRevenue")}
          value={formatIDR(kpi.revenue, { compact: true })}
          icon={<CurrencyDollar size={18} weight="bold" />}
          delta={{ value: "+18%", up: true }}
          bars={[4, 6, 5, 7, 9, 8, 11]}
        />
        <StatCard
          label={t("admin.kpiUtilization")}
          value="58%"
          icon={<ChartPieSlice size={18} weight="bold" />}
          delta={{ value: "-4%", up: false }}
          bars={[7, 6, 8, 5, 6, 5, 6]}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <section className="card shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
            <h2 className="text-[16px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.recentBookings")}
            </h2>
            <Link href="/admin/booking" className="link-arrow text-[13px]">
              {t("admin.viewAll")} <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <DataTable columns={columns} rows={recent} rowKey={(b) => b.id} />
        </section>

        <section className="card shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
            <h2 className="text-[16px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
              {t("admin.pendingVerif")}
            </h2>
            <Link href="/admin/verifikasi" className="link-arrow text-[13px]">
              {t("admin.viewAll")} <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
          <ul className="flex flex-col">
            {queue.length === 0 && (
              <li className="px-5 py-10 text-center text-[14px] text-[var(--color-mute)]">
                {t("status.completed")}
              </li>
            )}
            {queue.map((b) => (
              <li
                key={b.id}
                className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-5 py-3.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-semibold text-[var(--color-ink)]">{b.customerName}</div>
                  <div className="tnum text-[12px] text-[var(--color-mute)]">{b.id}</div>
                </div>
                <Button
                  size="sm"
                  variant="primary"
                  className="h-8 px-2.5"
                  onClick={() => resolve(b.id, true)}
                  aria-label={t("admin.approve")}
                >
                  <Check size={15} weight="bold" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 px-2.5"
                  onClick={() => resolve(b.id, false)}
                  aria-label={t("admin.reject")}
                >
                  <X size={15} weight="bold" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
