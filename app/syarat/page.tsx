"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useT, useI18n } from "@/lib/i18n/I18nProvider";

type Clause = { id: string; title: string; body: string[] };

const CLAUSES: Record<"id" | "en", Clause[]> = {
  id: [
    {
      id: "kelayakan",
      title: "Kelayakan penyewa",
      body: [
        "Penyewa wajib berusia minimum 21 tahun dengan SIM A yang masih berlaku untuk sewa lepas kunci. Warga negara asing dapat menyewa menggunakan paspor aktif dan SIM internasional.",
        "FolkaDrive berhak menolak atau membatalkan permintaan sewa apabila data identitas tidak dapat diverifikasi atau dinilai berisiko, dengan pengembalian dana penuh.",
      ],
    },
    {
      id: "dokumen",
      title: "Dokumen & verifikasi",
      body: [
        "Untuk WNI diperlukan KTP dan SIM A; untuk WNA diperlukan paspor dan SIM internasional. Semua dokumen diunggah saat checkout dan ditinjau manual oleh tim sebelum serah-terima.",
        "Dokumen disimpan terenkripsi dan hanya digunakan untuk keperluan verifikasi dan kepatuhan, tidak dibagikan ke pihak ketiga tanpa dasar hukum.",
      ],
    },
    {
      id: "deposit",
      title: "Kebijakan deposit",
      body: [
        "Deposit ditahan sementara pada saat booking dan besarnya berbeda per kategori mobil. Nilai deposit selalu ditampilkan jelas sebelum Anda melakukan pembayaran.",
        "Deposit dikembalikan penuh setelah mobil kembali dalam kondisi sesuai checklist serah-terima, biasanya dalam 1–3 hari kerja. Potongan hanya berlaku untuk kerusakan, denda, atau keterlambatan yang terdokumentasi.",
      ],
    },
    {
      id: "batal",
      title: "Pembatalan & pengembalian dana",
      body: [
        "Pembatalan gratis hingga H-2 sebelum waktu pengambilan dengan pengembalian dana penuh. Pembatalan H-1 dikenakan potongan 50% dari biaya sewa.",
        "Pembatalan pada hari pengambilan atau ketidakhadiran (no-show) tidak mendapat pengembalian biaya sewa, namun deposit tetap dikembalikan penuh.",
      ],
    },
    {
      id: "sopir",
      title: "Ketentuan mode sopir",
      body: [
        "Tarif mode sopir mencakup jasa pengemudi hingga 12 jam kerja per hari. Lembur dihitung Rp50.000 per jam dan diinformasikan sebelum pembayaran.",
        "BBM, tol, dan parkir ditanggung penyewa. Untuk perjalanan luar kota, akomodasi dan uang makan sopir menjadi tanggungan penyewa sesuai kesepakatan.",
      ],
    },
    {
      id: "pembayaran",
      title: "Pembayaran",
      body: [
        "Pembayaran diterima melalui QRIS, e-wallet, kartu kredit/debit, dan virtual account bank, diproses lewat gateway tersertifikasi PCI-DSS.",
        "Total yang ditampilkan sebelum pembayaran bersifat final. Tersedia opsi bayar penuh atau DP 30% dengan pelunasan sesuai jadwal yang tertera.",
      ],
    },
    {
      id: "asuransi",
      title: "Asuransi & tanggung jawab",
      body: [
        "Seluruh mobil sudah termasuk asuransi dasar (TLO). Perlindungan all-risk tersedia sebagai add-on saat checkout untuk menekan risiko biaya kerusakan.",
        "Penyewa bertanggung jawab atas pelanggaran lalu lintas, denda, dan kerusakan akibat kelalaian selama masa sewa sesuai ketentuan polis yang berlaku.",
      ],
    },
    {
      id: "privasi",
      title: "Privasi data",
      body: [
        "Pengolahan data pribadi mengikuti UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi. Data hanya diproses untuk tujuan layanan dan kewajiban hukum.",
        "Anda berhak meminta akses, koreksi, atau penghapusan data Anda dengan menghubungi tim kami melalui kanal resmi FolkaDrive.",
      ],
    },
  ],
  en: [
    {
      id: "kelayakan",
      title: "Renter eligibility",
      body: [
        "Renters must be at least 21 years old with a valid class-A licence for self-drive rentals. Foreign nationals may rent using a valid passport and an international driving permit.",
        "FolkaDrive may decline or cancel a request when identity data cannot be verified or is deemed high-risk, with a full refund.",
      ],
    },
    {
      id: "dokumen",
      title: "Documents & verification",
      body: [
        "Locals must provide a national ID and class-A licence; foreign guests must provide a passport and international permit. All documents are uploaded at checkout and reviewed manually before handover.",
        "Documents are stored encrypted and used only for verification and compliance, never shared with third parties without legal basis.",
      ],
    },
    {
      id: "deposit",
      title: "Deposit policy",
      body: [
        "A deposit is held temporarily at booking and varies by car category. The deposit amount is always shown clearly before you pay.",
        "The deposit is returned in full once the car is returned in checklist condition, typically within 1–3 business days. Deductions apply only to documented damage, fines, or late returns.",
      ],
    },
    {
      id: "batal",
      title: "Cancellation & refunds",
      body: [
        "Free cancellation up to 2 days before pick-up with a full refund. Cancelling 1 day before incurs a 50% charge on the rental fee.",
        "Same-day cancellation or a no-show forfeits the rental fee, but the deposit is still returned in full.",
      ],
    },
    {
      id: "sopir",
      title: "With-driver terms",
      body: [
        "The with-driver rate covers driver service up to 12 working hours per day. Overtime is charged at Rp50,000 per hour and disclosed before payment.",
        "Fuel, tolls, and parking are borne by the renter. For out-of-town trips, driver lodging and meals are the renter's responsibility as agreed.",
      ],
    },
    {
      id: "pembayaran",
      title: "Payment",
      body: [
        "Payments are accepted via QRIS, e-wallets, credit/debit cards, and bank virtual accounts, processed through a PCI-DSS certified gateway.",
        "The total shown before payment is final. You may pay in full or 30% down, settling the balance on the stated schedule.",
      ],
    },
    {
      id: "asuransi",
      title: "Insurance & liability",
      body: [
        "All cars include basic insurance (TLO). All-risk protection is available as a checkout add-on to reduce exposure to damage costs.",
        "The renter is liable for traffic violations, fines, and damage caused by negligence during the rental, subject to the applicable policy terms.",
      ],
    },
    {
      id: "privasi",
      title: "Data privacy",
      body: [
        "Personal data is processed in line with Indonesia's Personal Data Protection Law (UU 27/2022). Data is processed only for service delivery and legal obligations.",
        "You may request access, correction, or deletion of your data by contacting our team through official FolkaDrive channels.",
      ],
    },
  ],
};

