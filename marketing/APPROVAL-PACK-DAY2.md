# Paket Persetujuan Peluncuran Day 2 (Siap-Klik untuk Bos)

**Status:** **DRAFT — BELUM DIPOSTING.** Menunggu persetujuan eksplisit Bos per kanal (sesuai Section 6 & koordinasi Eiran).  
**Situs Live:** https://citeready.eiran.tech  
**Demo Laporan Asli:** https://citeready.eiran.tech/sample-report.html  
**Checkout Gumroad Resmi:**
- Pro CLI & Auto-Fix Kit (\$19): https://eiran.gumroad.com/l/shubyl
- Done-For-You GEO Fix Pack (\$29): https://eiran.gumroad.com/l/eiosatl
- Agency Ship Pack (\$49): https://eiran.gumroad.com/l/ycusnw

> **Cara Menyetujui:** Balas di chat dengan format singkat, misal:  
> `"Setuju posting X + r/SideProject + r/SEO + Show HN + IndieHackers"` atau sebutkan kanal mana saja yang disetujui/perlu revisi.

---

## Checklist Persetujuan Kanal

- [ ] **Kanal 1 — X (Twitter) Thread**
- [ ] **Kanal 2 — Reddit `r/SideProject`**
- [ ] **Kanal 3 — Reddit `r/SEO`**
- [ ] **Kanal 4 — Show HN (Hacker News)**
- [ ] **Kanal 5 — IndieHackers**
- [ ] **Kanal 6 — Outreach 1-on-1 Value-First (hanya setelah audit skor nyata dijalankan per domain, maksimal 15–20 situs/hari, NO mass spam)**

---

## Kanal 1: X (Twitter) — Thread 4 Post

**Post 1 (Hook):**
```text
Most "AI Search / GEO" tools charge $29–$49/month just to monitor whether ChatGPT mentions you.

Meanwhile, most indie SaaS sites fail the actual technical basics:
- Missing /llms.txt (llmstxt.org spec)
- robots.txt blocking OAI-SearchBot or PerplexityBot
- Missing/broken JSON-LD
- Broken og:image

So I built a zero-dependency Node.js CLI that audits 36 checks and generates all 6 fix files locally. 🧵
```

**Post 2 (What it does):**
```text
One command against any live URL or local ./dist build:

node bin/citeready.mjs https://yourapp.com --fix --min-score 85

It audits:
- /llms.txt + /llms-full.txt
- 10 AI crawlers in robots.txt (separating search/citation bots from training bots)
- Organization / Product / FAQPage JSON-LD
- Technical SEO & live HTTP 200 og:image checks
```

**Post 3 (What it outputs):**
```text
Instead of giving you a passive "62/100" dashboard, CiteReady writes 6 ready-to-drop files:
1. llms.txt
2. llms-full.txt
3. robots.txt
4. jsonld-snippets.html
5. head-meta-patch.html
6. nextjs-metadata.ts

+ a standalone white-label HTML/PDF report you can hand directly to clients.
```

**Post 4 (CTA — honest, zero hype):**
```text
No $49/month subscription. No API keys. Zero npm dependencies.

- Try the free in-browser HTML scanner: https://citeready.eiran.tech
- Inspect a real generated report: https://citeready.eiran.tech/sample-report.html
- Pro CLI ($19 one-time) / Done-For-You Fix Pack ($29): https://citeready.eiran.tech/#pricing

Drop your site URL in the replies if you want a quick AI crawler + GEO breakdown.
```

---

## Kanal 2: Reddit — `r/SideProject`

**Title:** `I built a zero-dependency Node CLI that audits why ChatGPT/Perplexity ignore your site (and generates the 6 fix files)`

