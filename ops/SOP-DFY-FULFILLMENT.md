# SOP Pemenuhan Paket Done-For-You ($29) & Agency ($49)

**SLA Pengiriman:** Maksimal **24 jam** sejak pembayaran terverifikasi di Gumroad / Polar.  
**Tujuan:** Memberikan paket perbaikan AI Search (GEO) & Launch-Readiness yang benar-benar siap *copy-paste* ke repositori klien, rapi, terverifikasi bebas error, dan mendorong testimoni organik untuk meningkatkan konversi berikutnya.

---

## Tahap 1: Konfirmasi Intake Pasca-Bayar (Dalam 2 Jam)

Cek notifikasi pesanan masuk di Gumroad (`eiran.gumroad.com/l/eiosatl` atau `ycusnw`) / Polar:
- Catat: **Order ID**, **Tanggal**, **Jumlah USD**, **Email Klien**, **Target Website URL**, **Tech Stack / Framework** (Next.js / Astro / Vite / WordPress / Static HTML), dan (khusus Agency \$49) **Nama Brand White-Label**.
- Jika klien lupa mengisi `Target Website URL` atau `Tech Stack` saat checkout, kirim email singkat berikut:

```text
Subject: [CiteReady] Received your order — quick detail to start your 24h Fix Pack

Hi [Name],

Thanks for ordering the CiteReady [Done-For-You Fix Pack / Agency Ship Pack]!

To generate your custom files accurately, please reply with:
1. Target Website URL (e.g., https://yourdomain.com)
2. Your stack/framework (Next.js App Router, Astro, Vite, WordPress, or plain HTML)
3. (Optional for Agency Pack) Your studio/agency name for the white-label report header

Once received, I will deliver your full audit report and ready-to-drop fix files within 24 hours.

Best,
CiteReady (hello@eiran.tech)
```

---

## Tahap 2: Eksekusi Audit & Manual QA (30–45 Menit per Order)

1. **Jalankan CLI dengan crawl mendalam (25 halaman):**
   ```bash
   node bin/citeready.mjs https://CLIENT-DOMAIN.com --crawl 25 --fix --brand "CiteReady" --out ./tmp-orders/ORDER-ID
   ```
   *(Untuk paket **Agency \$49**, gunakan `--brand "Nama Agensi Klien"` jika diminta).*

2. **Checklist QA Manual Wajib (JANGAN langsung kirim mentah tanpa cek!):**
   - [ ] **`llms.txt`:** Cek H1, blockquote summary (tajam & akurat menjelaskan produk klien, bukan teks generic), urutan link halaman utama (pricing, docs, features, about), dan pastikan lolos `validateLlmsTxt()`.
   - [ ] **`llms-full.txt`:** Pastikan bebas teks navigasi/cookie-banner sampah, bersih dalam Markdown.
   - [ ] **`robots.txt`:** Pastikan aturan `Disallow` privat lama klien (misal `/admin`, `/api`, `/account`) **tetap terjaga**, sementara `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot` diizinkan, dan `Sitemap:` mengarah ke URL sitemap klien yang benar.
   - [ ] **`jsonld-snippets.html`:** Validasi setiap blok JSON-LD (cek `Organization`, `WebSite`/`SoftwareApplication`/`Product`, `FAQPage`), lengkapi harga/nama produk asli klien, dan pastikan lolos `JSON.parse`.
   - [ ] **`head-meta-patch.html` & `nextjs-metadata.ts`:** Pastikan `<title>` (45–65 karakter), `<meta description>` (120–160 karakter), `canonical`, dan `og:image` valid.
   - [ ] **`citeready-report.html`:** Buka di browser, cek tidak ada teks terpotong, lalu export juga versi **PDF (`citeready-report.pdf`)** via tombol *Save / Print as PDF*.

---

## Tahap 3: Struktur Deliverable ZIP Klien