const UPDATED: Record<"id" | "en", string> = {
  id: "Terakhir diperbarui 1 Juni 2026",
  en: "Last updated 1 June 2026",
};

export default function SyaratPage() {
  const t = useT();
  const { locale } = useI18n();
  const clauses = CLAUSES[locale];

  return (
    <>
      <Header />
      <main className="bg-[var(--color-canvas)]">
        {/* Hero band */}
        <section className="bg-[var(--color-canvas-warm)]">
          <div className="container-folka pb-12 pt-16 md:pb-16 md:pt-20">
            <span className="eyebrow">{t("terms.title")}</span>
            <h1 className="display-lg mt-4 max-w-2xl">{t("terms.title")}</h1>
            <p className="body-lg mt-4 max-w-xl text-[var(--color-body-mid)]">{t("terms.subtitle")}</p>
            <p className="label-caps mt-6">{UPDATED[locale]}</p>
          </div>
        </section>

        <div className="container-folka grid gap-12 py-16 lg:grid-cols-[260px_1fr] lg:gap-16 lg:py-20">
          {/* Sticky section nav */}
          <nav aria-label={t("terms.title")} className="lg:sticky lg:top-28 lg:self-start">
            <ul className="space-y-1 border-l border-[var(--color-hairline)]">
              {clauses.map((c, i) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    className="tnum -ml-px flex items-center gap-3 border-l-2 border-transparent py-2 pl-4 text-[14px] text-[var(--color-body-mid)] transition-colors duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-ink)]"
                  >
                    <span className="text-[var(--color-mute)]">{String(i + 1).padStart(2, "0")}</span>
                    {c.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Clauses */}
          <div className="max-w-[65ch]">
            {clauses.map((c, i) => (
              <section
                key={c.id}
                id={c.id}
                className="scroll-mt-28 border-t border-[var(--color-hairline)] py-10 first:border-t-0 first:pt-0"
              >
                <div className="flex items-baseline gap-3">
                  <span className="tnum text-[14px] font-semibold text-[var(--color-accent)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display-xs !text-[24px]">{c.title}</h2>
                </div>
                <div className="mt-4 space-y-4">
                  {c.body.map((p, j) => (
                    <p key={j} className="text-[16px] leading-relaxed text-[var(--color-body)]">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
