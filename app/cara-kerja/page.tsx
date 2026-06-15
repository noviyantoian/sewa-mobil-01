"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MagnifyingGlass,
  ShieldCheck,
  Key,
  IdentificationCard,
  CreditCard,
  FileText,
  CheckCircle,
  ArrowRight,
} from "@phosphor-icons/react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useT, useI18n } from "@/lib/i18n/I18nProvider";

type StepDetail = {
  intro: string;
  points: string[];
};

const STEP_COPY: Record<"id" | "en", StepDetail[]> = {
  id: [
    {
      intro:
        "Masukkan kota, tanggal ambil dan kembali, lalu pilih mode lepas kunci atau dengan sopir. Kami hanya menampilkan unit yang benar-benar kosong di tanggal itu — jadi yang Anda lihat memang bisa Anda sewa.",
      points: [
        "Ketersediaan real-time, tanpa daftar tunggu",
        "Filter kategori, transmisi, dan kapasitas",
        "Harga per hari sudah termasuk asuransi dasar",
      ],
    },
    {
      intro:
        "Unggah KTP & SIM (atau paspor untuk WNA), lalu bayar lewat QRIS, e-wallet, atau kartu. Total terkunci sejak Anda klik bayar — tidak ada biaya yang muncul belakangan.",
      points: [
        "Dokumen dienkripsi dan ditinjau manual oleh tim",
        "Deposit ditahan sementara, dikembalikan penuh",
        "Pilihan bayar penuh atau DP 30%",
      ],
    },
    {
      intro:
        "Datang ke titik serah-terima sesuai jadwal, tunjukkan kode booking, dan lakukan checklist foto bersama tim. Setelah kunci di tangan, mobil sepenuhnya milik perjalanan Anda.",
      points: [
        "Checklist foto kondisi sebelum berangkat",
        "Bantuan darurat 24 jam selama sewa",
        "Pengembalian cepat, deposit langsung diproses",
      ],
    },
  ],
  en: [
    {
      intro:
        "Enter your city, pick-up and return dates, then choose self-drive or with-driver. We only show units that are genuinely free for those dates — what you see is what you can actually book.",
      points: [
        "Real-time availability, no waiting list",
        "Filter by category, transmission, and capacity",
        "Daily price already includes basic insurance",
      ],
    },
    {
      intro:
        "Upload your ID & licence (or passport for foreign guests), then pay via QRIS, e-wallet, or card. Your total is locked the moment you pay — no fees appear later.",
      points: [
        "Documents encrypted and reviewed by our team",
        "Deposit held temporarily, returned in full",
        "Pay in full or 30% down payment",
      ],
    },
    {
      intro:
        "Arrive at the handover point on schedule, show your booking code, and run a photo checklist with our team. Once the key is yours, the car belongs to your journey.",
      points: [
        "Photo condition checklist before you leave",
        "24-hour roadside support during the rental",
        "Fast return, deposit processed right away",
      ],
    },
  ],
};

const CHECKLIST: Record<"id" | "en", { title: string; items: string[] }> = {
  id: {
    title: "Yang perlu Anda siapkan",
    items: [
      "KTP aktif (WNI) atau paspor + SIM internasional (WNA)",
      "SIM A yang masih berlaku untuk mode lepas kunci",
      "Usia minimum 21 tahun",
      "Metode pembayaran: QRIS, e-wallet, atau kartu",
    ],
  },
  en: {
    title: "What you need to prepare",
    items: [
      "Valid national ID (locals) or passport + international licence (foreigners)",
      "A valid class-A driving licence for self-drive",
      "Minimum age of 21 years",
      "A payment method: QRIS, e-wallet, or card",
    ],
  },
};

const STEP_ICONS = [MagnifyingGlass, ShieldCheck, Key];
const STEP_IMAGES = ["/images/how-1-search.webp", "/images/how-2-pickup.webp"];
const CHECK_ICONS = [IdentificationCard, FileText, CheckCircle, CreditCard];

