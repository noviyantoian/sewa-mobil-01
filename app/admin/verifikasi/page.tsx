"use client";

import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { bookings } from "@/lib/mock/bookings";

export default function AdminVerificationPage() {
  const t = useT();
  const pending = bookings.filter((b) => b.status === "pending");

  return (
    <>
      <h1 className="text-[32px] font-bold mb-8">{t("admin.verification")}</h1>
      {pending.length === 0 ? (
        <p className="text-[var(--color-muted)]">{t("common.noData")}</p>
      ) : (
        <ul className="space-y-4">
          {pending.map((b) => (
            <li key={b.id} className="border border-[var(--color-hairline)] p-5 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{b.id}</div>
                <div className="font-bold">{b.customerName}</div>
                <div className="text-[13px] text-[var(--color-muted)]">{b.customerPhone}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary">{t("admin.approve")}</Button>
                <Button size="sm" variant="secondary">{t("admin.reject")}</Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
