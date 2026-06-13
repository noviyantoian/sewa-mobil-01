# PRD — Website Rental Mobil

**Status:** Draft v1.1
**Tanggal:** 13 Juni 2026
**Pemilik dokumen:** Noviyanto
**Model bisnis:** Fleet milik sendiri (B2C), opsi lepas kunci (self-drive) & dengan sopir
**Target pasar:** Campuran — pengguna lokal, wisatawan, dan korporat (B2B)
**Prinsip rilis:** **Sistem MVP sengaja dibuat sederhana, tetapi desain & UX harus lengkap, profesional, modern, dan clean sejak hari pertama.**

> **Filosofi v1.1:** kompleksitas ada di *fitur*, bukan di *kualitas*. Kita memangkas cakupan sistem agar cepat rilis dan murah dirawat — tapi tidak memangkas kualitas visual. Pelanggan menilai kepercayaan sebuah rental dari tampilan; halaman yang rapi & meyakinkan langsung menaikkan konversi. Jadi: **fitur seminimal mungkin, polish setinggi mungkin.**

---

## 1. Ringkasan Eksekutif

Membangun website (responsive, mobile-first) untuk menyewakan armada mobil milik perusahaan sendiri, dengan dua mode: **lepas kunci (self-drive)** dan **dengan sopir**. Platform melayani pelanggan ritel lokal, wisatawan, dan korporat melalui satu alur booking, pembayaran, verifikasi identitas, dan manajemen armada.

Untuk MVP, sistem dijaga **sesederhana mungkin** (alur booking inti + dashboard ops dasar), sementara **desain dibuat lengkap dan profesional** — bukan prototipe kasar. Tujuannya: rilis cepat, biaya rawat rendah, tapi kesan kredibel dan modern yang mendorong konversi.

---

## 2. Latar Belakang & Peluang Pasar

Pasar sewa mobil Indonesia diperkirakan bernilai sekitar **USD 0,86–1 miliar pada 2025** dan diproyeksikan tumbuh dengan CAGR sekitar **14–16%**, salah satu yang tercepat di Asia Tenggara. Pendorong: pariwisata (Bali +20% wisatawan asing), urbanisasi, infrastruktur (tol, bandara), dan digitalisasi. Permintaan rental kendaraan listrik untuk korporat dilaporkan melonjak tajam pada 2025.

**Catatan kritis:** angka pasar ini berasal dari laporan komersial dengan rentang estimasi sangat lebar (proyeksi 2030 berkisar USD 1,8 miliar hingga >10 miliar). Perlakukan sebagai indikasi arah, bukan dasar perhitungan bisnis. Validasi dengan data bottom-up: jumlah armada, tarif, utilisasi, dan biaya akuisisi di kota target.

### Asumsi yang perlu divalidasi
- Permintaan online cukup besar di kota target — bukan sekadar migrasi pelanggan WhatsApp lama.
- Pelanggan bersedia bayar/deposit online (kebiasaan COD & nego masih kuat).
- Armada awal cukup agar katalog terasa "berisi" sejak hari pertama.
- Operasional sanggup memenuhi SLA yang dijanjikan website.

---

## 3. Tujuan & Metrik Keberhasilan

### Tujuan produk
1. Pelanggan dapat menyelesaikan booking sepenuhnya online tanpa chat manual.
2. Tim ops punya kontrol real-time atas ketersediaan, harga, dan status armada.
3. Tampilan yang profesional & jelas menurunkan keraguan dan sengketa.

### Metrik keberhasilan (target awal — sesuaikan setelah baseline)
| Metrik | Definisi | Target awal |
|---|---|---|
| Booking conversion rate | Sesi → booking dibayar | ≥ 3% |
| Online payment rate | Booking dibayar online vs total | ≥ 70% |
| Fleet utilization | Hari tersewa / hari tersedia | ≥ 55% |
| Cancellation rate | Booking batal / total | < 12% |
| CSAT pasca-sewa | Rata-rata rating | ≥ 4,5 / 5 |
| Repeat rate (90 hari) | Pelanggan menyewa lagi | ≥ 20% |

**Anti-metrik:** waktu serah-terima, rasio keluhan kerusakan, margin per booking. Konversi tinggi tak berarti jika ops rugi atau pelanggan kecewa.

---

## 4. Persona Pengguna

**P1 — Wisatawan (lokal/asing):** sewa 2–7 hari, butuh harga jelas, pickup bandara/hotel, opsi sopir, bahasa Inggris. Sensitif pada deposit besar & verifikasi ribet.

**P2 — Pelanggan ritel lokal:** acara keluarga, mudik, kebutuhan harian. Suka membandingkan harga & terbiasa nego via WhatsApp. Butuh alasan kuat untuk pindah ke booking online.

