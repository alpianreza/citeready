# Top 10 Polished 1-on-1 Outreach Messages (Berbasis Skor Audit Nyata 20/11/2026)

**Status:** **DRAFT — BELUM DIKIRIM.** Menunggu izin eksplisit Bos sebelum pengiriman apa pun.  
**Sumber Data:** Audit HTTP live 20/20 situs oleh Eiran (`tmp-outreach/` & `ops/prospects.csv`).  
**Prinsip:** Singkat (<110 kata), nada sesama engineer/founder (bukan sales spam), sebutkan **fakta teknis spesifik yang terverifikasi** di domain mereka, tawarkan nilai lebih dulu, CTA lembut.

---

## Batch A — Top 5 Indie SaaS & Dev Tools (Target \$29 DFY / \$19 Pro CLI)

### 1. `flowjam.com` — Skor **72/100** (Paling Empuk #1)
**Temuan Nyata:** `/llms.txt` 404, `/llms-full.txt` 404, tidak ada `<main>/<article>`, heading pertama `<h4>` (bukan `<h1>`), 26 dari 82 gambar tidak punya `alt` (68%), tidak ada aturan AI crawler eksplisit di `robots.txt`.

```text
Subject: Quick AI Search & HTML heads-up for flowjam.com (4 fixes)

Hi FlowJam team,

Ran a quick 36-check AI Search & launch-readiness scan on flowjam.com (72/100) and spotted 4 easy wins:
- /llms.txt and /llms-full.txt currently return 404
- Homepage heading order starts at <h4> before <h1>, with no <main> landmark
- 26 of 82 homepage images are missing alt text (68% coverage)
- robots.txt has no explicit rules for OAI-SearchBot / PerplexityBot / ClaudeBot

I already generated the ready-to-drop llms.txt, llms-full.txt, robots.txt, and full HTML audit report for flowjam.com. Happy to send the summary free — or if you'd like the reviewed 6-file fix pack ready to drop into your repo, it's $29 one-time (https://eiran.gumroad.com/l/eiosatl) or $19 for the local CLI (https://citeready.eiran.tech).

Best,
CiteReady
```

---

### 2. `ideaproof.io` — Skor **80/100** (MASALAH PALING KRITIKAL UNTUK AI CRAWLER!)
**Temuan Nyata:** Homepage merender **0 kata yang terlihat (`0 visible words`)**, **0 tag `<h1>`**, **tanpa `<main>/<article>`**, **tanpa `<link rel="canonical">`**, dan tanpa `FAQPage` JSON-LD — karena HTML awal berupa CSR shell kosong yang tidak terbaca oleh bot AI non-JS (`OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`)!

```text
Subject: Heads-up: AI crawlers currently see 0 visible words on ideaproof.io

Hi IdeaProof founder,

Quick technical heads-up from running an AI Search / GEO scan on ideaproof.io:
- Non-JS crawlers (like PerplexityBot / OAI-SearchBot) currently receive 0 visible words, 0 <h1> tags, and no <main> landmark in the initial HTML payload
- Missing <link rel="canonical"> and FAQPage JSON-LD

Pre-rendering your hero + core copy (or pairing it with /llms-full.txt + structured JSON-LD) makes a huge difference for ChatGPT & Perplexity citations.

I generated the full 36-check HTML audit report plus ready-to-paste JSON-LD, canonical/meta patch, and llms-full.txt for ideaproof.io. Want the reviewed fix pack ($29 one-time: https://eiran.gumroad.com/l/eiosatl), or you can check/re-run locally with our $19 CLI (https://citeready.eiran.tech)?

Congrats on building IdeaProof!
```

---

### 3. `promptstoproduct.com` — Skor **74/100** (Paling Empuk #2)
**Temuan Nyata:** `/llms.txt` 404, `/llms-full.txt` 404, tidak ada `<main>/<article>`, tidak ada `FAQPage` JSON-LD, dan baris `Sitemap:` di `robots.txt` terduplikasi 3 kali.

