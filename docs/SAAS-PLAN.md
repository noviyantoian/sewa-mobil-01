# SAAS-PLAN — FolkaDrive Multi-Tenant

> **Status:** Draft v1 · 2026-06-15 · **Rencana awal (belum dikoding)**
> Rencana mengubah mockup single-site jadi **white-label multi-tenant SaaS**.
> Harga & paket: [`docs/PRICING.md`](PRICING.md) · Produk: [`docs/PRD.md`](PRD.md) · Visual: [`DESIGN.md`](../DESIGN.md)
> Diagram pakai **Mermaid** (render otomatis di GitHub/VS Code).

---

## 1. Tujuan

Satu codebase melayani **banyak bisnis rental (tenant)**, tiap tenant punya:
- Website branded sendiri (subdomain / domain sendiri / domain dikelola kita).
- Fitur dibatasi sesuai **paket** (Starter → Enterprise).
- Data terisolasi penuh antar-tenant.

---

## 2. Kondisi sekarang vs target

| Aspek | Sekarang (mockup) | Target (SaaS) |
|---|---|---|
| Data | `lib/mock/*` (in-memory) | Postgres + Drizzle, ber-`tenant_id` |
| Auth | stub OTP (UI) | better-auth, scoped per tenant + RBAC |
| Tenant | tidak ada | resolusi via host (subdomain/custom domain) |
| Fitur | semua nyala | feature-flag per paket |
| Tema | token global | override per tenant (logo, warna) |
| Hosting | belum deploy | VPS + Caddy on-demand TLS + PM2 |
| Pembayaran | mock | Midtrans (Enterprise, on-request) |

**Aset yang mempermudah:** `styles/tokens.css` (semua warna = CSS var → white-label gampang), `middleware.ts` (titik resolusi tenant sudah ada), i18n terpusat, data lewat `lib/mock/*` (belum di-hardcode di JSX).

---

## 3. Model tenancy

- **Tenant = 1 bisnis rental.**
- **Isolasi data:** Shared DB + kolom `tenant_id` di semua tabel domain + **Postgres Row Level Security (RLS)**. Murah, scale ribuan tenant, isolasi dijamin DB (bukan cuma app).
- **Resolusi tenant:** dari `Host` request → `middleware.ts` → set header `x-tenant` → RSC baca via `headers()`.
- **Super-admin (platform/kamu)** terpisah dari **admin tenant**.

```mermaid
flowchart TD
  A[Request masuk - baca Host] --> B{Tipe host?}
  B -->|nama.folkadrive.com| C[Lookup tenant by subdomain]
  B -->|domain custom| D[Lookup tenant by domain]
  C --> E{Tenant ada & aktif?}
  D --> E
  E -->|Tidak| F[Landing platform / 404]
  E -->|Ya| G[Set x-tenant + load plan + theme]
  G --> H{Route butuh feature tertentu?}
  H -->|Ya & tidak ada di paket| I[Redirect /upgrade]
  H -->|Tidak / ada| J[Render halaman dengan konteks tenant]
```

---

## 4. Penanganan domain (3 mode)

```mermaid
flowchart LR
  subgraph A[Mode A - Subdomain]
    A1[nama.folkadrive.com] --> A2[Wildcard DNS *.folkadrive.com]
  end
  subgraph B[Mode B - BYOD]
    B1[Tenant set CNAME/A ke server] --> B2[Caddy on-demand TLS terbitkan cert]
  end
  subgraph C[Mode C - Managed]
    C1[Kita beli via registrar API] --> C2[Point ke server + auto-SSL]
  end
  A2 --> R[(Tabel domains -> tenant_id)]
  B2 --> R
  C2 --> R
  R --> M[middleware resolve host]
```

- **SSL otomatis:** Caddy **on-demand TLS** (cocok rencana VPS) — wildcard subdomain + custom domain dapat HTTPS tanpa konfig manual per tenant.
- **Ownership:** managed domain atas nama tenant; churn → domain tetap milik tenant.