**P3 — Admin korporat (B2B):** sewa atas nama karyawan/tamu, butuh invoice/faktur pajak, termin, kontrak. (Sebagian besar ditunda ke Fase 2.)

**P4 — Tim operasional (internal):** kelola armada, jadwal, harga, sopir, maintenance, serah-terima.

**P5 — Sopir (internal):** menerima penugasan & konfirmasi serah-terima.

---

## 5. Ruang Lingkup — MVP Sederhana

> Prinsip: **kerjakan paling sedikit fitur yang membuat satu booking bisa selesai online dengan mulus**, lalu poles desainnya hingga profesional.

### 5.1 Dalam lingkup (MVP) — disederhanakan
- **Katalog mobil** dengan pencarian dasar: lokasi, tanggal, mode (self-drive/sopir) + filter ringkas (kategori, transmisi, kapasitas, harga).
- **Cek ketersediaan** berdasarkan tanggal & lokasi (tanpa double-booking).
- **Alur booking 1 halaman/wizard pendek:** pilih mobil → tanggal & lokasi → add-on minimal → ringkasan harga → identitas → bayar → konfirmasi.
- **Dua mode:** self-drive & dengan sopir (harga & syarat berbeda; penugasan sopir manual oleh admin).
- **Verifikasi identitas sederhana:** upload KTP/SIM/paspor (review manual admin) + deposit.
- **Pembayaran online** via 1 gateway (mis. Midtrans/Xendit) yang sudah mencakup QRIS, e-wallet, kartu, VA.
- **Akun pelanggan ringan:** login email/OTP, riwayat booking, kuitansi.
- **Dashboard admin esensial:** kelola unit & status, kalender ketersediaan, daftar booking (konfirmasi/batal/refund), verifikasi dokumen, harga dasar per kategori, penugasan sopir.
- **Notifikasi:** email + WhatsApp untuk konfirmasi, pengingat, dan perubahan.
- **Bilingual ID/EN**, mata uang tampilan IDR.

### 5.2 Sengaja DITUNDA dari MVP (agar tetap sederhana)
- Pickup/return beda lokasi (one-way), add-on kompleks, dynamic pricing.
- Modul korporat penuh (kontrak, termin, faktur pajak otomatis, portal B2B).
- OCR/verifikasi identitas otomatis, e-contract tanda tangan digital.
- Program loyalitas, telematika/GPS, app native iOS/Android.
- Manajemen promo lanjutan & laporan kompleks (cukup laporan dasar dulu).

### 5.3 Non-goals (tegas)
- Bukan agregator harga vendor lain; bukan marketplace P2P; bukan jual-beli mobil.

---

## 6. Kebutuhan Fungsional (MVP)

### 6.1 Pencarian & Katalog
- Cari berdasarkan kota/lokasi, tanggal–jam pickup/return, dan mode.
- Hasil hanya menampilkan unit yang benar-benar tersedia.
- Filter ringkas: kategori (MPV, SUV, city car, premium, EV), transmisi, kapasitas, harga.
- Detail mobil: foto, spesifikasi, harga rinci, syarat singkat, deposit.

### 6.2 Booking & Ketersediaan
- Hold sementara saat checkout (mis. 15 menit) agar tidak diambil pengguna lain.
- Aturan minimum durasi & jam operasional pickup.
- Pembatalan berjenjang (mis. gratis batal H-2, potongan setelahnya).

### 6.3 Verifikasi & Deposit
- Upload KTP/SIM (self-drive wajib SIM aktif) / paspor untuk WNA.
- Status: pending → approved/rejected (review manual admin di MVP).
- Deposit per kategori; refund sesuai kondisi unit saat kembali.

### 6.4 Pembayaran
- Satu payment gateway (QRIS, e-wallet, kartu, VA).
- Skema: bayar penuh atau DP + pelunasan (configurable).
- Kuitansi otomatis; refund manual/otomatis sesuai kebijakan.

### 6.5 Mode Dengan Sopir
- Harga termasuk jasa sopir + ketentuan (jam kerja, lembur, akomodasi luar kota, BBM, tol, parkir).
- Admin menugaskan sopir; sopir terima jadwal & kontak.
- Konfirmasi serah-terima (foto kondisi, KM awal/akhir).

### 6.6 Dashboard Admin
- Armada: tambah/edit unit, status (tersedia/disewa/maintenance/nonaktif), dokumen kendaraan + pengingat kedaluwarsa.
- Kalender ketersediaan; manajemen booking & refund; verifikasi dokumen; harga per kategori; penugasan sopir; laporan dasar (pendapatan, utilisasi).
- Peran sederhana: admin/ops & finance.