```text
Subject: Quick GEO check for promptstoproduct.com (74/100)

Hi PromptsToProduct team,

Ran a 36-check AI Search & SEO scan on promptstoproduct.com (74/100) and noticed a few quick technical gaps:
- /llms.txt and /llms-full.txt return 404
- Missing <main>/<article> landmarks and FAQPage JSON-LD
- robots.txt repeats the same 3 Sitemap lines three times and lacks explicit OAI-SearchBot / PerplexityBot / ClaudeBot rules

I already generated a clean robots.txt, llmstxt.org-compliant llms.txt + llms-full.txt, FAQPage JSON-LD, and full HTML report for promptstoproduct.com. Happy to send the reviewed fix pack ready to drop into your site ($29 one-time: https://eiran.gumroad.com/l/eiosatl) or grab the zero-dependency CLI ($19: https://citeready.eiran.tech).

Cheers,
CiteReady
```

---

### 4. `indiewait.com` — Skor **78/100** (Paling Empuk #3)
**Temuan Nyata:** `/llms.txt` 404, `/llms-full.txt` 404, tidak ada `FAQPage` JSON-LD, tidak ada aturan eksplisit untuk bot pencarian AI di `robots.txt`.

```text
Subject: Quick AI Search heads-up for indiewait.com (78/100)

Hi IndieWait founder,

Liked how lean indiewait.com is — ran a 36-check AI Search (GEO) scan on it (78/100) and spotted 3 quick gaps:
- /llms.txt and /llms-full.txt currently return 404
- Missing FAQPage JSON-LD schema
- robots.txt doesn't explicitly declare AI search crawlers (OAI-SearchBot, PerplexityBot, ClaudeBot)

Since you're targeting founders searching ChatGPT/Perplexity for waitlist tools, dropping in llms.txt + FAQPage JSON-LD is an easy win. I already generated the custom 6-file fix pack + HTML audit report for indiewait.com ($29 one-time: https://eiran.gumroad.com/l/eiosatl, or $19 for the CLI: https://citeready.eiran.tech).

Best of luck with IndieWait!
```

---

### 5. `tldl.io` — Skor **86/100**
**Temuan Nyata:** Sudah punya `/llms.txt` (2.608 karakter), TAPI gagal validasi resmi `llmstxt.org` (tidak ada daftar link markdown `- [Title](url)` di bawah H2), `/llms-full.txt` 404, tanpa `FAQPage` JSON-LD, dan `og:type` kosong.

```text
Subject: Quick heads-up on tldl.io's /llms.txt format

Hi TLDL team,

Saw you already published /llms.txt on tldl.io — quick technical heads-up from running an llmstxt.org spec check:
- Your /llms.txt currently has 0 standard markdown links (`- [Page](url)`) under H2 sections, so strict llmstxt parsers skip the page index
- /llms-full.txt returns 404, and the homepage is missing FAQPage JSON-LD and og:type

You can test the format free in our browser llms.txt validator at https://citeready.eiran.tech/#interactive-scanner — or if you'd like the full 36-check CLI + auto-fix kit for CI ($19 one-time), it's at https://eiran.gumroad.com/l/shubyl.

Cheers,
CiteReady
```

---

## Batch B — Top 3 Boutique Next.js & Web Agencies (Target \$49 Agency Ship Pack — Margin Tertinggi!)

### 6. `designspark.studio` — Skor **90/100** (TEMUAN PALING MENOHOK UNTUK AGENSI!)
**Temuan Nyata:** **`og:image` (`https://designspark.studio/og-image.png`) mengembalikan HTTP 404!!** + `/llms.txt` gagal validasi markdown link `llmstxt.org` + tidak ada aturan AI crawler eksplisit.

```text
Subject: Quick heads-up: designspark.studio's og:image returns 404

Hi DesignSpark Studio team,

Quick technical heads-up from a pre-launch QA scan on designspark.studio:
1. Your homepage og:image (`https://designspark.studio/og-image.png`) is currently returning HTTP 404 (so link previews break on Slack/X/LinkedIn)
2. Your /llms.txt is missing standard `- [Title](url)` markdown links under H2 sections per llmstxt.org

