"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Car as CarIcon,
  CurrencyDollar,
  ChartPieSlice,
  ArrowRight,
  CaretRight,
} from "@phosphor-icons/react";
import { StatCard } from "@/components/admin/StatCard";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CarCell } from "@/components/admin/CarCell";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange, cn } from "@/lib/format";
import type { BookingStatus } from "@/lib/mock/bookings";
import type { UiCar } from "@/lib/repo";
import type { AdminBooking, AdminUnit } from "./types";

const TODAY = "2026-06-14";
const REVENUE_STATUSES: BookingStatus[] = ["confirmed", "active", "completed"];

export function DashboardClient({
  cars,
  bookings,
  units,
}: {
  cars: UiCar[];
  bookings: AdminBooking[];
  units: AdminUnit[];
}) {
  const t = useT();
  const router = useRouter();

  // Manual verification queue is read-only here — admin opens the booking to
  // approve/reject, never a one-click checklist (verification stays deliberate).
  const queue = useMemo(
    () => bookings.filter((b) => b.status === "pending"),
    [bookings],
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

  // Running first (out on a job), then free units, maintenance last.
  const sortedUnits = useMemo(() => {
    const rank = (u: AdminUnit) =>
      u.running ? 0 : u.status === "maintenance" ? 2 : 1;
    return [...units].sort(
      (a, b) => rank(a) - rank(b) || a.plate.localeCompare(b.plate),
    );
  }, [units]);

  const runningCount = sortedUnits.filter((u) => u.running).length;
  const availableCount = sortedUnits.filter(
    (u) => !u.running && u.status === "available",
  ).length;

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
          <DataTable
            columns={columns}
            rows={recent}
            rowKey={(b) => b.id}
            onRowClick={(b) => router.push(`/admin/booking/${b.id}`)}
          />
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
              <li key={b.id} className="border-b border-[var(--color-hairline)] last:border-0">
                <Link
                  href={`/admin/booking/${b.id}`}
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--color-canvas-soft)] focus-visible:bg-[var(--color-canvas-soft)] focus-visible:outline-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-semibold text-[var(--color-ink)]">{b.customerName}</div>
                    <div className="tnum text-[12px] text-[var(--color-mute)]">{b.id}</div>
                  </div>
                  <span className="label-caps text-[11px] text-[var(--color-primary)]">
                    {t("admin.verify")}
                  </span>
                  <CaretRight size={16} weight="bold" className="text-[var(--color-mute)]" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card shadow-sm flex flex-col">
        <div className="flex items-center justify-between border-b border-[var(--color-hairline)] px-5 py-4">
          <h2 className="text-[16px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
            {t("admin.unitStatus")}
          </h2>
          <div className="flex items-center gap-3 text-[12px] text-[var(--color-mute)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--color-warning)]" />
              {runningCount} {t("admin.unitRunning")}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--color-success)]" />
              {availableCount} {t("admin.unitAvailable")}
            </span>
          </div>
        </div>
        {sortedUnits.length === 0 ? (
          <div className="px-5 py-10 text-center text-[14px] text-[var(--color-mute)]">
            {t("admin.unitEmpty")}
          </div>
        ) : (
          <ul className="grid gap-px bg-[var(--color-hairline)] sm:grid-cols-2 lg:grid-cols-3">
            {sortedUnits.map((u) => (
              <li key={u.id} className="flex flex-col gap-1 bg-[var(--color-canvas)] px-5 py-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="tnum font-bold text-[var(--color-ink)]">{u.plate}</span>
                  <UnitTag unit={u} t={t} />
                </div>
                <span className="text-[13px] text-[var(--color-body)]">{u.carName}</span>
                {u.running && u.booking && (
                  <span className="text-[12px] text-[var(--color-mute)]">
                    {u.booking.customerName ?? "—"}
                    {u.booking.driverName ? ` · ${u.booking.driverName}` : ""}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function UnitTag({ unit, t }: { unit: AdminUnit; t: (k: string) => string }) {
  const tone = unit.running
    ? "bg-[var(--color-warning)]/12 text-[var(--color-warning)]"
    : unit.status === "maintenance"
      ? "bg-[var(--color-hairline)] text-[var(--color-mute)]"
      : "bg-[var(--color-success)]/12 text-[var(--color-success)]";
  const label = unit.running
    ? t("admin.unitRunning")
    : unit.status === "maintenance"
      ? t("admin.unitMaintenance")
      : t("admin.unitAvailable");
  return (
    <span className={cn("label-caps shrink-0 px-2 py-0.5 text-[10px]", tone)}>{label}</span>
  );
}
