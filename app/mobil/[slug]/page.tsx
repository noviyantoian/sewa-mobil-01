"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { useT } from "@/lib/i18n/I18nProvider";
import { formatIDR } from "@/lib/format";
import { getCarBySlug } from "@/lib/mock/cars";

export default function CarDetailPage() {
  const params = useParams<{ slug: string }>();
  const t = useT();
  const car = getCarBySlug(params.slug);
  const [activeImg, setActiveImg] = useState<"exterior" | "side" | "interior">("exterior");
  const [mode, setMode] = useState<"selfDrive" | "withDriver">("selfDrive");

  if (!car) {
    return (
      <>
        <Header />
        <main className="container-folka py-32 text-center">
          <h1 className="text-[32px] font-bold mb-4">404</h1>
          <p className="text-[var(--color-muted)] mb-8">Mobil tidak ditemukan.</p>
          <Link href="/cari">
            <Button variant="primary">Cari mobil</Button>
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const rate = mode === "withDriver" ? car.rateWithDriver : car.rateSelfDrive;
  const images = { exterior: car.exterior, side: car.side, interior: car.interior };

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)]">
        <div className="container-folka pt-10 pb-2">
          <Link href="/cari" className="label-uppercase text-[var(--color-muted)] hover:text-[var(--color-ink)]">
            {"<"} {t("common.back")}
          </Link>
        </div>

        <div className="container-folka pt-6 pb-16 grid gap-10 md:grid-cols-12">
          <section className="md:col-span-7">
            <div className="relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden mb-4">
              <Image
                src={images[activeImg]}
                alt={`${car.name} - ${activeImg}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {(["exterior", "side", "interior"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setActiveImg(k)}
                  aria-pressed={activeImg === k}
                  className={
                    activeImg === k
                      ? "relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden border-2 border-[var(--color-primary)]"
                      : "relative aspect-[4/3] bg-[var(--color-surface-card)] overflow-hidden border border-[var(--color-hairline)] hover:border-[var(--color-ink)]"
                  }
                >
                  <Image src={images[k]} alt="" fill sizes="20vw" className="object-cover" />
                </button>
              ))}
            </div>
          </section>

          <aside className="md:col-span-5">
            <div className="text-[11px] font-bold uppercase tracking-[1.5px] text-[var(--color-muted)] mb-2">
              {car.brand} - {car.year}
            </div>
            <h1 className="text-[40px] md:text-[48px] font-bold leading-[1.05] mb-2">{car.name}</h1>
            <div className="text-[14px] text-[var(--color-body)] mb-8">{car.color}</div>

            <div className="flex gap-2 mb-6">
              {(["selfDrive", "withDriver"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={
                    mode === m
                      ? "flex-1 px-4 py-3 text-[12px] font-bold uppercase tracking-[1.5px] bg-[var(--color-ink)] text-[var(--color-on-dark)]"
                      : "flex-1 px-4 py-3 text-[12px] font-bold uppercase tracking-[1.5px] bg-[var(--color-canvas)] text-[var(--color-ink)] border border-[var(--color-hairline-strong)] hover:border-[var(--color-ink)]"
                  }
                >
                  {m === "selfDrive" ? t("search.modeSelfDrive") : t("search.modeWithDriver")}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 border border-[var(--color-hairline)]">
              <div className="p-5 border-r border-b border-[var(--color-hairline)]">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.rate")}</div>
                <div className="text-[24px] font-bold text-[var(--color-ink)]">{formatIDR(rate)}</div>
                <div className="text-[12px] text-[var(--color-muted)]">{t("search.perDay")}</div>
              </div>
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.deposit")}</div>
                <div className="text-[24px] font-bold text-[var(--color-ink)]">{formatIDR(car.deposit)}</div>
                <div className="text-[12px] text-[var(--color-muted)]">{t("carDetail.depositNote")}</div>
              </div>
              <div className="p-5 border-r border-b border-[var(--color-hairline)]">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.capacity")}</div>
                <div className="text-[20px] font-bold text-[var(--color-ink)]">{car.capacity} orang</div>
              </div>
              <div className="p-5 border-b border-[var(--color-hairline)]">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.transmission")}</div>
                <div className="text-[20px] font-bold text-[var(--color-ink)]">
                  {car.transmission === "auto" ? t("search.transmissionAuto") : t("search.transmissionManual")}
                </div>
              </div>
              <div className="p-5 border-r border-[var(--color-hairline)]">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.fuel")}</div>
                <div className="text-[20px] font-bold text-[var(--color-ink)]">{car.fuel}</div>
              </div>
              <div className="p-5">
                <div className="label-uppercase text-[var(--color-muted)] mb-1">{t("carDetail.year")}</div>
                <div className="text-[20px] font-bold text-[var(--color-ink)]">{car.year}</div>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="label-uppercase text-[var(--color-ink)] mb-3">{t("carDetail.terms")}</h2>
              <ul className="space-y-2 text-[14px] text-[var(--color-body)]">
                <li>- {t("carDetail.term1")}</li>
                <li>- {t("carDetail.term2")}</li>
                <li>- {t("carDetail.term3")}</li>
                <li>- {t("carDetail.term4")}</li>
              </ul>
            </div>

            <Link href={`/checkout?car=${car.slug}&mode=${mode}`} className="block mt-8">
              <Button variant="primary" size="lg" className="w-full">
                {t("carDetail.bookNow")}
              </Button>
            </Link>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
