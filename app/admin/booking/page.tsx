"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Key, SteeringWheel, ArrowRight } from "@phosphor-icons/react";
import { DataTable, type Column } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { CarCell } from "@/components/admin/CarCell";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn, formatIDR, formatDateRange } from "@/lib/format";
import { bookings, type Booking, type BookingStatus } from "@/lib/mock/bookings";
import { getCarBySlug } from "@/lib/mock/cars";

const STATUSES: BookingStatus[] = ["pending", "confirmed", "active", "completed", "cancelled"];

export default function AdminBookingsPage() {
  const t = useT();
  const [filter, setFilter] = useState<BookingStatus | "all">("all");

  const rows = useMemo(
    () => (filter === "all" ? bookings : bookings.filter((b) => b.status === filter)),
    [filter]
  );

  const columns: Column<Booking>[] = [
    {
      key: "id",
      header: "#",
      render: (b) => <span className="tnum text-[13px] font-semibold text-[var(--color-mute)]">{b.id}</span>,
    },
    {
      key: "customer",
      header: t("admin.customer"),
      render: (b) => (
        <div>
          <div className="font-semibold text-[var(--color-ink)]">{b.customerName}</div>
          <div className="tnum text-[12px] text-[var(--color-mute)]">{b.customerPhone}</div>
        </div>
      ),
    },
    { key: "car", header: t("admin.car"), hideOnMobile: true, render: (b) => <CarCell car={getCarBySlug(b.carSlug)} /> },
    {
      key: "dates",
      header: t("admin.dates"),
      hideOnMobile: true,
      render: (b) => (
        <span className="tnum whitespace-nowrap text-[13px]">{formatDateRange(b.pickupAt, b.returnAt)}</span>
      ),
    },
    {
      key: "mode",
      header: t("admin.actions"),
      align: "center",
      hideOnMobile: true,
      render: (b) => (
        <span
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-canvas-soft)] text-[var(--color-body-mid)]"
          title={b.mode}
        >
          {b.mode === "withDriver" ? <SteeringWheel size={15} /> : <Key size={15} />}
        </span>
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
      header: t("status.confirmed"),
      align: "right",
      render: (b) => <StatusBadge status={b.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <span className="eyebrow">{t("admin.navBookings")}</span>
        <h1 className="display-sm">{t("admin.bookingsTitle")}</h1>
      </header>

      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          {t("common.all")}
        </FilterChip>
        {STATUSES.map((s) => (
          <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
            {t(`status.${s}`)}
          </FilterChip>
        ))}
      </div>

      <section className="card shadow-sm">
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(b) => b.id}
          empty={t("common.loading")}
          actionsHeader={null}
          actions={(b) => (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2.5"
              onClick={() => toast(b.id, { description: b.customerName })}
              aria-label={t("common.viewDetails")}
            >
              <ArrowRight size={16} />
            </Button>
          )}
        />
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 cursor-pointer rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-colors duration-150",
        active
          ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
          : "border-[var(--color-hairline-strong)] bg-[var(--color-canvas)] text-[var(--color-body)] hover:border-[var(--color-ink)]"
      )}
    >
      {children}
    </button>
  );
}