---

## 5. Feature flags (inti gating)

`Plan` → himpunan `Feature`. `Tenant` punya `plan`. Cek `hasFeature(tenant, x)`.

**Enforcement 3 lapis (jangan cuma UI):**
1. **Middleware (hard gate)** — route ke-gate (mis. `/akun`, `/checkout`) ditolak/redirect kalau paket tak punya fiturnya. = keamanan.
2. **Navigasi (hide)** — filter `Header.navItems` & tombol by feature. = UX.
3. **Komponen/API (`<Gate feature>`)** — bungkus bagian fitur; route handler tolak server-side.

```mermaid
flowchart TD
  U[User akses fitur X] --> M{Middleware: route X butuh flag?}
  M -->|Ya| P{hasFeature tenant, X ?}
  P -->|Tidak| UP[Redirect /upgrade]
  P -->|Ya| N[Nav & komponen tampilkan X]
  M -->|Tidak| N
  N --> S{Server action / API X}
  S --> P2{hasFeature server-side?}
  P2 -->|Tidak| ERR[403]
  P2 -->|Ya| OK[Proses]
```

Daftar flag & pemetaan paket: lihat [`docs/PRICING.md`](PRICING.md) §6.

---

## 6. Struktur database (Postgres + Drizzle)

Semua tabel domain punya `tenant_id` (FK → `tenants.id`) + RLS policy `tenant_id = current_setting('app.tenant_id')`.

### 6.1 ER Diagram

```mermaid
erDiagram
  PLAN ||--o{ SUBSCRIPTION : defines
  TENANT ||--|| SUBSCRIPTION : has
  TENANT ||--o{ DOMAIN : maps
  TENANT ||--o{ USER : has
  TENANT ||--o{ CAR : owns
  TENANT ||--o{ LOCATION : has
  TENANT ||--o{ DRIVER : employs
  TENANT ||--o{ BOOKING : receives
  CAR ||--o{ CAR_IMAGE : has
  CAR ||--o{ BOOKING : "booked as"
  LOCATION ||--o{ BOOKING : "pickup/deliver"
  DRIVER ||--o{ BOOKING : "assigned to"
  USER ||--o{ BOOKING : makes
  BOOKING ||--o{ DOCUMENT : has
  BOOKING ||--o| PAYMENT : has
  USER ||--o{ MEMBERSHIP : "role in tenant"

  TENANT {
    uuid id PK
    string slug
    string name
    string plan_id FK
    jsonb theme
    string status
    timestamptz created_at
  }
  PLAN {
    string id PK
    string name
    int price_month
    jsonb features
    int max_cars
  }
  SUBSCRIPTION {
    uuid id PK
    uuid tenant_id FK
    string plan_id FK
    string cycle
    string status
    timestamptz current_period_end
  }
  DOMAIN {
    uuid id PK
    uuid tenant_id FK
    string host
    string type
    bool primary
    string ssl_status
  }
  USER {
    uuid id PK
    uuid tenant_id FK
    string phone
    string email
    string name
  }
  MEMBERSHIP {
    uuid id PK
    uuid user_id FK
    uuid tenant_id FK
    string role
  }
  CAR {
    uuid id PK
    uuid tenant_id FK
    string slug
    string name
    string brand
    string category
    int capacity
    string transmission
    string fuel
    int rate_self_drive
    int rate_with_driver
    int deposit
    bool available
  }
  CAR_IMAGE {
    uuid id PK
    uuid car_id FK
    string url
    string kind
  }
  LOCATION {
    uuid id PK
    uuid tenant_id FK
    string city
    string area
    string type
  }
  DRIVER {
    uuid id PK
    uuid tenant_id FK
    string name
    int experience_years
    numeric rating
    string status
  }
  BOOKING {
    uuid id PK
    uuid tenant_id FK
    uuid car_id FK
    uuid user_id FK
    uuid driver_id FK
    string mode
    string pickup_type
    date from_date
    date to_date
    int total
    int deposit
    string status
    string channel
    timestamptz created_at
  }
  DOCUMENT {
    uuid id PK
    uuid booking_id FK
    string type
    string url
    string verify_status
  }
  PAYMENT {
    uuid id PK
    uuid booking_id FK
    string gateway
    int amount
    string status
    string ref
  }
```

