# CiteReady

**Make ChatGPT, Perplexity & Claude cite your website — without paying $49/month.**

CiteReady is a **zero-dependency Node.js CLI (Node 18+)** that audits your live site or static build directory across **36 real checks** in 6 weighted pillars:

1. **AI Search & GEO (30 pts)** — `/llms.txt` (`llmstxt.org` spec), `/llms-full.txt`, opening summary extractability, semantic HTML landmarks (`<main>`, `<article>`), indexable content depth, Q&A extractability.
2. **AI Crawler Policy (20 pts)** — `/robots.txt`, `Sitemap:` directive, explicit allow/block status for 10 AI bots (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `GPTBot`, `anthropic-ai`, `Google-Extended`, `Applebot-Extended`, `Meta-ExternalAgent`, `Amazonbot`).
3. **Structured Data / JSON-LD (15 pts)** — valid JSON-LD parsing, `schema.org` context, `Organization`/`Person`, `WebSite`/`SoftwareApplication`/`Product`, and `FAQPage`.
4. **Technical SEO (15 pts)** — `<title>`, `<meta description>`, single `<h1>`, heading hierarchy, canonical link, `<html lang>`, `/sitemap.xml`, `noindex` guard.
5. **Social & Open Graph (10 pts)** — `og:title`, `og:description`, `og:image` (+ reachability/existence verification), `og:url`, `og:type`, `twitter:card`, `twitter:title`.
6. **Quality & Signals (10 pts)** — HTTPS canonical URL, viewport meta, favicon, image `alt` coverage (>=90%), HTML weight (<250 KB), security/caching headers or static-host readiness.

---

## Quick Start

Requires **Node.js 18+** (`npm install` is **not** needed — zero external runtime dependencies).

```bash
# Audit a live website
node bin/citeready.mjs https://example.com

# Audit a local static build folder (Next.js export, Vite dist, Astro, plain HTML)
node bin/citeready.mjs --dir ./dist --url https://example.com

# Generate all 6 drop-in fix files + standalone HTML report
node bin/citeready.mjs https://example.com --fix --out ./citeready-output

# White-label client report + CI score gate
node bin/citeready.mjs https://client.com --fix --brand "Acme Digital" --min-score 85
```

---

## CLI Flags

| Flag | Description | Default |
|---|---|---|
| `<url>` / `--url <url>` | Target live URL (or canonical URL in `--dir` mode) | — |
| `--dir <path>` | Audit a local static site directory instead of live HTTP | — |
| `--crawl <n>` | Maximum internal HTML pages to inspect (Lite caps at `1`) | `10` |
| `--fix` | Generate 6 ready-to-drop fix files + standalone HTML/JSON report | `false` |
| `--out <dir>` | Output directory for generated fixes & reports | `./citeready-output` |
| `--brand <name>` | White-label brand name in the HTML report header/footer | `CiteReady` |
| `--min-score <n>` | Exit with code `1` if overall score `< n` (great for CI) | — |
| `--json` | Print full audit JSON to stdout | `false` |
| `--lite` | Run in Free Lite mode (1 page crawl, no `--fix` export) | `false` |
| `--help`, `-h` | Show help message | — |
| `--version`, `-v` | Show version | — |

---

## Pro Auto-Fix Pack Output (`--fix`)

When `--fix` is enabled (Pro edition), CiteReady writes:

1. `llms.txt` — Compliant with the official `llmstxt.org` specification (H1, blockquote summary, H2 link sections).
2. `llms-full.txt` — Consolidated Markdown knowledge pack synthesized from crawled pages.
3. `robots.txt` — Preserves safe existing rules, opens AI search/citation crawlers (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`), and declares `Sitemap:`.
4. `jsonld-snippets.html` — Validated `Organization`, `WebSite`, `SoftwareApplication`, and `FAQPage` JSON-LD `<script>` tags.
5. `head-meta-patch.html` — Complete SEO, canonical, Open Graph, and Twitter Card `<head>` tags.
6. `nextjs-metadata.ts` — Drop-in Next.js App Router `Metadata` export.
7. `citeready-report.html` — Standalone, print-to-PDF ready audit & remediation report with interactive fix previews.
8. `citeready-report.json` — Machine-readable audit payload for dashboards and CI pipelines.

---

## Lite vs. Pro Comparison

| Feature | Free Lite (`--lite`) | Pro Kit ($19 one-time) |
|---|---|---|
| 36-Check GEO + Crawler + Schema + SEO Audit | Yes | Yes |
| Pages Crawled per Run | 1 page | Up to 10+ pages (`--crawl`) |
| Console & JSON Output | Yes | Yes |
| Auto-Generate 6 Fix Files (`--fix`) | No | Yes |
| Standalone White-Label HTML / PDF Report | No | Yes (`--brand`) |
| GitHub Actions CI Score Gate Workflow | No | Yes (`.github/workflows/citeready-gate.yml`) |

---

## CI/CD Gate (GitHub Actions)

See `.github/workflows/citeready-gate.yml` for a drop-in workflow that runs CiteReady against your static build (`--dir ./dist --min-score 85`) on every push and pull request.
