"use client";

import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { drivers } from "@/lib/mock/drivers";

const statusStyle: Record<string, string> = {
  idle: "bg-[var(--color-success)] text-white",
  assigned: "bg-[var(--color-primary)] text-white",
  off: "bg-[var(--color-hairline-strong)] text-[var(--color-ink)]",
};

export default function AdminDriversPage() {
  const t = useT();
  return (
    <>
      <h1 className="text-[32px] font-bold mb-8">{t("admin.drivers")}</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {drivers.map((d) => (
          <li key={d.id} className="border border-[var(--color-hairline)] p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{d.id}</div>
                <div className="text-[18px] font-bold">{d.name}</div>
                <div className="text-[13px] text-[var(--color-muted)]">{d.city} - {d.experienceYears} thn - rating {d.rating}</div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-[1.5px] ${statusStyle[d.status]}`}>{d.status}</span>
            </div>
            <Button size="sm" variant="secondary">{t("admin.assignDriver")}</Button>
          </li>
        ))}
      </ul>
    </>
  );
}