### 6.2 Catatan tabel
- `tenants.theme` (jsonb): `{ accent, ink, logoUrl, ... }` → inject CSS var di layout.
- `plans.features` (jsonb array): daftar flag aktif (selaras `lib/tenant/features.ts`).
- `bookings.channel`: `web_wa` | `online` (online hanya Enterprise).
- `bookings.status`: `pending` → `confirmed` → `active` → `completed` / `cancelled`.
- `documents.verify_status`: `pending` → `approved` / `rejected` (verifikasi manual admin).
- `payments`: hanya terisi untuk channel `online` (Enterprise).
- **RLS wajib** di semua tabel ber-`tenant_id`. `tenant_id` selalu di-derive server-side dari host — **tidak pernah** dari input user.

---

## 7. UML — domain & service (class diagram)

```mermaid
classDiagram
  class Tenant {
    +id
    +slug
    +plan: Plan
    +theme
    +hasFeature(f) bool
  }
  class Plan {
    +id
    +priceMonth
    +features: Feature[]
    +maxCars
  }
  class TenantContext {
    +resolveFromHost(host) Tenant
    +current() Tenant
  }
  class FeatureGate {
    +assert(tenant, feature)
    +navItemsFor(tenant) NavItem[]
  }
  class BookingService {
    +create(dto) Booking
    +notifyWhatsApp(booking)
    +assignDriver(booking, driver)
  }
  class PaymentService {
    +charge(booking) Payment
    +webhook(event)
  }
  class DomainService {
    +connect(tenant, host, type)
    +issueCert(host)
  }
  class Repository~T~ {
    +findAll(filter) T[]
    +findById(id) T
    +create(dto) T
    +update(id, dto) T
  }
  Tenant --> Plan
  TenantContext --> Tenant
  FeatureGate --> Tenant
  BookingService --> Repository
  BookingService ..> PaymentService : online only
  DomainService --> Tenant
```

---

## 8. Flow utama (sequence)

### 8.1 Booking via WhatsApp (Starter–Business)
```mermaid
sequenceDiagram
  actor C as Pelanggan
  participant W as Web tenant
  participant API as BookingService
  participant WA as WhatsApp
  participant O as Owner/Admin
  C->>W: Pilih mobil + isi form (nama, HP, tanggal)
  W->>API: create booking (channel web_wa, status pending)
  API->>WA: kirim ringkasan order ke WA owner
  API-->>C: "Order terkirim, owner akan konfirmasi"
  O->>WA: konfirmasi + atur bayar manual/transfer
  O->>API: update status confirmed
```

### 8.2 Booking + bayar online (Enterprise)
```mermaid
sequenceDiagram
  actor C as Pelanggan
  participant W as Checkout
  participant API as BookingService
  participant PAY as PaymentService
  participant WA as WhatsApp
  C->>W: Checkout (hold 15 mnt) + upload KTP/SIM
  W->>API: create booking (channel online)
  API->>PAY: charge
  PAY-->>C: halaman bayar (QRIS/VA/e-wallet)
  PAY->>API: webhook paid
  API->>WA: notif konfirmasi ke pelanggan + owner
  API-->>C: Booking terkonfirmasi
```

### 8.3 Onboarding tenant baru (signup)
```mermaid
flowchart TD
  S[Daftar: nama bisnis + pilih paket] --> T[Buat tenant + slug + subdomain]
  T --> D{Mau domain sendiri?}
  D -->|Tidak| SUB[Pakai nama.folkadrive.com]
  D -->|BYOD| BYOD[Petunjuk set DNS -> verifikasi -> SSL]
  D -->|Managed| MAN[Beli domain + setup -> SSL]
  SUB --> THEME[Set brand: logo + warna]
  BYOD --> THEME
  MAN --> THEME
  THEME --> SEED[Seed katalog awal / import data]
  SEED --> PAY{Paket berbayar?}
  PAY -->|Ya| BILL[Aktifkan langganan]
  PAY -->|Trial| TRIAL[Trial N hari]
  BILL --> LIVE[Situs live]
  TRIAL --> LIVE
```

