# PRICING — FolkaDrive (Multi-Tenant SaaS)

> **Status:** Draft v1 · 2026-06-15 · **Rencana (belum diimplementasi)**
> Sumber kebenaran harga & feature-gating. Saat fitur multi-tenant dibangun, paket di bawah jadi acuan `lib/tenant/features.ts`.
> Lihat arsitektur teknis di [`docs/SAAS-PLAN.md`](SAAS-PLAN.md).

---

## 1. Positioning

White-label rental car website untuk bisnis rental kecil–menengah Indonesia. Tiap bisnis (tenant) dapat website branded sendiri + dashboard ops, satu codebase. Strategi: **harga murah, main volume**. Booking lewat **WhatsApp di semua paket**; bayar online adalah lapisan premium (Enterprise, on-request).

**Pembanding pasar:** web custom = jutaan + ribet rawat · marketplace = potong komisi 10–20%/booking. Kita: **flat murah, brand sendiri, nol komisi.**

---

## 2. Paket

| | **Starter** | **Growth** | **Business** | **Enterprise** |
|---|:--:|:--:|:--:|:--:|
| **Harga / bln** | **Rp 99.000** | **Rp 249.000** | **Rp 549.000** | **Custom (hubungi)** |
| **Tahunan** (hemat 2 bln) | Rp 990.000 | Rp 2.490.000 | Rp 5.490.000 | Kontrak |
| Max unit/armada | 15 | 50 | 150 | Unlimited |
| Subdomain `nama.folkadrive.com` | ✓ | ✓ | ✓ | ✓ |
| Konek custom domain + SSL (BYOD) | ✓ | ✓ | ✓ | ✓ |
| White-label (hapus badge "Powered by") | — | ✓ | ✓ | ✓ |
| **Integrasi WhatsApp** (chat + notif booking) | ✓ | ✓ | ✓ | ✓ |
| Landing + halaman detail mobil | ✓ | ✓ | ✓ | ✓ |
| **Form booking sederhana di detail → WA** | ✓ | ✓ | ✓ | ✓ |
| Katalog + filter kategori | ✓ | ✓ | ✓ | ✓ |
| Form pencarian lengkap (range harga, transmisi, kapasitas, sort) | — | ✓ | ✓ | ✓ |
| Mode dengan sopir + antar/delivery | — | ✓ | ✓ | ✓ |
| Bilingual ID/EN | ID | ✓ | ✓ | ✓ |
| Member portal (login, akun, riwayat) | — | ✓ | ✓ | ✓ |
| Admin: armada + daftar booking | ✓ | ✓ | ✓ | ✓ |
| Admin: kalender + verifikasi + penugasan sopir | — | ✓ | ✓ | ✓ |
| **Analytics + laporan + rekap (export Excel/PDF)** | — | basic | lengkap | lengkap |
| **Multi-admin + peran** (admin/finance/ops) | — | — | ✓ | ✓ |
| Multi-cabang / multi-lokasi | — | — | ✓ | ✓ |
| **Bayar online** (checkout + payment gateway + verifikasi identitas) | — | — | — | ✓ *(on request)* |
| **Pelacakan mobil / GPS telematics** | — | — | — | ✓ *(on request)* |
| API + integrasi/fitur custom | — | — | — | ✓ |
| Support | Email | Email prioritas | WA prioritas | Dedicated + SLA |

### Alur booking per tier (penting)
- **Starter / Growth / Business:** pelanggan isi form di web → **order masuk ke WhatsApp owner** + tercatat di admin. Bayar manual/transfer/COD diatur owner. *Online payment OFF.*
- **Enterprise:** + **bayar online** end-to-end (checkout + gateway + verifikasi). WA tetap jalan untuk notif.

---

## 3. Mode domain (semua paket)

| Mode | Apa | Biaya |
|---|---|---|
| **A. Subdomain** (default) | `nama.folkadrive.com` | Gratis |
| **B. Bawa sendiri (BYOD)** | Domain milik tenant, kita konek (DNS + SSL otomatis) | Gratis konek (opsi bantu setup Rp 150k sekali) |
| **C. Dikelola kita (managed)** | Kita beli + perpanjang + kelola DNS/SSL | Add-on (lihat §4) |

- Tahunan **Business/Enterprise** → 1 domain `.com` managed **gratis tahun pertama**.
- Domain managed **didaftarkan atas nama tenant** (mereka pemilik sah; kita pengelola teknis). Saat churn: web mati, domain tetap milik tenant — tertulis di ToS.

---

## 4. Add-on