Kemas folder menjadi `citeready-fixpack-[domain].zip` berisi:
```text
citeready-fixpack-[domain]/
├── README-INSTALL.md          # Instruksi pemasangan 10 menit sesuai stack klien
├── citeready-report.html      # Laporan interaktif lengkap (tab copy-paste)
├── citeready-report.pdf       # Versi PDF siap kirim ke tim/manajemen
├── llms.txt                   # Drop ke /public/llms.txt (atau root hosting)
├── llms-full.txt              # Drop ke /public/llms-full.txt
├── robots.txt                 # Drop ke /public/robots.txt
├── jsonld-snippets.html       # Paste ke dalam <head>
├── head-meta-patch.html       # Paste ke dalam <head> (HTML/Astro/WordPress)
└── nextjs-metadata.ts         # Drop ke app/layout.tsx (jika Next.js)
```

### Template `README-INSTALL.md` (Sertakan di Dalam ZIP)
```markdown
# CiteReady Fix Pack — [DOMAIN]

Current Audit Score: **[BEFORE_SCORE]/100 (Grade [GRADE])**  
Estimated Post-Deploy Score: **90–100/100**

## 10-Minute Install Steps ([FRAMEWORK])
1. Copy `llms.txt`, `llms-full.txt`, and `robots.txt` to your public web root (`public/` for Next.js/Vite/Astro, or root directory for static HTML/WordPress).
2. Add `jsonld-snippets.html` inside your site's `<head>`.
3. Apply `head-meta-patch.html` (or merge `nextjs-metadata.ts` into `app/layout.tsx`).
4. Deploy and verify `https://[DOMAIN]/llms.txt` and `https://[DOMAIN]/robots.txt` return HTTP 200.

Need a quick re-check after you deploy? Reply to our delivery email and I'll verify your live score at no extra cost.
```

---

## Tahap 4: Email Pengiriman & Permintaan Testimoni (48 Jam Kemudian)

### Email Pengiriman (Segera setelah QA selesai)
```text
Subject: [CiteReady] Your GEO & Launch Fix Pack for [DOMAIN] is ready (Score: [SCORE]/100 -> 95+)

Hi [Name],

Your CiteReady Fix Pack for [DOMAIN] is ready — attached is `citeready-fixpack-[domain].zip`.

Quick Summary of What We Found & Fixed:
- Baseline score: [SCORE]/100 ([CRITICAL] critical, [WARNING] warnings)
- Top fixes included: [e.g., created llmstxt.org-compliant llms.txt & llms-full.txt, unblocked OAI-SearchBot & PerplexityBot in robots.txt, generated validated Organization + Product + FAQPage JSON-LD, and patched OG/canonical tags]

Open `README-INSTALL.md` inside the ZIP for 10-minute copy-paste instructions tailored to [FRAMEWORK], plus `citeready-report.html` / `.pdf` for the full 36-check breakdown.

Once you deploy these files, reply to this email and I'll gladly run a free verification re-scan to confirm your new score.

Best,
CiteReady
```

### Follow-Up & Permintaan Testimoni Jujur (48 Jam Setelah Pengiriman)
```text
Subject: Quick check-in on [DOMAIN] + free re-scan?

Hi [Name],

Just checking if you had a chance to drop the CiteReady files into [DOMAIN]. If you've deployed them, reply "ready" and I'll run your free verification scan and send your updated score.

Also, if the Fix Pack saved you time, would you mind replying with 1–2 honest sentences on what helped most (and whether we may quote it with your first name/site)? Totally optional—either way, appreciate your support!

Best,
CiteReady
```

---

## Tahap 5: Pencatatan Transaksi Terverifikasi (`ops/ledger.json`)

Setelah setiap penjualan nyata masuk, **WAJIB** catat bukti terverifikasi (Order ID Gumroad/Polar, jumlah bruto USD, fee platform, dan net USD) ke `ops/ledger.json` dan laporan harian terkait. Jangan pernah mencatat transaksi uji coba/refund sebagai revenue.
