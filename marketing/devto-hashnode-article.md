# Ready-to-Publish Technical Article (Dev.to / Hashnode / Medium)

> **Status:** DRAFT — Publish only after explicit Bos approval.  
> **Target Platforms:** Dev.to (`tags: webdev, seo, ai, javascript`) & Hashnode  
> **Canonical URL:** Optional (`https://citeready.eiran.tech`)

---

**Title:** Why ChatGPT & Perplexity Ignore Newly Launched SaaS Sites — And the 6 Files That Fix It

**Subtitle:** A zero-bloat technical checklist for `robots.txt` AI crawlers, `llmstxt.org`, JSON-LD, and pre-deploy CI gates.

---

Every week, hundreds of indie SaaS apps and developer tools launch with crisp Tailwind designs and fast Next.js or Astro builds—yet remain completely invisible when users ask ChatGPT, Perplexity, or Claude for recommendations in their category.

The common assumption is that you need a \$49/month "AI visibility tracker" to fix this. In practice, monitoring dashboards only tell you *whether* an LLM mentioned you. Before paying for monitoring, most fresh launches fail basic technical retrieval checks that take 10 minutes to fix directly in your repository.

Here are the 4 most frequent technical blockers and the exact 6 files that eliminate them.

---

## 1. Accidentally Blocking AI Search Bots in `robots.txt`

Many boilerplates and WAF templates copied legacy "block all AI scrapers" snippets in 2024–2025. The problem in 2026 is that **AI search/citation bots are now separate from model-training bots**:

- **AI Search & Live Citation Bots (you generally want `Allow: /`):**
  - `OAI-SearchBot` (ChatGPT Search citations)
  - `ChatGPT-User` (live retrieval when a user asks ChatGPT to check your page)
  - `PerplexityBot` (Perplexity search & citations)
  - `ClaudeBot` (Anthropic retrieval)
- **Model Training Bots (opt in or out independently):**
  - `GPTBot`, `Google-Extended`, `Applebot-Extended`, `Meta-ExternalAgent`, `anthropic-ai`, `Amazonbot`

A clean, explicit `robots.txt` lets you keep search citations open even if you prefer to disallow training crawlers:

```txt
User-agent: *
Allow: /

# Allow AI Search & Citation Crawlers
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# Optional: Disallow training-only crawlers if desired
User-agent: GPTBot
Disallow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

*(You can paste your current `robots.txt` into the free client-side [robots.txt AI Bot Checker](https://citeready.eiran.tech/#interactive-scanner) to see all 10 bots evaluated locally with zero upload.)*

---

## 2. Shipping Without a Valid `/llms.txt` (`llmstxt.org` Spec)

Even when bots can crawl your HTML, modern landing pages wrap product facts inside nested `<div>` grids, client-side modals, and marketing slogans.

The official [`llmstxt.org`](https://llmstxt.org) convention gives AI agents a single clean Markdown index at `/llms.txt` in a strict section order:

1. **H1 (`# Product Name`)** — required first line.
2. **Blockquote (`> 1–2 sentence factual summary`)** — immediately after the H1.
3. **Optional plain context** — paragraphs or bullet points, **never** premature H3+ headings before link sections.
4. **H2 (`## Section`) link lists** — `- [Page Title](https://...): concise note`.
5. **`## Optional` section** — lower-priority links an agent can drop under tight context windows.

Minimal valid example:

```markdown
# YourApp

> Lightweight invoice reconciliation utility for solo consultants without monthly accounting software.

## Core Pages
- [Homepage](https://yourapp.com/): Overview, supported bank formats, and pricing.
- [Docs](https://yourapp.com/docs): 5-minute CSV import and setup guide.

## Optional
- [Full Context](https://yourapp.com/llms-full.txt): Single-fetch Markdown digest of key pages.
```

Pairing `/llms.txt` with `/llms-full.txt` (a single consolidated Markdown summary of your homepage, docs, pricing, and FAQs) makes retrieval dramatically cleaner for coding and research agents.

---

## 3. Missing or Broken JSON-LD Structured Data

Unstructured marketing copy makes entity disambiguation hard. Four compact Schema.org JSON-LD blocks inside `<head>` remove ambiguity for both classic search engines and LLM grounding pipelines:

1. `Organization` (brand identity, canonical URL, logo)
2. `WebSite` (site root identity)
3. `SoftwareApplication` or `Product` (category, OS, transparent `offers` price/currency)
4. `FAQPage` (mirroring real visible `<details>/<summary>` FAQs on the page)

Always validate every `<script type="application/ld+json">` block with `JSON.parse` during build—a single trailing comma silently invalidates the entire block.

---

## 4. Broken `og:image`, Missing Canonicals, and No Pre-Deploy CI Gate

The final silent killer right before a Product Hunt, Show HN, or Reddit launch:
- `<meta property="og:image">` pointing to a relative path or returning HTTP 404 (killing click-through rates when your link is shared on X, Slack, or Discord).
- Missing `<link rel="canonical">` or `<html lang="en">`.
- Duplicate `<h1>` tags or missing `<main>` / `<article>` semantic landmarks.

---

## Automating All 36 Checks Locally in CI

Because I got tired of checking these manually on every launch, I built **[CiteReady](https://citeready.eiran.tech)** — a zero-dependency Node.js 18+ CLI (no `npm install`, no LLM API keys) that runs 36 weighted checks across GEO, AI crawlers, JSON-LD, SEO, Open Graph, and HTML quality.

You can run it against a live URL or directly against your static build folder in GitHub Actions before deploying:

```bash
node bin/citeready.mjs --dir ./dist --url https://yourdomain.com --min-score 85
```

- **Free browser tools (no signup):** HTML GEO scanner, 10-bot `robots.txt` checker, and `llms.txt` spec validator at [citeready.eiran.tech](https://citeready.eiran.tech).
- **Free Lite CLI ($0 ZIP):** Runs all 36 checks in your terminal.
- **Pro CLI ($19 one-time):** Multi-page crawl + auto-generates all 6 fix files (`llms.txt`, `llms-full.txt`, `robots.txt`, `jsonld-snippets.html`, `head-meta-patch.html`, `nextjs-metadata.ts`) + standalone white-label HTML/PDF report.

Which AI crawler policy are you using on your projects right now—allowing search bots while blocking training bots, or allowing both?
