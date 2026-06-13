# CLAUDE.md — FolkaDrive

> Pegangan untuk Claude Code di repo `sewa-mobil-01`. Baca file ini lebih dulu setiap sesi.
> Sumber kebenaran lain: [`docs/PRD.md`](docs/PRD.md) (produk) & [`DESIGN.md`](DESIGN.md) (visual).

---

## 1. Project Intent

FolkaDrive adalah website rental mobil B2C dengan dua mode: **lepas kunci (self-drive)** dan **dengan sopir**. Target: wisatawan, pelanggan ritel lokal, dan korporat (B2B di Fase 2). Bilingual ID/EN, harga IDR, mobile-first. MVP **fitur minimum, polish maksimum** — alur booking inti + dashboard ops dasar; desain & UX harus sudah lengkap dan profesional sejak hari pertama.

---

## 2. Stack

| Layer | Pilihan |
|---|---|
| Framework | **Next.js 16** (App Router, React 19, RSC default) |
| Bahasa | TypeScript strict |
| Styling | Tailwind v4 + CSS custom properties di `styles/tokens.css` |
| UI primitives | shadcn/ui — **`components.json` harus `radius: 0`** |
| Icon | `@phosphor-icons/react` (strokeWidth konsisten) |
| Animasi | `motion` (import dari `motion/react`) |
| i18n | `next-intl` (ID default, EN switch) |
| Form | `react-hook-form` + `zod` |
| Tanggal | `date-fns` |
| Package manager | pnpm |
| Output build | `output: 'standalone'` di `next.config.ts` (siap VPS) |
| Hosting (rencana) | **VPS self-hosted** + Caddy + PM2 — **belum di-deploy sprint ini** |
| Database (rencana) | PostgreSQL 16 native + Drizzle ORM — **belum dipasang sprint ini** |
| Auth (rencana) | better-auth OTP — **belum dipasang sprint ini** |
| Pembayaran (rencana) | Midtrans — **belum dipasang sprint ini** |
| Sumber data sprint ini | `lib/mock/*` (cars, bookings, users, drivers, locations) |

---

## 3. Konvensi File

```
sewa-mobil-01/
├── app/
│   ├── (marketing)/       # landing, cara-kerja, faq, syarat, kontak
│   ├── (booking)/         # cari, mobil/[slug], checkout, konfirmasi/[id]
│   ├── (account)/         # login, akun/booking
│   ├── (admin)/admin/     # dashboard, armada, kalender, booking, verifikasi, sopir
│   ├── api/               # search, hold, checkout, otp (stub)
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/                # shadcn (button, input, dialog, ...)
│   ├── layout/            # Header, Footer, LangSwitch
│   ├── marketing/         # Hero, CategoryGrid, HowItWorks, TrustSignals, FAQAccordion, CTABandPhoto
│   ├── booking/           # SearchBar, FilterPanel, CarCard, Gallery, SpecGrid, PriceSummary, Stepper, DocumentUpload, PaymentMethods
│   └── admin/             # StatCard, DataTable, CalendarView, AssignDriverDialog
├── lib/
│   ├── format.ts          # formatIDR, formatDateID
│   ├── pricing.ts         # hitung total, deposit, DP
│   ├── availability.ts    # overlap check in-memory (sprint ini)
│   ├── i18n/{request,routing}.ts
│   └── mock/{cars,bookings,users,drivers,locations}.ts
├── messages/{id,en}.json  # dictionary next-intl
├── styles/{tokens,globals}.css
├── public/images/         # generated via fal.ai (lihat §8)
├── docs/PRD.md            # produk (read-only)
├── DESIGN.md              # visual SoT (read-only)
└── CLAUDE.md
```

Aturan:
- File maks **800 baris**, target 200-400.
- Direktori `kebab-case`, komponen `PascalCase`, hook `useFoo`.
- Tidak boleh mutasi data — selalu return objek baru.
- Tidak hardcode string UI di JSX — semua via `next-intl` dictionary.

---

## 4. DESIGN.md = Single Source of Truth Visual

**Sebelum membuat komponen UI apa pun, baca `DESIGN.md`.** Jangan invent warna, typografi, atau radius di luar token DESIGN.md. Untuk mirror cepat ke kode, lihat `styles/tokens.css`.

### Hard rules (non-negotiable)

| Aturan | Nilai |
|---|---|
| Radius button/card/input | `0` (rectangular). Hanya icon button = circular. |
| Font family | Inter (substitute BMW Type Next Latin per DESIGN.md §362) |
| Bobot font | 700 (display+button+nav) & 300 (body). **Bobot 500 DILARANG.** |
| Display contrast | 700 vs 300 wajib. Italic untuk emphasize, jangan ganti family. |
| Letter spacing | 0 untuk display/body. Uppercase label = 1.5px tracking. |
| Drop shadow | **Tidak ada.** Depth dari color block + foto. |
| Primary accent | `#1c69d4` (BMW corporate blue). **Satu-satunya** accent. Jangan tambah warna lain. |
| Section rhythm | 80px (`--space-section`). Card padding 24px. |
| Hero band | Navy `#1a2129` text putih, atau canvas `#ffffff` text ink. |
| Text-link inline | UPPERCASE 13px/700/1.5px tracking + chevron (mis. `LIHAT SELENGKAPNYA ›`). |
| Image | `next/image` selalu. Jangan `<img>`. |

### Palet (mirror DESIGN.md, dari `tokens.css`)

