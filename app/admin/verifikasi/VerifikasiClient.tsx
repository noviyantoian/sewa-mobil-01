"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  IdentificationCard,
  Phone,
  SealCheck,
  WhatsappLogo,
  CaretRight,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/Badge";
import { CarCell } from "@/components/admin/CarCell";
import { useT } from "@/lib/i18n/I18nProvider";
import { asset } from "@/lib/asset";
import { waLink } from "@/lib/format";
import type { AdminBooking } from "../types";

const DOC_IMAGE = asset("/images/trust-verifikasi.webp");

export function VerifikasiClient({ bookings }: { bookings: AdminBooking[] }) {
  const t = useT();
  // Read-only queue. Verification is decided manually on the booking detail
  // page (after reviewing docs) — never a one-tap approve/reject from here.
  const queue = bookings.filter((b) => b.status === "pending");

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

                <div className="flex flex-col gap-2">
                  {b.customerPhone && (
                    <a
                      href={waLink(b.customerPhone, `${t("admin.waVerifyMsg")} ${b.id}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center justify-center gap-2 bg-[#25d366] px-4 text-[14px] font-bold text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25d366] focus-visible:ring-offset-2"
                    >
                      <WhatsappLogo size={18} weight="fill" /> {t("admin.waVerify")}
                    </a>
                  )}
                  <Link
                    href={`/admin/booking/${b.bookingId}`}
                    className="inline-flex h-11 items-center justify-center gap-1.5 border border-[var(--color-hairline-strong)] px-4 text-[14px] font-bold text-[var(--color-ink)] transition-colors hover:bg-[var(--color-canvas-soft)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2"
                  >
                    {t("admin.verifyManual")} <CaretRight size={16} weight="bold" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