---

## 9. Roadmap berfase

> Tetap di prinsip PRD: **fitur minimum, polish maksimum**. Mockup sekarang = fondasi UI siap.

### Fase 0 — Fondasi data (wajib pertama)
- [ ] Pasang Postgres + Drizzle, `next.config` `output: standalone` (sudah).
- [ ] Skema tabel (lihat §6) + `tenant_id` di semua tabel domain.
- [ ] Aktifkan **RLS** + helper set `app.tenant_id` per request.
- [ ] Ganti `lib/mock/*` → repository ber-tenant (interface sama, sumber beda).
- [ ] Seed 1 tenant demo dari data mock sekarang.

### Fase 1 — Tenancy core
- [ ] `resolveTenant(host)` + perluas `middleware.ts` (subdomain → `x-tenant`).
- [ ] `getTenant()` (RSC, baca header) + inject `theme` ke `app/layout.tsx`.
- [ ] better-auth scoped per tenant + tabel `users`/`memberships` (RBAC).
- [ ] Pisahkan super-admin (platform) dari admin tenant.

### Fase 2 — Feature flags & gating
- [ ] `lib/tenant/features.ts` (PLANS/FEATURES sesuai PRICING §6).
- [ ] Middleware gate route + `<Gate feature>` + filter nav + page `/upgrade`.
- [ ] Terapkan ke komponen mockup (SearchBar/Checkout/akun/admin sesuai tabel flag).

### Fase 3 — Domain & white-label
- [ ] Tabel `domains` + Caddy on-demand TLS (BYOD + managed).
- [ ] Inject brand penuh (logo/warna) per tenant; flag `white_label` hapus badge.
- [ ] Alur konek domain di onboarding.

### Fase 4 — Billing, analytics, ops
- [ ] Self-serve signup + langganan (Midtrans/Stripe) + webhook ubah `plan`.
- [ ] Super-admin dashboard (kelola tenant, paket, status).
- [ ] Analytics/laporan + rekap + export (Business).
- [ ] Multi-admin/RBAC (Business), multi-cabang.

### Fase 5 — Enterprise (on-request)
- [ ] Bayar online end-to-end (checkout + gateway + verifikasi) per tenant.
- [ ] GPS/telematics integrasi, API publik, SLA.

---

## 10. Risiko & mitigasi

| Risiko | Mitigasi |
|---|---|
| Kebocoran data antar-tenant | **RLS di DB** (bukan cuma filter app) + `tenant_id` selalu dari host server-side |
| Bypass gating via URL manual | Hard gate di middleware + cek server-side di tiap action/API |
| Biaya domain managed membengkak | Jadikan add-on (bukan harga dasar); margin di retail |
| Mix klien Starter-heavy → ARR tipis | Upsell Growth, batasi Starter, push tahunan |
| SSL custom domain ribet | Caddy on-demand TLS (otomatis) |
| Churn bawa kabur domain | Domain atas nama tenant + ToS jelas |
| Build vs beli (PRD §13) | Bangun kustom karena tenancy+brand = pembeda; evaluasi ulang tiap fase |

---

## 11. Stack (konfirmasi, selaras CLAUDE.md)

Next.js 15 (App Router, RSC) · TS strict · Tailwind v4 + tokens · Postgres 16 + Drizzle + **RLS** · better-auth (OTP, tenant-scoped) · Midtrans (Enterprise) · VPS + **Caddy on-demand TLS** + PM2 · object storage (R2/S3) untuk foto · Mermaid untuk dokumentasi.

---

_Plan awal — iteratif. Update dokumen ini tiap fase selesai._
