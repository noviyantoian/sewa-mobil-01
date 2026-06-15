"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  CheckCircle,
  WhatsappLogo,
  ArrowRight,
  House,
  CalendarBlank,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange } from "@/lib/format";
import { cars } from "@/lib/mock/cars";

function nextDay(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function ConfirmationPage() {
  const params = useParams<{ id: string }>();
  const t = useT();

  const car = cars[1];
  const from = nextDay(1);
  const to = nextDay(4);
  const steps = [t("confirm.ns1"), t("confirm.ns2"), t("confirm.ns3")];

  return (
    <>
      <Header />
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
              {params.id}
            </span>
            <Badge tone="warning" className="mt-1">
              {t("status.pending")}
            </Badge>
          </div>
        </div>

        <div className="container-folka mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-6">
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
                {formatIDR(car.rateSelfDrive * 3)}
              </span>
            </div>
          </section>

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

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/akun/booking" className="flex-1">
              <Button variant="primary" size="lg" className="w-full">
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

          <a
            href="https://wa.me/628112000800"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-[14px] font-semibold text-[var(--color-body-mid)] transition-colors hover:text-[var(--color-accent)]"
          >
            <WhatsappLogo size={18} weight="fill" className="text-[var(--color-success)]" />
            {t("confirm.needHelp")}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
