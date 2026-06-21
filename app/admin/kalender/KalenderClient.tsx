"use client";

import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  format,
  isSameMonth,
  isWithinInterval,
  parseISO,
  differenceInCalendarDays,
  max as maxDate,
  min as minDate,
} from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { CarCell } from "@/components/admin/CarCell";
import { useT } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/format";
import type { UiCar } from "@/lib/repo";
import type { BookingStatus } from "@/lib/mock/bookings";
import type { AdminBooking } from "../types";

const ANCHOR = new Date(2026, 7, 1); // August 2026 — where the seeded demo booking lives

const statusColor: Record<BookingStatus, string> = {
  pending: "var(--color-warning)",
  confirmed: "var(--color-accent)",
  active: "var(--color-success)",
  completed: "var(--color-mute-soft)",
  cancelled: "var(--color-error)",
};

const LEGEND: BookingStatus[] = ["pending", "confirmed", "active", "completed"];

export function KalenderClient({
  cars,
  bookings,
}: {
  cars: UiCar[];
  bookings: AdminBooking[];
}) {
  const t = useT();
  const [cursor, setCursor] = useState<Date>(ANCHOR);

  const monthStart = startOfMonth(cursor);
  const monthEnd = endOfMonth(cursor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = useMemo(() => eachDayOfInterval({ start: gridStart, end: gridEnd }), [gridStart, gridEnd]);

  const totalDays = monthEnd.getDate();

  const monthBookings = useMemo(
    () =>
      bookings.filter(
        (b) =>
          isWithinInterval(parseISO(b.pickupAt), { start: monthStart, end: monthEnd }) ||
          isWithinInterval(parseISO(b.returnAt), { start: monthStart, end: monthEnd })
      ),
    [bookings, monthStart, monthEnd]
  );

  const countForDay = (d: Date) =>
    monthBookings.filter((b) =>
      isWithinInterval(d, { start: parseISO(b.pickupAt), end: parseISO(b.returnAt) })
    );

  const weekdays = useMemo(
    () =>
      eachDayOfInterval({ start: gridStart, end: endOfWeek(gridStart, { weekStartsOn: 1 }) }).map((d) =>
        format(d, "EEEEEE", { locale: idLocale })
      ),
    [gridStart]
  );

  const carsWithBookings = cars.filter((c) => monthBookings.some((b) => b.carSlug === c.slug));

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow">{t("admin.navCalendar")}</span>
          <h1 className="display-sm">{t("admin.calendarTitle")}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCursor((c) => addMonths(c, -1))}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]"
            aria-label="−1"
          >
            <CaretLeft size={16} weight="bold" />
          </button>
          <span className="min-w-[150px] text-center text-[15px] font-bold capitalize text-[var(--color-ink)]">
            {format(cursor, "MMMM yyyy", { locale: idLocale })}
          </span>
          <button
            type="button"
            onClick={() => setCursor((c) => addMonths(c, 1))}
            className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-[10px] border border-[var(--color-hairline-strong)] text-[var(--color-ink)] hover:bg-[var(--color-canvas-soft)]"
            aria-label="+1"
          >
            <CaretRight size={16} weight="bold" />
          </button>
        </div>
      </header>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {LEGEND.map((s) => (
          <span key={s} className="inline-flex items-center gap-1.5 text-[12px] text-[var(--color-body-mid)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: statusColor[s] }} aria-hidden />
            {t(`status.${s}`)}
          </span>
        ))}
      </div>

      {/* Month grid */}
      <section className="card shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-[var(--color-hairline)] bg-[var(--color-canvas-soft)]">
          {weekdays.map((w, i) => (
            <div
              key={i}
              className="px-2 py-2.5 text-center text-[11px] font-semibold uppercase capitalize tracking-[0.06em] text-[var(--color-mute)]"
            >
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d) => {
            const inMonth = isSameMonth(d, monthStart);
            const list = inMonth ? countForDay(d) : [];
            return (
              <div
                key={d.toISOString()}
                className={cn(
                  "flex min-h-[78px] flex-col gap-1.5 border-b border-r border-[var(--color-hairline)] p-2 [&:nth-child(7n)]:border-r-0",
                  !inMonth && "bg-[var(--color-canvas-soft)]"
                )}
              >
                <span
                  className={cn(
                    "tnum text-[12px] font-semibold",
                    inMonth ? "text-[var(--color-ink)]" : "text-[var(--color-mute-soft)]"
                  )}
                >
                  {format(d, "d")}
                </span>
                {list.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {list.slice(0, 4).map((b) => (
                      <span
                        key={b.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: statusColor[b.status] }}
                        title={`${b.id} · ${b.customerName}`}
                        aria-hidden
                      />
                    ))}
                    {list.length > 4 && (
                      <span className="tnum text-[10px] font-semibold text-[var(--color-mute)]">
                        +{list.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Per-car timeline */}
      <section className="card shadow-sm overflow-hidden">
        <div className="border-b border-[var(--color-hairline)] px-5 py-4">
          <h2 className="text-[16px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
            {t("admin.navFleet")}
          </h2>
        </div>
        <ul className="flex flex-col">
          {carsWithBookings.length === 0 && (
            <li className="px-5 py-10 text-center text-[14px] text-[var(--color-mute)]">{t("common.loading")}</li>
          )}
          {carsWithBookings.map((c) => {
            const carBookings = monthBookings.filter((b) => b.carSlug === c.slug);
            return (
              <li
                key={c.slug}
                className="grid items-center gap-3 border-b border-[var(--color-hairline)] px-5 py-3.5 last:border-0 md:grid-cols-[200px_1fr]"
              >
                <CarCell car={c} />
                <div className="relative h-7 rounded-[6px] bg-[var(--color-canvas-soft)]">
                  {carBookings.map((b) => {
                    const s = maxDate([parseISO(b.pickupAt), monthStart]);
                    const e = minDate([parseISO(b.returnAt), monthEnd]);
                    const left = (differenceInCalendarDays(s, monthStart) / totalDays) * 100;
                    const width = ((differenceInCalendarDays(e, s) + 1) / totalDays) * 100;
                    return (
                      <span
                        key={b.id}
                        className="absolute bottom-1 top-1 rounded-[4px]"
                        style={{ left: `${left}%`, width: `${width}%`, background: statusColor[b.status] }}
                        title={`${b.id} · ${b.customerName}`}
                      />
                    );
                  })}
                </div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
