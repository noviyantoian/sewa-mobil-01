"use client";

import { useT } from "@/lib/i18n/I18nProvider";
import { cars } from "@/lib/mock/cars";
import { bookings } from "@/lib/mock/bookings";

function dayMatrix(start: Date, days: number) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

export default function AdminCalendarPage() {
  const t = useT();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const days = dayMatrix(today, 14);

  return (
    <>
      <h1 className="text-[32px] font-bold mb-8">{t("admin.calendar")}</h1>
      <div className="overflow-x-auto border border-[var(--color-hairline)]">
        <table className="text-[12px] min-w-[800px] w-full">
          <thead>
            <tr className="bg-[var(--color-surface-soft)]">
              <th className="text-left p-3 label-uppercase text-[var(--color-muted)] sticky left-0 bg-[var(--color-surface-soft)]">Unit</th>
              {days.map((d) => (
                <th key={d.toISOString()} className="p-3 text-center font-bold">
                  {d.getDate()}
                  <div className="text-[10px] font-normal text-[var(--color-muted)]">
                    {d.toLocaleDateString("id-ID", { weekday: "short" })}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.slug} className="border-t border-[var(--color-hairline)]">
                <td className="p-3 font-bold sticky left-0 bg-[var(--color-canvas)] whitespace-nowrap">
                  {c.name}
                </td>
                {days.map((d) => {
                  const taken = bookings.some((b) => {
                    if (b.carSlug !== c.slug) return false;
                    const start = new Date(b.pickupAt);
                    const end = new Date(b.returnAt);
                    return d >= start && d <= end;
                  });
                  return (
                    <td
                      key={d.toISOString()}
                      className={
                        taken
                          ? "p-2 text-center bg-[var(--color-primary)] text-[var(--color-on-primary)]"
                          : "p-2 text-center bg-[var(--color-canvas)] text-[var(--color-hairline-strong)]"
                      }
                    >
                      {taken ? "*" : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