```
--color-primary:        #1c69d4
--color-primary-active: #0653b6
--color-ink:            #262626
--color-body:           #3c3c3c
--color-muted:          #6b6b6b
--color-canvas:         #ffffff
--color-surface-card:   #fafafa
--color-surface-soft:   #f7f7f7
--color-surface-dark:   #1a2129
--color-surface-dark-elevated: #262e38
--color-hairline:       #e6e6e6
--color-hairline-strong:#cccccc
--color-on-primary:     #ffffff
--color-on-dark:        #ffffff
--color-on-dark-soft:   #bbbbbb
--color-success:        #22c55e
--color-warning:        #f59e0b
--color-error:          #dc2626
```

### Komposisi halaman

- Hindari sentralisasi semua. Rotasi: canvas → hero-band dark → canvas → feature → cta dark → footer soft-grey.
- Layout-family per section maksimal **muncul sekali** di satu halaman (anti-template).
- Bento harus punya rhythm — jangan tumpuk image+text-split zigzag >2x berturut.
- Eyebrow uppercase maks 1 per 3 section.

---

## 5. i18n & Format

- Default locale: `id`. Switch via `<LangSwitch>` di header.
- Semua copy via `useTranslations(...)` (client) atau `getTranslations(...)` (RSC).
- Tambah string baru: edit `messages/id.json` lalu `messages/en.json`. Tidak boleh string keras di JSX.
- Helper: `lib/format.ts` → `formatIDR(value)`, `formatDateID(date)`, `formatDateRange(start, end)`.

---

## 6. Aturan UI Tambahan

- **Mobile-first**: rancang 320-375 dulu, baru desktop.
- Setiap interaktif punya **default + hover + focus-visible + active + disabled**. Loading pakai skeleton matching shape, bukan spinner generik.
- Animasi compositor-friendly (`transform`, `opacity`, `clip-path`). Jangan animate `width/height/top/left`.
- A11y target alur inti **WCAG 2.1 AA**: kontras ≥ 4.5:1 body / 3:1 large, target sentuh ≥ 44px, label form di ATAS input, focus ring terlihat di setiap CTA.
- Tidak ada placeholder-as-label.
- Audit CTA: pastikan kontras teks lulus AA — terutama tombol biru di atas foto, tombol ghost di atas dark band.

---

## 7. Booking Domain Rules

- **No double-booking.** Cek ketersediaan sumber tunggal (DB lock + hold 15 menit saat checkout, timer visible).
- **Transparansi harga.** Tampilkan total + deposit + biaya add-on **sebelum** pembayaran. Tooltip deposit menjelaskan kebijakan refund.
- **Pembatalan berjenjang.** Mis. gratis batal H-2, potongan setelahnya — tunjukkan tabel di checkout & detail booking.
- **Verifikasi identitas.** Self-drive wajib SIM aktif; WNA pakai paspor. Status: pending → approved/rejected (manual admin di MVP).
- **Mode sopir.** Tunjukkan ketentuan jam kerja, lembur, akomodasi luar kota, BBM, tol, parkir di halaman detail & checkout.

---

## 8. Asset Rules — `public/images/*`

- **Semua image** datang dari `public/images/*` dan dimuat lewat `next/image`.
- Generate via **fal.ai MCP** — model utama `nano-banana-pro` (hero/galeri), `nano-banana-2` (thumbnail/kategori).
- **Wajib `mcp__fal-ai__estimate_cost` dulu** sebelum batch generate.
- Style direction selaras DESIGN.md: **corporate-automotive premium** — canvas terang atau hero band navy, foto mobil studio bersih, tanpa drop shadow, finish realistic. Hindari render glossy AI-purple / neon gradient.
- Dokumentasikan setiap asset di `public/images/CREDITS.md` (model, seed, prompt, aspect ratio) supaya reproducible.
- Hindari logo brand pihak ketiga tanpa lisensi. Untuk "trusted by", gunakan Simple Icons saat perlu.

---

## 9. Skill Triggers (kapan invoke skill apa)

| Situasi | Invoke |
|---|---|
| Bikin/redesign komponen UI | `frontend-design` + `ui-ux-pro-max` + baca DESIGN.md |
| Copy ID/EN landing, microcopy, CTA | `brand-voice` |
| Generate asset baru | `fal-ai-media` (estimate dulu) |
| Cari komponen shadcn | `vercel:shadcn` |
| Pola Next.js (RSC, route handler, image opt) | `vercel:nextjs` |
| Review keamanan (auth, upload, payment) | `security-reviewer` agent |
| TDD fitur baru | `tdd-guide` agent |

---

## 10. Skrip

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm start        # serve production
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm format       # prettier --write
```

---

## 11. Out of Scope (jangan dikerjakan tanpa konfirmasi)

**Sprint backend (berikutnya):**
- Postgres + Drizzle schema nyata (sprint ini pakai mock)
- better-auth OTP email/WA nyata + rate limit
- Upload KTP/SIM ke filesystem terenkripsi
- Integrasi Midtrans + webhook + refund
- Deploy ke VPS (Caddyfile, PM2 ecosystem, Dockerfile, runbook)

**PRD §5.2 (Fase 2+):**
- OCR identitas otomatis & e-contract digital
- Portal korporat (B2B) penuh, faktur pajak otomatis, termin
- Pickup/return beda lokasi (one-way), dynamic pricing
- Program loyalitas, telematika/GPS, app native iOS/Android
- Promo lanjutan & laporan kompleks

---

## 12. Definition of Done untuk Sprint UI

- [ ] `pnpm build` & `pnpm typecheck` hijau.
- [ ] Toggle ID↔EN → tidak ada string keras tertinggal.
- [ ] Mobile 375 + desktop 1440 ter-screenshot, tanpa overflow / CLS.
- [ ] Lighthouse landing: Perf ≥ 90, A11y ≥ 95, CLS < 0.1.
- [ ] Booking wizard klik-through end-to-end dengan data mock.
- [ ] Token DESIGN.md dipakai konsisten (audit warna/radius).
- [ ] Commit conventional & atomik.
