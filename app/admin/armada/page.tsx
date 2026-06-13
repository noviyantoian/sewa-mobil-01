"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import { cars } from "@/lib/mock/cars";

export default function AdminFleetPage() {
  const t = useT();
  return (
    <>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-[32px] font-bold">{t("admin.fleet")}</h1>
        <Button variant="primary">{t("admin.addCar")}</Button>
      </div>
      <div className="border border-[var(--color-hairline)] overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead className="bg-[var(--color-surface-soft)] text-[var(--color-muted)]">
            <tr>
              <th className="text-left p-4 label-uppercase">Unit</th>
              <th className="text-left p-4 label-uppercase">Kategori</th>
              <th className="text-left p-4 label-uppercase">Tarif</th>
              <th className="text-left p-4 label-uppercase">Status</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((c) => (
              <tr key={c.slug} className="border-t border-[var(--color-hairline)]">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-12 bg-[var(--color-surface-card)] overflow-hidden flex-shrink-0">
                      <Image src={c.exterior} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-[var(--color-ink)]">{c.name}</div>
                      <div className="text-[12px] text-[var(--color-muted)]">{c.brand} - {c.color}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{c.category.toUpperCase()}</td>
                <td className="p-4">{formatIDR(c.rateSelfDrive)}</td>
                <td className="p-4">
                  {c.available ? (
                    <span className="text-[var(--color-success)] font-bold">Tersedia</span>
                  ) : (
                    <span className="text-[var(--color-muted)]">Tidak tersedia</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
