"use client";

import Link from "next/link";
import { useParams, useSearchParams, notFound } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle,
  ShieldCheck,
  CaretLeft,
  SteeringWheel,
  UserCircle,
  Info,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Gallery } from "@/components/booking/Gallery";
import { SpecGrid } from "@/components/booking/SpecGrid";
import { CarCard } from "@/components/booking/CarCard";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR, cn } from "@/lib/format";
import { getCarBySlug, cars } from "@/lib/mock/cars";

type Mode = "selfDrive" | "withDriver";

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

export default function CarDetailPage() {
  const params = useParams<{ slug: string }>();
  const search = useSearchParams();
  const t = useT();
  const car = getCarBySlug(params.slug);

  const [mode, setMode] = useState<Mode>(
    search.get("mode") === "withDriver" ? "withDriver" : "selfDrive"
  );
  const [from, setFrom] = useState(search.get("from") ?? addDays(1));
  const [to, setTo] = useState(search.get("to") ?? addDays(4));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const today = new Date().toISOString().slice(0, 10);

  if (!car) notFound();

  const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;

  const included = [t("car.inc1"), t("car.inc2"), t("car.inc3"), t("car.inc4")];
  const terms = [t("car.term1"), t("car.term2"), t("car.term3")];
  const driverTerms = [t("car.dt1"), t("car.dt2"), t("car.dt3"), t("car.dt4")];

  const similar = cars
    .filter((c) => c.category === car.category && c.slug !== car.slug)
    .slice(0, 3);

  const checkoutHref =
    `/checkout?slug=${car.slug}&mode=${mode}&from=${from}&to=${to}` +
    `&name=${encodeURIComponent(name)}&phone=${encodeURIComponent(phone)}`;

  const modes: { m: Mode; icon: typeof SteeringWheel; label: string }[] = [
    { m: "selfDrive", icon: SteeringWheel, label: t("hero.modeSelfDrive") },
    { m: "withDriver", icon: UserCircle, label: t("hero.modeWithDriver") },
  ];

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas-warm)] pb-20">
        <div className="container-folka pt-7">
          <Link href="/cari" className="link-arrow">
            <CaretLeft size={16} weight="bold" />
            {t("common.back")}
          </Link>
        </div>

        <div className="container-folka mt-5 grid grid-cols-1 gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="flex flex-col gap-9">
            <div>
              <span className="label-caps">
                {car.brand} · {car.color}
              </span>
              <h1 className="mt-1 display-md">{car.name}</h1>
            </div>

            <Gallery
              images={[car.exterior, car.side, car.interior]}
              alt={`${car.brand} ${car.name}`}
            />

            <section>
              <h2 className="text-[20px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                {t("car.specs")}
              </h2>
              <div className="mt-4">
                <SpecGrid car={car} />
              </div>
            </section>

            <section className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                  {t("car.included")}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {included.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--color-body)]">
                      <CheckCircle size={19} weight="fill" className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                  {t("car.terms")}
                </h2>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {terms.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--color-body)]">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-mute)]" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {mode === "withDriver" && (
              <section className="rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6">
                <h2 className="text-[18px] font-bold tracking-[-0.02em] text-[var(--color-ink)]">
                  {t("car.driverTerms")}
                </h2>
                <ul className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {driverTerms.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--color-body)]">
                      <Info size={18} weight="fill" className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside>
            <div className="sticky top-24 rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-canvas)] p-6 shadow-md">
              <div role="tablist" aria-label={t("car.pricePerDay")} className="grid grid-cols-2 gap-1 rounded-[12px] bg-[var(--color-canvas-soft)] p-1">
                {modes.map(({ m, icon: Icon, label }) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      role="tab"
                      type="button"
                      aria-selected={active}
                      onClick={() => setMode(m)}
                      className={cn(
                        "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[9px] px-3 py-2.5 text-[13px] font-semibold transition-colors",
                        active
                          ? "bg-[var(--color-canvas)] text-[var(--color-ink)] shadow-xs"
                          : "text-[var(--color-body-mid)] hover:text-[var(--color-ink)]"
                      )}
                    >
                      <Icon size={16} weight={active ? "fill" : "regular"} />
                      {label}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex items-end justify-between">
                <div>
                  <span className="label-caps">{t("car.pricePerDay")}</span>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="tnum text-[32px] font-bold leading-none tracking-[-0.03em] text-[var(--color-ink)]">
                      {formatIDR(rate)}
                    </span>
                    <span className="text-[14px] text-[var(--color-mute)]">{t("common.perDay")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3.5 border-t border-[var(--color-hairline)] pt-5">
                <span className="label-caps">{t("car.renterForm")}</span>
                <Field label={t("car.fullName")} htmlFor="r-name">
                  <Input
                    id="r-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Mis. Budi Santoso"
                    autoComplete="name"
                  />
                </Field>
                <Field label={t("car.phone")} htmlFor="r-phone">
                  <Input
                    id="r-phone"
                    type="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812 3456 7890"
                    autoComplete="tel"
                  />
                </Field>
                <div>
                  <span className="label-caps mb-2 block">{t("car.rentPlan")}</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="date"
                      aria-label={t("hero.labelPickup")}
                      value={from}
                      min={today}
                      onChange={(e) => {
                        setFrom(e.target.value);
                        if (e.target.value >= to) {
                          const n = new Date(e.target.value);
                          n.setDate(n.getDate() + 1);
                          setTo(n.toISOString().slice(0, 10));
                        }
                      }}
                    />
                    <Input
                      type="date"
                      aria-label={t("hero.labelReturn")}
                      value={to}
                      min={from}
                      onChange={(e) => setTo(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--color-hairline)] pt-4 text-[14px]">
                <span className="text-[var(--color-body-mid)]">{t("common.deposit")}</span>
                <span className="tnum font-semibold text-[var(--color-ink)]">{formatIDR(car.deposit)}</span>
              </div>

              <Link href={checkoutHref} className="mt-5 block">
                <Button variant="primary" size="lg" className="w-full">
                  {t("car.bookThis")}
                </Button>
              </Link>

              <ul className="mt-5 flex flex-col gap-2.5 border-t border-[var(--color-hairline)] pt-4">
                <li className="flex items-center gap-2 text-[13px] text-[var(--color-body-mid)]">
                  <ShieldCheck size={16} weight="fill" className="text-[var(--color-success)]" />
                  {t("hero.noHidden")}
                </li>
                <li className="flex items-center gap-2 text-[13px] text-[var(--color-body-mid)]">
                  <CheckCircle size={16} weight="fill" className="text-[var(--color-success)]" />
                  {t("hero.freeCancel")}
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {similar.length > 0 && (
          <section className="container-folka mt-20">
            <h2 className="display-sm">{t("car.similar")}</h2>
            <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((c) => (
                <CarCard key={c.slug} car={c} mode={mode} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
