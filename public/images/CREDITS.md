# public/images — Asset Credits

Semua asset di-generate via **fal.ai MCP** (model `fal-ai/nano-banana-2`, Google Nano Banana 2). Tanggal generate: 2026-06-13/14.

Style direction selaras `DESIGN.md` (BMW corporate): studio bersih, soft natural lighting, foto edge-to-edge tanpa drop shadow, finish realistic.

Total asset: **46 webp** (~3.1 MB).

---

## Hero / OG (3)

| File | Aspect | Res | Seed | Prompt ringkas |
|---|---|---|---|---|
| `hero-main.webp` | 16:9 | 2K | 11001 | Silver MPV + black SUV di tollway, golden hour, mountain backdrop, negative space kiri |
| `hero-mobile.webp` | 4:5 | 1K | 11002 | Premium black SUV di coastal road sunrise, vertical mobile crop |
| `og-default.webp` | 16:9 | 1K | 11003 | Hero crop, MPV + SUV golden hour, ruang teks tengah |

## Kategori (5)

| File | Aspect | Res | Seed | Subjek |
|---|---|---|---|---|
| `category-mpv.webp` | 4:3 | 1K | 11101 | Silver MPV (Avanza-style) — 3/4 front, studio cream |
| `category-suv.webp` | 4:3 | 1K | 11102 | Black SUV (Fortuner-style) — 3/4 front, studio cream |
| `category-citycar.webp` | 4:3 | 1K | 11103 | White city car (Brio-style) — 3/4 front |
| `category-premium.webp` | 4:3 | 1K | 11104 | Navy premium sedan (Camry-style) — 3/4 front, dark luxury |
| `category-ev.webp` | 4:3 | 1K | 11105 | White EV crossover dengan charging port — 3/4 front |

## Supporting (8)

| File | Aspect | Res | Seed | Subjek |
|---|---|---|---|---|
| `feature-self-drive.webp` | 1:1 | 1K | 12001 | POV setir, tangan di steering, jalan Indonesian urban |
| `feature-with-driver.webp` | 1:1 | 1K | 12002 | Sopir berseragam buka pintu penumpang sedan hitam |
| `trust-handover.webp` | 1:1 | 1K | 12003 | Serah-terima kunci + checklist clipboard, counter rental |
| `trust-verifikasi.webp` | 1:1 | 1K | 12004 | Flat-lay KTP/SIM + pen + tablet di meja, daylight |
| `trust-fleet.webp` | 16:9 | 1K | 12005 | Lot parkir armada (silver MPV, hitam SUV, white EV, navy sedan) |
| `cta-band.webp` | 16:9 | 1K | 12006 | Premium SUV drive coastal road sunset, motion blur |
| `how-1-search.webp` | 4:3 | 1K | 12007 | Smartphone screen rental search UI, hand over desk |
| `how-2-pickup.webp` | 4:3 | 1K | 12008 | Customer signing rental agreement, hands + key + tablet |

## Mobil Detail (10 mobil x 3 angle = 30)

Per mobil tersedia 3 angle: `exterior` (3/4 front, 4:3), `side` (16:9), `interior` (4:3).

Seed convention: `2{XX}{angle}` dengan XX=01-10, angle=1 exterior, 2 side, 3 interior.

| Slug | Model contoh | Warna | Kategori |
|---|---|---|---|
| `mobil-01-*` | Toyota Avanza-style | Silver | MPV |
| `mobil-02-*` | Toyota Innova-style | Black | MPV Premium |
| `mobil-03-*` | Mitsubishi Pajero-style | Black | SUV |
| `mobil-04-*` | Toyota Fortuner-style | White | SUV |
| `mobil-05-*` | Honda Brio-style | Red | City car |
| `mobil-06-*` | Daihatsu Ayla-style | Silver | City car |
| `mobil-07-*` | Toyota Camry-style | Navy | Premium sedan |
| `mobil-08-*` | Mercedes E-Class-style | Black | Premium sedan |
| `mobil-09-*` | BYD Atto-style | White | EV |
| `mobil-10-*` | Hyundai Ioniq-style | Blue | EV |

Semua exterior 3/4 front, studio cream-grey atau dark luxury background, no shadow on ground. Side profile semua 16:9 studio infinity background. Interior 4:3 dashboard view dengan natural lighting / ambient luxury sesuai kategori.

---

## Reproducibility

Cara regenerate satu file:
```
mcp__fal-ai__generate({
  app_id: "fal-ai/nano-banana-2",
  input_data: {
    prompt: "<lihat tabel di atas>",
    aspect_ratio: "<sesuai tabel>",
    resolution: "<1K/2K>",
    output_format: "webp",
    num_images: 1,
    seed: <seed dari tabel>
  }
})
```
Download dari URL hasil pakai `curl -L -o public/images/<file>.webp '<url>'`.

## Biaya

Total batch ini: ~**$1.87 USD** (estimate 47 image, 1 test dibuang).
Cek `mcp__fal-ai__estimate_cost` sebelum batch berikutnya.
