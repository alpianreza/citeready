# Sync Redesign & Bug Fix Kritis → Eiran (Koordinator)

**Tanggal:** 2026-11-20 10:40 WIB  
**Trigger:** Masukan Bos untuk merombak total tampilan situs agar tidak terlihat standar sebelum trafik launch masuk.

---

## 1. Perombakan Total UI — "Obsidian Engineering Console" (Terverifikasi Browser QA)
Seluruh tampilan `site/` dan template laporan HTML (`src/report-html.mjs` → `site/sample-report.html`) dirombak total dengan gaya **developer-product premium** (terinspirasi Linear / Raycast / Vercel Dev Docs):
- **Estetika & Tipografi:** Kanvas Obsidian gelap (`#05080f`) dengan hairline coordinate grid 48px + radial emerald aura, tipografi `Space Grotesk` + `Inter` + `JetBrains Mono` (fallback lokal aman).
- **Split Hero + Interactive Telemetry Console:** Kolom kanan menampilkan jendela terminal interaktif dengan toggle **Before (`29/100 Grade F`) ⇄ After Fixes (`100/100 Grade A`)** lengkap dengan cincin skor SVG animatif, bar pilar, dan log CLI nyata (100% sinkron matematis dengan `sample-report.html`).
- **6-Pillar Bento Grid dengan Cursor-Tracking Spotlight** + custom SVG icons.
- **3-in-1 Browser Workbench IDE** (HTML Scanner + 10-Bot `robots.txt` Matrix + `llms.txt` Validator) dalam bingkai terminal terpadu.
- **12-Month Cost Comparison** (`$348–$588/yr` vs `$19 total`) + **Interactive Persona Switcher** di atas 3 kartu harga yang sejajar presisi.
- **Sample Report & Client PDF Report (`src/report-html.mjs`):** Tema Obsidian seragam di layar + otomatis berubah ke tema kertas putih bersih saat `@media print` / Save-as-PDF.
- **OG Card (`site/og-card.svg`):** Diperbarui seragam dengan tema Obsidian + gauge skor `100 / Grade A`.

## 2. Bonus Bug Kritis yang Tertangkap saat Browser QA (SUDAH DIPERBAIKI!)
Saat memverifikasi Tab 02 di browser, ditemukan **bug parser RFC 9309 baris kosong** di `src/robots-parser.mjs` dan `site/app.js` (baris kosong setelah `User-agent: * / Allow: /` membuat blok `User-agent: OAI-SearchBot / Disallow: /` di bawahnya tergabung ke grup `*`).
- **Sudah diperbaiki** di `src/robots-parser.mjs` & `site/app.js` + ditambah regression test di `test/run-tests.mjs`.
- **Terverifikasi:** `npm test` **10/10 pass**, `npm run audit:self` **100/100 (Grade A, 36/36 pass, 0 critical)**, Browser QA (`1280x800`) **0 console errors, 0 overflow, semua 3 section PASS**.

## 3. Aksi untuk Eiran (Sebelum Launch)
1. **Sync & push folder `site/` terbaru** (`index.html`, `styles.css`, `app.js`, `og-card.svg`, `sample-report.html`, `downloads/citeready-free-v1.0.0.zip`) ke `alpianreza/citeready` branch `main`.
2. **Sangat disarankan re-upload `dist/citeready-pro-v1.0.0.zip` (33.248 bytes)** ke Gumroad & Polar agar pembeli mendapat perbaikan parser `robots.txt` RFC 9309 + template laporan HTML dark/print-ready terbaru.
3. Setelah tayang + Bos beri izin di `marketing/APPROVAL-PACK-DAY2.md` & `marketing/OUTREACH-TOP10-POLISHED.md` (+ 1x tes beli Gumroad), langsung gas distribusi!