| Add-on | Harga |
|---|---|
| +10 unit armada | Rp 25.000/bln |
| +1 cabang | Rp 99.000/bln |
| Managed domain `.com` | Rp 25.000/bln |
| Managed domain `.id` | Rp 40.000/bln |
| Managed domain `.co.id` | Rp 50.000/bln |
| Bantu setup BYOD (sekali) | Rp 150.000 |
| Onboarding / migrasi data (sekali) | Rp 250.000 |

---

## 5. Model finansial (target 50 klien akhir tahun)

### COGS (per bulan, 50 tenant — infra dipakai bersama)
| Item | Rp/bln |
|---|--:|
| VPS app + Postgres (50 situs low-traffic) | 600.000 |
| Object storage (foto) + backup | 150.000 |
| Email transaksional (OTP/notif) | 100.000 |
| WhatsApp (click-to-chat gratis; buffer WA API) | 200.000 |
| Monitoring + error + registrar reseller + misc | 150.000 |
| **Total COGS** | **~Rp 1.200.000** (~Rp 24k/tenant) |

> Belum termasuk gaji/tim & biaya bangun awal (modal terpisah).

### Skenario pendapatan @ 50 klien
| Skenario | Mix (S/G/B/E) | MRR | ARR |
|---|---|--:|--:|
| Konservatif (Starter-heavy) | 30 / 15 / 4 / 1 | ~Rp 10,4jt | ~Rp 125jt |
| **Base (realistis)** | **25 / 18 / 5 / 2** | **~Rp 12,7jt** | **~Rp 152jt** |
| Optimis | 20 / 20 / 8 / 2 | ~Rp 14,4jt | ~Rp 172jt |

*Enterprise diasumsikan rata Rp 1,5jt/bln. Add-on biasanya +10–15% → base ~Rp 14jt MRR.*

### Ringkas
| Metrik | Base |
|---|--:|
| ARPU | ~Rp 254.000 |
| Gross margin | ~90% |
| **Break-even** | **~28–30 klien** |
| Laba @50 klien (setelah asumsi gaji Rp 6jt) | ~Rp 5,5jt/bln |
| Revenue terkumpul thn-1 (ramp 0→50) | ~Rp 70–90jt |
| Exit ARR (Des, run-rate) | ~Rp 150jt |

### Catatan strategi
- **Jangan naikkan harga** — murahnya senjata akuisisi.
- **Push paket tahunan** (cash depan + retensi).
- **Upsell Growth** keras (search lengkap + member = nilai jelas). Target ≥35% klien di Growth+.
- Starter sengaja dibatasi (15 unit, no member, no search lengkap) → dorong naik kelas.
- Risiko utama: **mix kebanyakan Starter** (konservatif MRR turun ke ~Rp 10,4jt — masih untung tipis). Mitigasi: bundling domain managed + data lock-in untuk retensi.

---

## 6. Pemetaan paket → feature flag (acuan implementasi)

Saat dibangun, tiap fitur jadi flag; tier = kumpulan flag. Detail enforcement di [`docs/SAAS-PLAN.md`](SAAS-PLAN.md).

| Feature flag | Starter | Growth | Business | Enterprise | Komponen mockup terkait |
|---|:--:|:--:|:--:|:--:|---|
| `wa_integration` | ✓ | ✓ | ✓ | ✓ | tombol WA, notif |
| `simple_booking_form` | ✓ | ✓ | ✓ | ✓ | renter form di `mobil/[slug]` |
| `catalog_basic_filter` | ✓ | ✓ | ✓ | ✓ | `/cari` katalog + filter kategori |
| `full_search` | — | ✓ | ✓ | ✓ | `SearchBar` + `FilterPanel` (range harga, sort) |
| `driver_mode` | — | ✓ | ✓ | ✓ | toggle mode di `SearchBar`/detail |
| `delivery` | — | ✓ | ✓ | ✓ | toggle antar di `SearchBar` |
| `bilingual` | — | ✓ | ✓ | ✓ | `LangSwitch` |
| `member_portal` | — | ✓ | ✓ | ✓ | `/login`, `/akun/booking` |
| `admin_ops` | — | ✓ | ✓ | ✓ | `/admin/kalender|verifikasi|sopir` |
| `analytics` | — | basic | full | full | `/admin` reports |
| `multi_admin` | — | — | ✓ | ✓ | RBAC admin |
| `multi_branch` | — | — | ✓ | ✓ | locations multi |
| `white_label` | — | ✓ | ✓ | ✓ | hapus badge, theme penuh |
| `online_payment` | — | — | — | ✓ (req) | `/checkout`, `PaymentMethods`, `DocumentUpload` |
| `gps_tracking` | — | — | — | ✓ (req) | integrasi telematics |
| `api_access` | — | — | — | ✓ | REST API |

---

_Angka & paket bisa berubah; ini baseline untuk validasi pasar._
