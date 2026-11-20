# Update Day 2 dari Agy (PC Agent) → Eiran (Koordinator)

**Tanggal:** 2026-11-20 pagi (Day 2)  
**Target Hari Ini:** Deploy update konversi `site/`, uji checkout Gumroad, audit nyata 20 target prospek, dan mulai peluncuran setelah izin Bos turun.

---

## 1. Upgrade Produk & Konversi yang Selesai Dibangun Agy Pagi Ini

1. **Product-Led Growth (PLG) Loop pada Free Lite CLI:**
   - `bin/citeready.mjs` mode `--lite` kini langsung menampilkan CTA upgrade yang jujur dengan link Gumroad aktif (`https://eiran.gumroad.com/l/shubyl` \$19 Pro & `https://eiran.gumroad.com/l/eiosatl` \$29 DFY) setiap kali audit menemukan issue.
   - `scripts/package-release.mjs` kini otomatis menyalin `dist/citeready-free-v1.0.0.zip` ke **`site/downloads/citeready-free-v1.0.0.zip`** agar pengunjung `citeready.eiran.tech` bisa **1-klik download Free Lite CLI (29 KB, tanpa signup)** langsung dari landing page!
2. **Upgrade Widget Browser menjadi 3-in-1 Free GEO Toolkit (`site/index.html` + `site/app.js`):**
   - **Tab 1:** HTML Scanner & Fix Preview (`llms.txt` + `robots.txt` + **JSON-LD** + tombol **Copy Snippet**).
   - **Tab 2:** **`robots.txt` AI Bot Checker** (paste `robots.txt` → matriks 10 AI bot langsung tampil ALLOWED/BLOCKED!).
   - **Tab 3:** **`llms.txt` Spec Validator** (cek kepatuhan resmi `llmstxt.org` secara instan di browser).
   - Ditambahkan juga **Zero-Risk Delivery Guarantee** di bawah kartu harga (24h SLA / refund penuh untuk DFY \$29 & Agency \$49).
3. **20 Target Prospek Nyata Siap Audit (`ops/prospect-urls.txt`):**
   - Sudah diisi **20 domain nyata** hasil riset web pagi ini: **13 Indie SaaS / Dev Tools** (target \$19 Pro / \$29 DFY) + **7 Boutique Next.js Agencies** (target \$49 Agency Ship Pack).
4. **Aset Trafik Organik \$0 Tambahan:**
   - Artikel teknis siap tayang untuk Dev.to & Hashnode: `marketing/devto-hashnode-article.md`.
   - Daftar 10 direktori launch gratis (\$0) + copy siap paste: `marketing/free-directories-day2.md`.

---

## 2. Aksi Konkret untuk Eiran (Sync & Eksekusi Berinternet)

1. **Sync & Push ke `alpianreza/citeready` (`main`):**
   - Pastikan seluruh folder `site/` terbaru (termasuk `site/downloads/citeready-free-v1.0.0.zip`, perbaikan domain `citeready.eiran.tech`, 3-in-1 Browser Toolkit, blok CLI Before/After, dan Zero-Risk Guarantee) ter-deploy ke `https://citeready.eiran.tech` sebelum trafik launch datang.
   - *(Opsional tapi bagus: update file `dist/citeready-pro-v1.0.0.zip` di Gumroad & Polar agar User-Agent & komentar `robots.txt` memakai `https://citeready.eiran.tech`).*
2. **Jalankan 1 Perintah Batch Audit Nyata (20 Target Prospek):**
   Karena shell lokal PC ini diblokir outbound HTTP, mohon jalankan di mesin berinternet setelah sync:
   ```bash
   node scripts/batch-prospect-audit.mjs ops/prospect-urls.txt --append-csv
   ```
   Setelah selesai, kirim balik `ops/prospects.csv` dan `tmp-outreach/outreach-drafts.md` ke folder lokal agar saya poles masing-masing pesan 1-on-1 sebelum Bos menyetujui pengiriman.
3. **Jangan posting/outreach apa pun** sebelum Bos memberi izin eksplisit atas kanal di `marketing/APPROVAL-PACK-DAY2.md`.
