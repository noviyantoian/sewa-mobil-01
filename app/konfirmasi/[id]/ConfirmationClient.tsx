"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle,
  WhatsappLogo,
  ArrowRight,
  House,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import { SITE } from "@/lib/seo";
import type { BookingStatus } from "@/lib/db/schema";

export interface ConfirmationData {
  code: string;
  status: BookingStatus;
  from: string;
  to: string;
  total: number;
  mode: "selfDrive" | "withDriver";
  customerName: string;
  car: { brand: string; name: string; exterior: string } | null;
}

export function ConfirmationClient({
  code,
  status,
  from,
  to,
  total,
  mode,
  customerName,
  car,
}: ConfirmationData) {
  const t = useT();
  const steps = [t("confirm.ns1"), t("confirm.ns2"), t("confirm.ns3")];

  // Pre-filled WhatsApp order message — customer taps to send the booking
  // summary to the owner, who arranges payment (no online gateway, opsi A).
  const waMessage = t("confirm.waMessage", {
    site: SITE.name,
    code,
    car: car ? `${car.brand} ${car.name}` : "-",
    range: formatDateRange(from, to),
    mode: mode === "withDriver" ? t("hero.modeWithDriver") : t("hero.modeSelfDrive"),
    total: formatIDR(total),
    name: customerName,
  });
  const waHref = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <main className="bg-[var(--color-canvas-warm)] pb-20">
      <div className="container-folka mx-auto max-w-2xl pt-14 text-center">
        <span className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-success-soft)]">
          <CheckCircle size={44} weight="fill" className="text-[var(--color-success)]" />
        </span>
        <h1 className="mt-6 display-md">{t("confirm.title")}</h1>
        <p className="mt-3 body-lg text-[var(--color-body-mid)]">{t("confirm.subtitle")}</p>

        <div className="mt-8 flex flex-col items-center gap-2 rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] px-6 py-6 shadow-sm">
          <span className="label-caps">{t("confirm.bookingId")}</span>
          <span className="tnum text-[34px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
            {code}
          </span>
          <div className="mt-1">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>

      <div className="container-folka mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6">
        {car && (
          <section className="rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[12px] bg-[var(--color-canvas-soft)]">
                <Image src={car.exterior} alt={car.name} fill sizes="112px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <span className="label-caps">{car.brand}</span>
                <p className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                  {car.name}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[13px] text-[var(--color-body-mid)]">
                  <CalendarBlank size={15} className="text-[var(--color-mute)]" />
                  {formatDateRange(from, to)}
                </p>
              </div>
              <span className="tnum ml-auto hidden shrink-0 text-[18px] font-bold text-[var(--color-ink)] sm:block">
                {formatIDR(total)}
              </span>
            </div>
          </section>
        )}

        <section className="rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
          <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
            {t("confirm.nextSteps")}
          </h2>
          <ol className="mt-5 flex flex-col gap-5">
            {steps.map((s, i) => (
              <li key={s} className="flex items-start gap-3.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-soft)] text-[13px] font-bold text-[var(--color-accent-ink)]">
                  {i + 1}
                </span>
                <span className="text-[15px] leading-relaxed text-[var(--color-body)]">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-full items-center justify-center gap-2.5 rounded-[12px] bg-[var(--color-success)] px-6 py-4 text-[16px] font-bold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-success)]"
        >
          <WhatsappLogo size={22} weight="fill" />
          {t("confirm.waCta")}
          <ArrowRight size={18} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
        </a>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/akun/booking" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              {t("confirm.viewBookings")}
              <ArrowRight size={18} weight="bold" />
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="secondary" size="lg" className="w-full">
              <House size={18} weight="bold" />
              {t("confirm.backHome")}
            </Button>
          </Link>
        </div>

        <p className="text-center text-[13px] text-[var(--color-mute)]">{t("confirm.waNote")}</p>
      </div>
    </main>
  );
}
