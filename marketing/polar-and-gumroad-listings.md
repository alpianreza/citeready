# Polar.sh (Primary) & Gumroad (Secondary) Product Setup Guide

Use **Polar.sh** as the primary Merchant of Record (native Indonesia payouts via Stripe Connect Express, **5% + $0.50** fee on Starter $0/mo plan, automated global tax compliance). Optionally mirror listings on **Gumroad** for marketplace Discover traffic.

---

## Step-by-Step Polar.sh Setup Checklist (Human Action Required)

1. Go to `https://polar.sh` and create an organization (`CiteReady`).
2. Complete **Stripe Connect Express** payout onboarding for Indonesia under Organization Settings -> Payouts.
3. Create the **3 One-Time Products** below and copy their Checkout Link URLs into `site/config.js`.

---

## Product 1: CiteReady Pro CLI & Auto-Fix Kit ($19 One-Time)

- **Name:** `CiteReady Pro CLI & Auto-Fix Kit (v1.0.0)`
- **Pricing Type:** One-time purchase — **$19.00 USD**
- **Digital File Benefit:** Upload `dist/citeready-pro-v1.0.0.zip`
- **Short Summary:**
  > Make ChatGPT, Perplexity & Claude cite your site—without paying $49/month. Zero-dependency Node.js 18+ CLI that audits 36 GEO, llms.txt, AI crawler robots.txt, JSON-LD, Open Graph, and SEO checks, then auto-generates 6 drop-in fix files and a white-label HTML/PDF report.

- **Full Description (Copy-Paste):**
```markdown
Stop paying $29–$49/month for passive AI visibility trackers that never fix your code.

**CiteReady Pro** is a zero-dependency Node.js 18+ CLI & auto-fix generator you run locally or in GitHub Actions—and own forever for a single $19 payment.

### What You Get Inside `citeready-pro-v1.0.0.zip`
- **36-Check Weighted Audit Engine (100 pts):**
  - AI Search & GEO (30 pts): `llms.txt` (`llmstxt.org` spec), `llms-full.txt`, opening summary, semantic HTML landmarks, copy depth, Q&A extractability.
  - AI Crawler Policy (20 pts): Evaluates 10 bots including `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `GPTBot`, `Google-Extended`.
  - Structured Data / JSON-LD (15 pts): Validates `Organization`, `WebSite`, `SoftwareApplication`, and `FAQPage` syntax.
  - Technical SEO (15 pts), Social & Open Graph (10 pts), Quality & Signals (10 pts).
- **Auto-Fix Generator (`--fix`) Writes 6 Ready-to-Drop Files:**
  1. `llms.txt` (strict `llmstxt.org` spec)
  2. `llms-full.txt` (multi-page Markdown context)
  3. `robots.txt` (preserves safe rules + opens AI search bots)
  4. `jsonld-snippets.html` (validated `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`)
  5. `head-meta-patch.html` (SEO, Canonical, Open Graph, Twitter Card)
  6. `nextjs-metadata.ts` (Next.js App Router `Metadata` export)
- **White-Label Report (`--brand "Your Studio"`):** Standalone HTML & Print-to-PDF client report with interactive fix preview tabs.
- **CI Score Gate (`.github/workflows/citeready-gate.yml`):** Fail PR builds automatically if your static build drops below `--min-score 85`.

### Requirements
Node.js 18+ (zero `npm install` needed, zero external runtime dependencies, zero API keys).
```

---

## Product 2: Done-For-You GEO & Launch-Readiness Fix Pack ($29 One-Time)

- **Name:** `CiteReady Done-For-You GEO Fix Pack`
- **Pricing Type:** One-time purchase — **$29.00 USD**
- **Custom Checkout Fields (Enable in Polar Checkout):**
  1. `Target Website URL` (Required, Text)
  2. `Tech Stack / Framework` (e.g., Next.js, Astro, Vite, WordPress, Plain HTML)
  3. `Delivery Email` (if different from receipt email)
- **Description (Copy-Paste):**
```markdown
Don't want to run a CLI yourself? Send us your live URL and get a complete, ready-to-drop AI Search & Launch-Readiness Fix Pack within 24 hours.

### Included in Your 24h Delivery ZIP
- Full **36-check audit** across up to 25 pages of your site
- Custom-tuned **`llms.txt`** & **`llms-full.txt`** compliant with `llmstxt.org`
- Clean **`robots.txt`** allowing AI search & citation crawlers (`OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`) without breaking your existing rules
- Validated **JSON-LD schemas** (`Organization`, `WebSite`/`SoftwareApplication`, `FAQPage`)
- Copy-paste **`<head>` meta + Open Graph + Twitter patch** (plus Next.js `Metadata` snippet if requested)
- Standalone **HTML & Print-PDF audit report** showing exact before/after fixes
```

---

## Product 3: Agency Ship Pack ($49 One-Time)

- **Name:** `CiteReady Agency Ship Pack (Pro CLI + 1 Done-For-You Site Setup)`
- **Pricing Type:** One-time purchase — **$49.00 USD**
- **Digital File Benefit:** Upload `dist/citeready-pro-v1.0.0.zip`
- **Custom Checkout Fields:**
  1. `Flagship Site URL for DFY Setup` (Required, Text)
  2. `Agency / Studio Brand Name for White-Label Reports` (Optional, Text)
  3. `Tech Stack / Framework` (Optional, Text)
- **Description (Copy-Paste):**
```markdown
Everything in **CiteReady Pro CLI** (unlimited local audits + white-label client reporting) PLUS **1 complete Done-For-You GEO Fix Pack** prepared for your flagship domain or client launch within 24 hours.

Ideal for indie agencies, freelance web developers, and studios shipping multiple client sites per month.
```

---

## Optional Free Lead Magnet Product ($0 / Pay-What-You-Want on Gumroad or Direct)

- **Name:** `CiteReady Lite — AI Search & Launch Auditor ($0)`
- **File:** `dist/citeready-free-v1.0.0.zip`
- **Usage:** Drives organic GitHub/Gumroad discovery traffic into the $19 Pro CLI and $29 DFY upgrades.

---

## Final Step After Creating Checkout Links
Open `site/config.js` and paste your 3 live Polar.sh checkout URLs into:
```js
window.CITEREADY_CONFIG = {
  brandName: 'CiteReady',
  proCli: 'https://buy.polar.sh/YOUR_PRO_LINK',
  dfyStarter: 'https://buy.polar.sh/YOUR_DFY_LINK',
  agencyShip: 'https://buy.polar.sh/YOUR_AGENCY_LINK',
  freeCli: '#free-lite',
  contactEmail: 'hello@citeready.dev',
};
```