### 6.7 Notifikasi
- Konfirmasi booking & pembayaran, pengingat H-1 pickup, pengingat pengembalian, perubahan/pembatalan. Kanal: email + WhatsApp.

---

## 7. Desain, UX & Design System (Lengkap & Profesional)

> Ini bagian yang **tidak** disederhanakan. Sistemnya ringan, tapi pengalaman dan tampilannya harus terasa seperti produk matang.

### 7.1 Prinsip desain
- **Clean & modern:** banyak ruang putih, hierarki jelas, minim elemen dekoratif yang tidak fungsional.
- **Trust-first:** harga transparan (tanpa biaya tersembunyi), syarat & deposit terlihat sebelum bayar, foto mobil berkualitas, badge keamanan pembayaran.
- **Mobile-first:** dirancang untuk layar kecil dulu, lalu diperluas ke desktop.
- **Konsistensi:** satu design system (komponen, warna, tipografi) dipakai di seluruh halaman & dashboard.
- **Konversi:** CTA jelas di setiap langkah, jumlah field seminimal mungkin, progress booking yang terlihat.
- **Aksesibilitas:** kontras memadai, target sentuh ≥ 44px, label form jelas — target WCAG 2.1 AA pada alur inti.

### 7.2 Design system (fondasi visual)
- **Tipografi:** satu typeface sans-serif modern & mudah dibaca (mis. Inter/Plus Jakarta Sans) dengan skala ukuran konsisten (display, h1–h3, body, caption).
- **Warna:** 1 warna brand utama + 1 aksen, plus netral (abu-abu berjenjang), serta warna status (sukses/peringatan/error). Pastikan rasio kontras lolos AA.
- **Spacing & grid:** sistem spasi berbasis 4/8px; grid responsif (mobile 4 kolom, desktop 12 kolom).
- **Komponen (UI kit):** tombol (primary/secondary/ghost), input & dropdown, date range picker, kartu mobil, badge/tag, modal, toast/notifikasi, stepper, tabel data, empty state, skeleton loading, banner.
- **Sudut & bayangan:** radius lembut & shadow halus untuk kesan modern; konsisten antar komponen.
- **Ikonografi:** satu set ikon garis (mis. Lucide) yang seragam.
- **Status & feedback:** setiap aksi punya state (default, hover, loading, success, error, disabled) dan empty state yang dirancang, bukan halaman kosong.

### 7.3 Daftar layar yang harus didesain lengkap
**Sisi pelanggan**
1. Beranda / landing (hero pencarian, kategori populer, value proposition, trust signals).
2. Hasil pencarian (filter + daftar kartu mobil, status ketersediaan).
3. Detail mobil (galeri, spesifikasi, harga, syarat, CTA booking).
4. Alur booking (wizard pendek: tanggal/lokasi → identitas → pembayaran → konfirmasi).
5. Halaman pembayaran (ringkasan biaya jelas, metode, badge aman).
6. Konfirmasi booking (ringkasan + langkah berikutnya).
7. Akun: login/OTP, daftar booking, detail booking & kuitansi.
8. Halaman statis: cara kerja, syarat & ketentuan, FAQ, kontak.

**Sisi admin (gaya konsisten, tetap clean)**
9. Dashboard ringkas (booking hari ini, unit tersedia, pendapatan).
10. Manajemen armada & kalender ketersediaan.
11. Manajemen booking & refund.
12. Verifikasi dokumen pelanggan.
13. Penugasan sopir.

### 7.4 Deliverable desain
- **Design system / UI kit** terdokumentasi (komponen + token warna/tipografi/spacing).
- **Mockup high-fidelity** untuk semua layar di atas (mobile & desktop) di Figma.
- **Prototipe interaktif** alur booking utama untuk uji kegunaan singkat.
- **Panduan handoff** ke developer (spacing, state, responsif).

> Catatan praktis: untuk menghemat waktu tanpa mengorbankan kualitas, MVP boleh memakai pondasi komponen siap pakai yang sudah profesional (mis. Tailwind + shadcn/ui atau Material) lalu di-brand — bukan membangun setiap komponen dari nol.

---

## 8. Kebutuhan Non-Fungsional

- **Performa:** beranda & hasil pencarian < 3 detik di 4G; cek ketersediaan < 1 detik.
- **Keandalan:** uptime 99,5%; tidak boleh ada double-booking.
- **Keamanan & privasi:** enkripsi dokumen sensitif (KTP/SIM/paspor) saat transit & disimpan; akses berbasis peran; kepatuhan UU PDP (minimisasi data, retensi, hak hapus).
- **Pembayaran:** gunakan gateway tersertifikasi PCI-DSS; jangan menyimpan data kartu mentah.
- **Mobile-first & responsif penuh.**
- **Skalabilitas wajar:** mudah tambah kota/unit tanpa rombak besar.
- **Observability:** logging, monitoring error, audit trail transaksi & perubahan booking.