Also, since you ship Next.js client sites, I built a zero-dependency Node CLI + white-label HTML/PDF audit reporter (`--brand "DesignSpark Studio"`) that catches broken OG images, AI crawler blocks, JSON-LD errors, and llms.txt issues before deploy — $19 one-time (or $49 Agency Pack with a full DFY setup: https://eiran.gumroad.com/l/ycusnw).

Free browser checker & sample report: https://citeready.eiran.tech

Best,
CiteReady
```

---

### 7. `madebyevoke.com` — Skor **83/100** (Web Design Studio)
**Temuan Nyata:** **0 tag `<h1>` di homepage** (heading pertama langsung `<h2>`), **`og:image` hilang total**, meta description kepanjangan (252 karakter), `/llms-full.txt` 404, tanpa `FAQPage` JSON-LD.

```text
Subject: Quick QA heads-up for madebyevoke.com (0 <h1> + missing og:image)

Hi Evoke Studio team,

Noticed you already have a solid /llms.txt on madebyevoke.com — quick heads-up on 3 things our automated pre-launch scanner flagged on the homepage (83/100):
- 0 <h1> tags detected (heading hierarchy starts at <h2>)
- Missing og:image meta tag completely
- Meta description is 252 chars (gets truncated in search/AI snippets), plus missing /llms-full.txt and FAQPage JSON-LD

Since you deliver client web builds, you might find our zero-dependency CLI useful as a pre-deploy QA gate + white-label client PDF report (`--brand "Evoke Studio"`). Sample report + free browser tools at https://citeready.eiran.tech (Agency Pack with full DFY fix + CLI is $49 one-time: https://eiran.gumroad.com/l/ycusnw).

Best,
CiteReady
```

---

### 8. `dixi.agency` — Skor **91/100** (Product Design Studio)
**Temuan Nyata:** **97 dari 133 gambar di homepage (73%!) tidak punya `alt` attribute** (hanya 36/133 = 27%), payload HTML awal 418,7 KB, `/llms-full.txt` 404.

```text
Subject: Quick pre-launch QA note for dixi.agency (97 images missing alt)

Hi Dixi Agency team,

Quick heads-up from running an automated accessibility + AI Search check on dixi.agency:
- 97 of 133 homepage images are missing `alt` attributes (27% coverage)
- Initial HTML payload is 418.7 KB and /llms-full.txt returns 404

I built CiteReady as a zero-dependency Node CLI for small studios to catch these exact issues in CI (`--dir ./dist --min-score 85`) and export white-label HTML/PDF client QA reports (`--brand "Dixi Agency"`). No monthly fee — $19 Pro CLI or $49 Agency Pack at https://citeready.eiran.tech.

Cheers,
CiteReady
```

---

## Batch C — 2 Direktori Indie (Double Win: Bantu Audit + Submit CiteReady ke Direktori Mereka!)

### 9. `indietool.io` — Skor **86/100**
**Temuan Nyata:** `/llms.txt` tidak punya link markdown `- [Title](url)` di bawah H2, meta description 183 karakter, 11/74 gambar tanpa `alt`, payload HTML 280,7 KB.

```text
Subject: Submitting CiteReady + quick /llms.txt heads-up for indietool.io

Hi IndieTool founder,

Submitted CiteReady (https://citeready.eiran.tech) to IndieTool — quick bonus heads-up from running our scanner on indietool.io (86/100):
- Your /llms.txt is missing standard `- [Title](url)` markdown links under H2 sections (per llmstxt.org)
- 11 of 74 homepage images are missing `alt` tags, and meta description is 183 chars

Happy to send over the full 36-check HTML audit report for indietool.io free if helpful — thanks for building IndieTool!
```

---

### 10. `betterlaunch.co` — Skor **87/100**
**Temuan Nyata:** Payload HTML awal sangat berat (**1.982,2 KB / ~2 MB!**), `/llms-full.txt` 404, tanpa `og:url`, tanpa `FAQPage` JSON-LD.

```text
Subject: Submitting CiteReady + quick performance/GEO note for betterlaunch.co

Hi BetterLaunch founder,

Just submitting CiteReady (https://citeready.eiran.tech) to BetterLaunch — while checking the site, our scanner noticed your homepage initial HTML payload is ~1.98 MB (1,982 KB), plus missing `og:url`, `/llms-full.txt`, and `FAQPage` JSON-LD.

Happy to share the full 36-check HTML audit report for betterlaunch.co free as a thank-you for running the directory!
```
