# Day 1–2 Discovery & Business Plan: CiteReady

**Challenge:** The 30 Days AI Agent Make Money Challenge  
**Start Date:** 2026-11-19 (Day 1)  
**Target:** Minimum $1 USD first sale; Ambitious Target $100+ USD within 30 days  
**Capital Invested:** $0 USD  

---

## 1. Market Research & Validation Summary

### A. Payment Infrastructure (Indonesia Creator -> Global USD Payouts)
Based on current 2025–2026 Merchant of Record (MoR) data for solo software/digital builders in Indonesia:
- **Lemon Squeezy:** **Avoided** — winding down payment processing by March 31, 2027, with merchant transition underway.
- **Polar.sh (Primary MoR Choice):** Acts as a full Merchant of Record handling global VAT/sales tax compliance, supports digital downloads, license keys, and service products, charges **5% + $0.50** (+1.5% international cards) on a **$0/month Starter tier**, and pays out directly to Indonesia via **Stripe Connect Express** (no local Stripe merchant entity required).
- **Gumroad (Secondary Discovery Channel):** Built-in marketplace (`Gumroad Discover`) at **10% + $0.50** direct (30% via Discover), paying internationally via PayPal or USD virtual routing.

### B. Demand & Pricing Benchmarks (Why This Opportunity Wins)
1. **GEO / AI Search Visibility Tools Are Priced Monthly ($19–$250/mo):**
   - Otterly.AI starts at **$29/mo**; Peak Answer and LLM Pulse start around **$49/mo**; Xicmo Lite GEO Agent starts at **$49/mo**; fuller optimization suites run **$95–$250+/mo**.
   - Most solo founders, indie hackers, and freelancers suffer **subscription fatigue** and actively prefer **$19–$49 one-time utilities** or **$29–$49 async productized audits** over recurring retainers.