**Body:**
```markdown
I got tired of seeing AI Search / GEO SaaS tools charge $29–$49/month just to tell you a score, without fixing anything in your repo.

So I built **CiteReady** — a zero-dependency Node.js 18+ CLI (zero npm packages, zero LLM API keys) that runs 36 weighted checks across 6 areas:

1. **AI Search & GEO (30 pts):** `/llms.txt` validated against the official `llmstxt.org` structure (`# H1` -> `> blockquote` -> `## Section` markdown links), `/llms-full.txt`, semantic `<main>/<article>` landmarks, and extractable FAQ markup.
2. **AI Crawler Policy (20 pts):** `robots.txt` longest-prefix rule evaluation across 10 AI bots — separating search/citation bots (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`) from training bots (`GPTBot`, `Google-Extended`, etc.).
3. **Structured Data (15 pts):** Parses every `application/ld+json` script block and checks `Organization`, `WebSite`/`SoftwareApplication`, and `FAQPage`.
4. **Technical SEO (15 pts):** Title/meta lengths, single `<h1>` + heading order, canonical, `<html lang>`, XML sitemap, `noindex` guard.
5. **Social & Open Graph (10 pts):** OG/Twitter tags + real HTTP 200 verification on `og:image`.
6. **Quality & Signals (10 pts):** HTTPS canonical, viewport, favicon, image `alt` coverage, HTML payload weight.

Then `--fix` outputs 6 drop-in files (`llms.txt`, `llms-full.txt`, `robots.txt`, `jsonld-snippets.html`, `head-meta-patch.html`, `nextjs-metadata.ts`) plus a standalone print-to-PDF HTML report. It also runs against local static build folders (`--dir ./dist --min-score 85`) for GitHub Actions CI gates.

You can test raw HTML right in the browser (client-side only, nothing uploaded) or inspect a full generated sample report here:
- Site + Browser Scanner: https://citeready.eiran.tech
- Sample Generated Report: https://citeready.eiran.tech/sample-report.html

Pricing is one-time ($19 Pro CLI or $29 Done-For-You fix pack), no recurring subscription.

Would love critical feedback on the 36-check rubric—especially if there are AI crawlers or `llms.txt` edge cases I missed. Happy to run an audit on anyone's project URL in the comments!
```

---

## Kanal 3: Reddit — `r/SEO`

**Title:** `Built a free in-browser HTML checker + local CLI to catch AI crawler blocks (OAI-SearchBot, PerplexityBot, ClaudeBot), llms.txt & JSON-LD issues before deploy`

**Body:**
```markdown
Sharing a small technical tool I built after repeatedly seeing sites fail basic AI-retrieval hygiene while paying $30–$50/mo for prompt-tracking tools.

Common technical regressions we kept seeing on fresh launches and client handoffs:
- Legacy `robots.txt` blocks accidentally disallowing `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, or `ClaudeBot` (instead of selectively controlling training bots like `GPTBot`).
- Missing or malformed `/llms.txt` (e.g., skipping the H1/blockquote order in the `llmstxt.org` spec).
- Invalid JSON-LD syntax or missing `Organization` / `FAQPage` entities.
- `og:image` tags pointing to 404 assets or missing canonicals.

I built **CiteReady** (`https://citeready.eiran.tech`) as a zero-dependency Node.js 18+ CLI so you can run all 36 checks locally against a live URL or pre-deploy static directory (`--dir ./dist --min-score 85` in CI).

There is an instant client-side HTML checker right on the page (no signup, runs in browser memory) and a sample standalone white-label HTML/PDF report here: https://citeready.eiran.tech/sample-report.html

*(Full transparency: the Pro CLI with auto-fix file generation is a $19 one-time kit and there is a $29 done-for-you option, no monthly plan.)*

Curious what technical SEO / GEO checks agencies here consider mandatory in a pre-launch CI gate?
```

---

## Kanal 4: Show HN (Hacker News)

**Title:** `Show HN: CiteReady – Zero-dependency CLI to audit llms.txt, AI bots, and JSON-LD`

**URL:** `https://citeready.eiran.tech`

**First Comment (Maker Note):**
```text
Hi HN,

I built CiteReady, a zero-dependency Node.js 18+ CLI that audits websites across 36 weighted checks for AI search readiness (GEO), robots.txt AI crawler policies, JSON-LD structured data, and technical SEO/OG basics—and generates the missing config files locally.

Technical highlights:
- Zero runtime npm dependencies (native Node 18+ fetch + custom HTML/meta/JSON-LD extractor + RFC-style longest-prefix robots.txt matcher).
- Strict llmstxt.org validator (H1 -> blockquote -> optional plain text without premature headings -> H2 markdown link sections).
- Separates AI search/citation crawlers (OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot) from training crawlers (GPTBot, Google-Extended, Applebot-Extended, Meta-ExternalAgent, Amazonbot, anthropic-ai).
- Works in live HTTP mode or offline static directory mode (`--dir ./dist --url https://example.com --min-score 85`) for CI gates.

Sample generated HTML report (from a synthetic broken SaaS fixture): https://citeready.eiran.tech/sample-report.html

It's sold as a one-time $19 CLI kit (or $29 done-for-you fix pack) instead of a $29–$49/mo monitoring SaaS. Would appreciate technical feedback on the robots.txt matcher, llmstxt.org edge cases, or checks you'd add/re-weight.
```

---

## Kanal 5: IndieHackers

**Title:** `Launching CiteReady: One-time $19 CLI & $29 Fix Pack to make AI search cite your SaaS (instead of $49/mo trackers)`

**Body:**
```markdown
Hey Indie Hackers!

I just shipped **CiteReady** (`https://citeready.eiran.tech`) as a fast, zero-subscription alternative to $29–$49/month GEO tracking SaaS tools.

**The problem:** Indie founders ship fast with Next.js/Astro/HTML, but often miss `/llms.txt`, accidentally block `OAI-SearchBot`/`PerplexityBot` in `robots.txt`, forget `Organization`/`SoftwareApplication`/`FAQPage` JSON-LD, or ship a broken `og:image`.

**What CiteReady does:**
- Audits **36 real checks** across 6 pillars in seconds (zero npm deps, zero API keys).
- Auto-generates **6 drop-in files** (`llms.txt`, `llms-full.txt`, `robots.txt`, JSON-LD snippets, `<head>` meta patch, `nextjs-metadata.ts`) + a white-label HTML/PDF report.
- Runs on live sites OR local build folders (`--dir ./dist --min-score 85` in GitHub Actions).

**Pricing (one-time):**
- Pro CLI & Auto-Fix Kit: **$19**
- Done-For-You Fix Pack (24h async delivery): **$29**
- Agency Ship Pack (Pro CLI + 1 DFY site): **$49**

Try the interactive browser scanner (no signup) or check the sample report at https://citeready.eiran.tech.

Drop your launch URL below if you want me to share your AI crawler + GEO score!
```

---

## Kanal 6: Contoh Pesan Outreach 1-on-1 (Hanya Berbasis Skor Audit Nyata)

> **Aturan Ketat:** Hanya dipakai setelah `node scripts/batch-prospect-audit.mjs` atau `citeready` menghasilkan skor & temuan nyata pada domain target. Maksimal 15–20 target terseleksi per hari, tanpa spam massal.

**Contoh A — Komentar Publik di Thread Feedback (Reddit / IH / HN):**
```text
Congrats on launching [ProductName]! Really liked [1 detail nyata dari produk mereka].

Ran a quick automated pre-launch AI Search & SEO check on [Domain] ([Score]/100) and spotted 3 quick wins you can fix in 10 minutes:
1. [Temuan nyata #1, misal: /llms.txt returns 404]
2. [Temuan nyata #2, misal: robots.txt has no Sitemap line or explicit OAI-SearchBot/PerplexityBot allow]
3. [Temuan nyata #3, misal: Missing Organization / SoftwareApplication JSON-LD]

Here's a clean robots.txt block you can paste right away:
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
Sitemap: https://[Domain]/sitemap.xml

If useful, I also built a small CLI that generates all 6 fix files + an HTML report locally (https://citeready.eiran.tech). Best of luck with the launch!
```

**Contoh B — DM / Email 1-on-1 Singkat:**
```text
Subject: Quick AI Search & Launch check for [ProductName] ([Score]/100)

Hi [Name],

Saw [ProductName] launch on [Platform] — [1 kalimat spesifik & jujur tentang produknya].

I ran a 36-check technical AI Search & launch audit on [Domain]. It scored [Score]/100 with [CriticalCount] critical blockers (notably: [RealFinding1] and [RealFinding2]).

I already generated the ready-to-drop fix bundle (llmstxt.org compliant llms.txt, robots.txt, validated JSON-LD, meta patch, and standalone HTML report). Happy to share the top findings free — or if you want the complete reviewed Fix Pack ready to paste into your repo, it's $29 one-time here: https://eiran.gumroad.com/l/eiosatl (or $19 for the CLI itself: https://eiran.gumroad.com/l/shubyl).

Either way, congrats on shipping!
```