export default function CaraKerjaPage() {
  const t = useT();
  const { locale } = useI18n();
  const steps = STEP_COPY[locale];
  const checklist = CHECKLIST[locale];

  const stepTitles = [t("how.step1Title"), t("how.step2Title"), t("how.step3Title")];

  return (
    <>
      <Header />
      <main>
        {/* Hero band */}
        <section className="relative overflow-hidden bg-[var(--color-surface-dark)]">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-32 top-0 h-[480px] w-[480px] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, var(--color-accent) 0%, transparent 70%)" }}
          />
          <div className="container-folka relative section">
            <span className="eyebrow">{t("how.eyebrow")}</span>
            <h1 className="display-xl mt-5 max-w-3xl !text-white">{t("howPage.title")}</h1>
            <p className="body-xl mt-6 max-w-2xl text-[var(--color-on-dark-soft)]">{t("howPage.subtitle")}</p>
          </div>
        </section>

        {/* Steps walk-through */}
        <section className="bg-[var(--color-canvas)]">
          <div className="container-folka section">
            <div className="flex flex-col gap-20 md:gap-28">
              {steps.map((step, i) => {
                const Icon = STEP_ICONS[i];
                const img = STEP_IMAGES[i];
                const flip = i % 2 === 1;
                return (
                  <Reveal
                    key={i}
                    className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                      flip ? "lg:[&>*:first-child]:order-2" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="tnum flex h-12 w-12 items-center justify-center rounded-[12px] bg-[var(--color-accent-soft)] text-[20px] font-semibold text-[var(--color-accent-ink)]">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <Icon size={28} weight="duotone" className="text-[var(--color-accent)]" />
                      </div>
                      <h2 className="display-md mt-6">{stepTitles[i]}</h2>
                      <p className="body-lg mt-4 text-[var(--color-body-mid)]">{step.intro}</p>
                      <ul className="mt-6 space-y-3">
                        {step.points.map((p) => (
                          <li key={p} className="flex items-start gap-3 text-[16px] text-[var(--color-body)]">
                            <CheckCircle size={20} weight="fill" className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {img ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] shadow-md">
                        <Image
                          src={img}
                          alt={stepTitles[i]}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[16px] bg-[var(--color-surface-dark)]">
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 opacity-40"
                          style={{
                            background:
                              "radial-gradient(circle at 70% 30%, var(--color-accent) 0%, transparent 60%)",
                          }}
                        />
                        <Key size={88} weight="duotone" className="relative text-white/90" />
                      </div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Checklist */}
        <section className="bg-[var(--color-canvas-warm)]">
          <div className="container-folka section grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <div>
              <span className="eyebrow">{t("car.terms")}</span>
              <h2 className="display-md mt-4">{checklist.title}</h2>
            </div>
            <ul className="grid gap-px overflow-hidden rounded-[16px] border border-[var(--color-hairline)] bg-[var(--color-hairline)] sm:grid-cols-2">
              {checklist.items.map((item, i) => {
                const Icon = CHECK_ICONS[i];
                return (
                  <li key={item} className="flex items-start gap-3 bg-[var(--color-canvas)] p-6">
                    <Icon size={24} weight="duotone" className="mt-0.5 shrink-0 text-[var(--color-accent)]" />
                    <span className="text-[15px] text-[var(--color-body)]">{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="bg-[var(--color-canvas)]">
          <div className="container-folka pb-24">
            <div className="card flex flex-col items-start gap-6 overflow-hidden bg-[var(--color-accent-soft)] p-8 md:flex-row md:items-center md:justify-between md:p-12">
              <div>
                <h2 className="display-sm !text-[var(--color-accent-ink)]">{t("ctaBand.title")}</h2>
                <p className="body-lg mt-2 text-[var(--color-accent-ink)]/80">{t("ctaBand.subtitle")}</p>
              </div>
              <Link href="/cari" className="shrink-0">
                <Button size="xl">
                  {t("how.cta")}
                  <ArrowRight size={18} weight="bold" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
