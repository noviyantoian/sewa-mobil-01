"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ShieldCheck, IdentificationCard, Phone, SealCheck } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CarCell } from "@/components/admin/CarCell";
import { useT } from "@/lib/i18n/I18nProvider";
import type { AdminBooking } from "../types";

const DOC_IMAGE = "/images/trust-verifikasi.webp";

export function VerifikasiClient({ bookings }: { bookings: AdminBooking[] }) {
  const t = useT();
  const [queue, setQueue] = useState<AdminBooking[]>(() =>
    bookings.filter((b) => b.status === "pending")
  );

  const resolve = (b: AdminBooking, approved: boolean) => {
    setQueue((q) => q.filter((x) => x.id !== b.id));
    toast(approved ? t("admin.approve") : t("admin.reject"), {
      description: `${b.id} · ${b.customerName}`,
    });
  };

  return (
    <div className="flex flex-col gap-7">
      <header className="flex flex-col gap-1">
        <span className="eyebrow">
          <ShieldCheck size={15} weight="fill" /> {t("admin.navVerification")}
        </span>
        <h1 className="display-sm">{t("admin.verifTitle")}</h1>
      </header>

      {queue.length === 0 ? (
        <div className="card shadow-sm flex flex-col items-center gap-3 px-6 py-16 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-success-soft)] text-[var(--color-success)]">
            <SealCheck size={24} weight="fill" />
          </span>
          <p className="text-[15px] font-semibold text-[var(--color-ink)]">{t("status.completed")}</p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {queue.map((b) => (
            <article key={b.id} className="card shadow-sm overflow-hidden">
              <div className="relative aspect-[16/9] bg-[var(--color-canvas-soft)]">
                <Image
                  src={DOC_IMAGE}
                  alt={`${t("admin.navVerification")} — ${b.customerName}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3">
                  <Badge tone="dark">
                    <IdentificationCard size={13} weight="fill" /> SIM / KTP
                  </Badge>
                </span>
                <span className="absolute right-3 top-3">
                  <Badge tone="warning">{t("status.pending")}</Badge>
                </span>
              </div>

              <div className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[17px] font-bold tracking-[-0.01em] text-[var(--color-ink)]">
                      {b.customerName}
                    </div>
                    <div className="tnum mt-0.5 inline-flex items-center gap-1.5 text-[13px] text-[var(--color-mute)]">
                      <Phone size={13} /> {b.customerPhone}
                    </div>
                  </div>
                  <span className="tnum text-[12px] font-semibold text-[var(--color-mute)]">{b.id}</span>
                </div>

                <div className="rounded-[10px] bg-[var(--color-canvas-soft)] p-3">
                  <CarCell car={b.car ?? undefined} />
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="flex-1" onClick={() => resolve(b, true)}>
                    <SealCheck size={16} weight="bold" /> {t("admin.approve")}
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1" onClick={() => resolve(b, false)}>
                    {t("admin.reject")}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