2. **Urgent Technical Gap at Launch:**
   - Sites launched via AI coding tools routinely ship without `/llms.txt` (`llmstxt.org` spec: H1 + blockquote + H2 markdown links), accidentally block `OAI-SearchBot` / `PerplexityBot` / `ClaudeBot` in `robots.txt`, lack valid JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`), or fail `og:image` / canonical checks.
   - Generic monitoring tools show vanity scores ("62/100") without generating the actual files needed to fix the site.

---

## 2. Ten Researched Business Opportunities & Comparison Matrix

Scored 1–5 (higher = better for 30-day $0-capital autonomous challenge):

| # | Business Opportunity | Demand | Low Comp. | Margin | Speed (<48h) | Autonomous Build | 30-Day Rev Prob. | Total /30 |
|---|---|---|---|---|---|---|---|---|
| 1 | **CiteReady: GEO + Launch-Readiness Fix CLI ($19) & DFY Fix Pack ($29/$49)** | **5** | **4** | **5** | **5** | **5** | **5** | **29** |
| 2 | Local Browser Bank CSV-to-QBO / Statement Cleaner ($19 one-time) | 4 | 3 | 5 | 4 | 4 | 4 | 24 |
| 3 | Productized Landing Page CRO Audit ($29–$49 async) | 4 | 2 | 5 | 4 | 4 | 4 | 23 |
| 4 | Niche n8n Lead-Enrichment Workflow Pack ($29–$49) | 4 | 2 | 5 | 4 | 3 | 4 | 22 |
| 5 | Cursor / Claude Code `.cursorrules` + `CLAUDE.md` Kit ($19) | 4 | 2 | 5 | 5 | 4 | 3 | 23 |
| 6 | Technical SEO Broken Link & Canonical Audit Sheet ($49) | 3 | 3 | 5 | 4 | 4 | 3 | 22 |
| 7 | Next.js + Polar/Stripe SaaS Boilerplate ($99–$149) | 4 | 1 | 5 | 2 | 4 | 2 | 18 |
| 8 | Local-First Freelancer Invoice CLI / Desktop Pack ($19) | 3 | 3 | 5 | 3 | 4 | 3 | 21 |
| 9 | Niche Notion Freelancer / Agency Operating System ($29–$49) | 3 | 1 | 5 | 3 | 3 | 3 | 18 |
| 10 | Curated B2B Micro-Influencer / VC Contact Database ($29) | 3 | 3 | 4 | 2 | 2 | 3 | 17 |

**Selected Winner:** **#1 — CiteReady** (`29/30`).  
Why: Zero API costs, deterministic Node.js 18+ CLI engine already built on Day 1, clear ROI vs $29–$49/mo SaaS competitors, dual revenue model (self-serve $19 digital download + $29/$49 async productized service), and immediate distribution via indie launch communities (`r/SideProject`, `r/SaaS`, `r/SEO`, Show HN, Product Hunt) plus 1-on-1 value-first mini-audits.

---

## 3. Target Customers (ICPs)

1. **Solo Indie Hackers & SaaS Founders (Pre-Launch / Post-Launch):**
   - Just shipped a web app / landing page (`Next.js`, `Astro`, `Vite`, HTML) and want ChatGPT/Perplexity/Claude to cite them without paying $49/month.
   - Natural buyer for **$19 Pro CLI** or **$29 Done-For-You Fix Pack**.
2. **Freelance Web Developers & Boutique Agencies:**
   - Deliver client websites and need repeatable pre-launch QA + white-label client deliverable reports (`--brand "Agency Name"`).
   - Natural buyer for **$49 Agency Ship Pack**.

---

## 4. Pricing & Unit Economics

| Tier | Price (USD) | Delivery | Est. Polar Net (~95% - $0.50) | Sales Needed for $100 Gross |
|---|---|---|---|---|
| **Free Lite CLI** | $0 | Instant ZIP (`citeready-free-v1.0.0.zip`) | $0 (Top-of-funnel lead gen) | — |
| **Pro CLI & Auto-Fix Kit** | **$19** | Instant ZIP (`citeready-pro-v1.0.0.zip`) | ~$17.55 | 6 sales ($114 gross) |
| **Done-For-You GEO Fix Pack** | **$29** | 24h async report + 6 custom files | ~$27.05 | 4 sales ($116 gross) |
| **Agency Ship Pack** | **$49** | Pro CLI + 1 custom DFY setup | ~$46.05 | 3 sales ($147 gross) |

*Target Mix to Hit $100+:* **2x $49 ($98) + 1x $19 ($19) = $117 USD**, or **4x $29 = $116 USD**, or **6x $19 = $114 USD**.

---

## 5. 30-Day Execution Roadmap

- **Days 1–2 (Discovery + MVP Build):** Complete market validation, build zero-dependency CLI engine (`src/` + `bin/`), build offline test suite, launch-ready site (`site/`), deterministic ZIPs (`dist/`), and launch kit (`marketing/`). *(Completed Day 1)*
- **Days 3–7 (Storefront & Live Deployment — Human Approval Gates):**
  - Human deploys `site/` to free static host (Cloudflare Pages / Vercel / Netlify / GitHub Pages).
  - Human creates Polar.sh (+ optional Gumroad) checkout links & updates `site/config.js`.
  - Publish Free Lite release & sample report publicly.
- **Days 8–14 (Launch & Initial Distribution):**
  - Publish Show HN, `r/SideProject`, `r/SaaS`, `r/SEO`, Dev.to technical breakdown, and Product Hunt launch.
  - Perform targeted 1-on-1 value-first mini-audits for founders actively asking for landing page / SEO / launch feedback (strictly manual, zero mass spam).
- **Days 15–21 (Close First Transactions & Iterate):**
  - Convert Free Lite users & DFY mini-audit recipients into first $19/$29/$49 USD sales.
  - Refine copy, sample report proof, and checkout friction based on real objections.
- **Days 22–30 (Scale Winning Channel to $100+):**
  - Double down on whichever tier converts fastest ($19 CLI vs $29 DFY vs $49 Agency).
  - Document final verifiable transaction receipts and lessons learned.

---

## 6. 7-Day Failure & Pivot Triggers

If **0 sales and <5 qualified inquiries** occur by Day 14 (or 7 days post-launch):
1. **Inspect bottleneck:** Are visitors clicking the interactive demo / Lite download but abandoning checkout? -> Adjust price test ($9–$15 intro CLI or $19 DFY Starter) or strengthen sample before/after proof.
2. **Channel pivot:** If Reddit/HN launch stalls, shift directly to 1-on-1 outreach to recently launched SaaS/Show HN/Product Hunt sites that literally have broken `robots.txt` / missing `llms.txt` / missing `og:image`, sending them their real free 1-page CiteReady report summary first.
3. **Offer pivot:** If CLI sells slower than service, lead strictly with **"I fixed your llms.txt + robots.txt + JSON-LD — $29 to grab the ready-to-drop PR/ZIP"**.
