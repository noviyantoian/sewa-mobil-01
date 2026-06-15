"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarBlank,
  MapPin,
  SteeringWheel,
  UserCircle,
  Receipt,
  ArrowClockwise,
  CarProfile,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useT, useI18n } from "@/lib/i18n/I18nProvider";
import { formatIDR, formatDateRange, cn } from "@/lib/format";
import { bookings, type Booking, type BookingStatus } from "@/lib/mock/bookings";
import { getCarBySlug } from "@/lib/mock/cars";
import { locations } from "@/lib/mock/locations";

type Tone = "neutral" | "accent" | "success" | "warning" | "error";

const STATUS_TONE: Record<BookingStatus, Tone> = {
  pending: "warning",
  confirmed: "accent",
  active: "success",
  completed: "neutral",
  cancelled: "error",
};

const UPCOMING: BookingStatus[] = ["pending", "confirmed", "active"];

function locLabel(id: string): string {
  const loc = locations.find((l) => l.id === id);
  return loc ? `${loc.city} · ${loc.area}` : id;
}

function BookingCard({ booking }: { booking: Booking }) {
  const t = useT();
  const { locale } = useI18n();
  const car = getCarBySlug(booking.carSlug);

  return (
    <article className="card group overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="grid sm:grid-cols-[200px_1fr]">
        {/* Car image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-canvas-soft)] sm:aspect-auto">
          {car ? (
            <Image
              src={car.exterior}
              alt={car.name}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[var(--color-mute)]">
              <CarProfile size={36} />
            </div>
          )}
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-4 p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="label-caps">{car?.brand}</p>
              <h3 className="display-xs mt-1 truncate !text-[20px] !leading-tight">
                {car?.name ?? booking.carSlug}
              </h3>
              <p className="tnum mt-1 text-[13px] text-[var(--color-mute)]">{booking.id}</p>
            </div>
            <Badge tone={STATUS_TONE[booking.status]}>{t(`status.${booking.status}`)}</Badge>
          </div>

          <dl className="grid grid-cols-1 gap-x-6 gap-y-2.5 text-[14px] sm:grid-cols-2">
            <div className="flex items-center gap-2 text-[var(--color-body)]">
              <CalendarBlank size={17} className="shrink-0 text-[var(--color-mute)]" />
              <span className="tnum">{formatDateRange(booking.pickupAt, booking.returnAt, locale)}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-body)]">
              <SteeringWheel size={17} className="shrink-0 text-[var(--color-mute)]" />
              <span>{booking.mode === "withDriver" ? t("modes.withDriverTitle") : t("modes.selfDriveTitle")}</span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-body)]">
              <MapPin size={17} className="shrink-0 text-[var(--color-mute)]" />
              <span className="truncate">
                <span className="text-[var(--color-mute)]">{t("account.pickup")}: </span>
                {locLabel(booking.pickupLocationId)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[var(--color-body)]">
              <MapPin size={17} className="shrink-0 text-[var(--color-mute)]" />
              <span className="truncate">
                <span className="text-[var(--color-mute)]">{t("account.return")}: </span>
                {locLabel(booking.returnLocationId)}
              </span>
            </div>
          </dl>

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 border-t border-[var(--color-hairline)] pt-4">
            <div>
              <p className="label-caps">{t("common.total")}</p>
              <p className="tnum mt-0.5 text-[19px] font-semibold text-[var(--color-ink)]">
                {formatIDR(booking.total)}
              </p>
            </div>
            <div className="flex gap-2.5">
              <Button variant="secondary" size="sm">
                <Receipt size={16} weight="bold" />
                {t("account.receipt")}
              </Button>
              <Link href={`/mobil/${booking.carSlug}`}>
                <Button size="sm">
                  <ArrowClockwise size={16} weight="bold" />
                  {t("account.rebook")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function Section({ title, items }: { title: string; items: Booking[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-12 first:mt-0">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="display-xs !text-[22px]">{title}</h2>
        <span className="tnum rounded-full bg-[var(--color-canvas-soft)] px-2.5 py-0.5 text-[13px] font-semibold text-[var(--color-body-mid)]">
          {items.length}
        </span>
      </div>
      <div className="grid gap-5">
        {items.map((b) => (
          <BookingCard key={b.id} booking={b} />
        ))}
      </div>
    </section>
  );
}

export default function AccountBookingPage() {
  const t = useT();
  const router = useRouter();

  const { upcoming, past } = useMemo(() => {
    const sorted = [...bookings].sort(
      (a, b) => new Date(b.pickupAt).getTime() - new Date(a.pickupAt).getTime()
    );
    return {
      upcoming: sorted.filter((b) => UPCOMING.includes(b.status)),
      past: sorted.filter((b) => !UPCOMING.includes(b.status)),
    };
  }, []);

  const isEmpty = bookings.length === 0;

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas-warm)]">
        <div className="container-folka section">
          <div className="flex items-center gap-3">
            <UserCircle size={28} weight="duotone" className="text-[var(--color-accent)]" />
            <span className="eyebrow">{t("nav.account")}</span>
          </div>
          <h1 className="display-lg mt-4">{t("account.title")}</h1>
          <p className="body-lg mt-3 max-w-xl text-[var(--color-body-mid)]">{t("account.subtitle")}</p>

          {isEmpty ? (
            <div className={cn("card mt-12 flex flex-col items-center px-6 py-16 text-center shadow-sm")}>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-accent-soft)]">
                <CarProfile size={32} className="text-[var(--color-accent)]" />
              </div>
              <h2 className="display-xs mt-6 !text-[22px]">{t("account.empty")}</h2>
              <p className="body-lg mt-2 max-w-sm text-[var(--color-body-mid)]">{t("account.emptyDesc")}</p>
              <Button size="lg" className="mt-7" onClick={() => router.push("/cari")}>
                {t("nav.search")}
              </Button>
            </div>
          ) : (
            <div className="mt-12">
              <Section title={t("account.upcoming")} items={upcoming} />
              <Section title={t("account.past")} items={past} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