---

## 9. Alur Pengguna Inti (Happy Path)

**Self-drive:** Cari → pilih mobil → add-on minimal → masuk/daftar → upload SIM/KTP → bayar + deposit → konfirmasi → pickup (serah-terima) → kembalikan → deposit refund.

**Dengan sopir:** Cari (mode sopir) → pilih mobil & paket → isi jadwal/rute → bayar → admin tugaskan sopir → perjalanan → selesai & rating.

---

## 10. Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Double-booking | Pelanggan kecewa | Hold saat checkout + locking DB; satu sumber kebenaran ketersediaan |
| Penipuan / mobil tak kembali | Kerugian aset | Verifikasi dokumen, deposit memadai, batasi self-drive nilai tinggi untuk pelanggan baru, GPS (fase lanjut) |
| Sengketa kerusakan/deposit | Konflik & chargeback | Foto kondisi wajib (KM, BBM, body), kebijakan disetujui di checkout |
| Adopsi rendah (tetap pakai WhatsApp) | ROI lambat | Insentif harga online, garansi unit, integrasi WhatsApp transisi |
| Ops tak penuhi SLA | Rating turun | Mulai 1–2 kota, batasi slot, otomasi pengingat |
| Kepatuhan UU PDP & pajak | Sanksi hukum | Konsultasi legal awal, retensi jelas |
| Ketergantungan 1 gateway | Pembayaran terganggu | Siapkan provider cadangan sebagai rencana B |
| "Desain bagus tapi fitur tak jalan" | Konversi semu | Pastikan alur booking benar-benar berfungsi end-to-end, bukan sekadar tampilan |

---

## 11. Asumsi, Pertanyaan Terbuka & Dependensi

### Asumsi
- Armada fisik & izin usaha sudah ada; ada tim ops untuk serah-terima & maintenance.
- Pembayaran online dapat diterima sebagian besar segmen target.

### Pertanyaan terbuka (perlu keputusan)
1. Kota/cabang peluncuran awal?
2. Jumlah & kategori armada awal?
3. DP diperbolehkan atau wajib bayar penuh?
4. Deposit ditahan via gateway atau transfer manual?
5. Korporat masuk MVP atau ditunda ke Fase 2? (rekomendasi: tunda)
6. Build sendiri vs platform rental SaaS — sudah dievaluasi?

### Dependensi
- Payment gateway (Midtrans/Xendit/Doku atau setara).
- WhatsApp Business API untuk notifikasi.
- Tooling desain (Figma) + komponen UI (mis. Tailwind/shadcn).
- Hosting, domain, SSL.

---

## 12. Roadmap Berfase

**Fase 0 — Validasi:** landing page + booking sederhana/WhatsApp di 1 kota. Ukur apakah pelanggan mau bayar online sebelum bangun penuh.

**Fase 1 — MVP (cakupan dokumen ini):** alur booking self-drive & sopir, pembayaran 1 gateway, verifikasi manual, dashboard ops esensial, **desain lengkap & profesional** — 1–2 kota.

**Fase 2 — Korporat & skala:** portal B2B, faktur pajak, termin, multi-cabang, one-way, laporan lanjutan.

**Fase 3 — Optimasi:** dynamic pricing, loyalitas, telematika/GPS, app native, EV, OCR identitas.

---

## 13. Catatan Tantangan (Devil's Advocate)

- **"Sederhana" jangan berarti "asal jadi", dan "desain lengkap" jangan jadi alasan over-design.** Bahaya MVP justru terlalu banyak memoles tampilan halaman yang belum terbukti dibutuhkan. Selesaikan dulu satu alur booking yang benar-benar jalan dengan desain profesional; jangan habiskan minggu untuk animasi/halaman sekunder.
- **Profit rental ditentukan operasional, bukan etalase.** Utilisasi, maintenance, dan risiko penipuan menentukan untung lebih dari UI. Desain bagus menaikkan konversi, tapi tidak menutup ops yang bocor.
- **Pembayaran online di muka bisa menurunkan konversi** di segmen yang terbiasa nego/COD — validasi di Fase 0.
- **Build vs beli:** jika teknologi bukan pembeda, SaaS rental siap pakai bisa lebih cepat & murah; bangun kustom hanya bila ada keunggulan nyata.

Rekomendasi: jalankan Fase 0, kunci design system lebih dulu (agar konsisten), lalu bangun MVP dengan cakupan minimal tapi tampilan matang.

---
