import Link from "next/link";
import { ShieldCheck, Clock, Phone, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Logo } from "./Logo";

const columns = [
  {
    title: "Layanan",
    links: [
      { label: "Lepas kunci", href: "/cari?mode=selfDrive" },
      { label: "Dengan sopir", href: "/cari?mode=withDriver" },
      { label: "Mobil listrik", href: "/cari?cat=ev" },
      { label: "Sewa korporat", href: "/kontak" },
    ],
  },
  {
    title: "Perusahaan",
    links: [
      { label: "Cara kerja", href: "/cara-kerja" },
      { label: "Armada", href: "/cari" },
      { label: "Syarat & ketentuan", href: "/syarat" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Kebijakan deposit", href: "/syarat#deposit" },
      { label: "Pembatalan", href: "/syarat#batal" },
      { label: "WhatsApp 24/7", href: "/kontak" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--color-surface-dark)] text-[var(--color-on-dark-soft)]">
      <div className="container-folka py-16 md:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo dark />
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--color-on-dark-soft)]">
              Rental mobil tepercaya di Jakarta, Bandung & Bali. Harga transparan, armada terawat, tanpa drama.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 text-[14px]">
              <span className="inline-flex items-center gap-2">
                <Phone size={16} className="text-[var(--color-accent)]" /> +62 811 2000 800
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={16} className="text-[var(--color-accent)]" /> Sudirman, Jakarta Pusat
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[13px] font-bold uppercase tracking-[0.12em] text-white">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-[14px] text-[var(--color-on-dark-soft)] transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-4 border-t border-[var(--color-hairline-dark)] pt-8 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, label: "Pembayaran tersertifikasi PCI-DSS" },
            { icon: Clock, label: "Konfirmasi & bantuan 24 jam" },
            { icon: ShieldCheck, label: "Dokumen terenkripsi sesuai UU PDP" },
          ].map((item) => (
            <div key={item.label} className="inline-flex items-center gap-2.5 text-[13px] text-[var(--color-on-dark-soft)]">
              <item.icon size={18} className="shrink-0 text-[var(--color-accent)]" weight="fill" />
              {item.label}
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-start justify-between gap-4 text-[13px] text-[var(--color-mute)] sm:flex-row sm:items-center">
          <span>© 2026 FolkaDrive. Semua hak dilindungi.</span>
          <div className="flex flex-wrap items-center gap-2">
            {["QRIS", "GoPay", "OVO", "BCA VA", "Visa", "Mastercard"].map((m) => (
              <span
                key={m}
                className="rounded-[6px] border border-[var(--color-hairline-dark)] px-2.5 py-1 text-[11px] font-semibold text-[var(--color-on-dark-soft)]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
