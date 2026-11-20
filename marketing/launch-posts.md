# Launch Posts & Community Distribution Kit

> **Note:** Follow every community's self-promotion rules strictly. Never spam links, never fabricate metrics or user testimonials, and lead with real technical value.

---

## 1. Show HN (Hacker News)

**Title:** `Show HN: CiteReady – Zero-dependency CLI to audit llms.txt, AI bots, and JSON-LD`

**Body:**
```text
Hey HN,

I built CiteReady, a zero-dependency Node.js 18+ CLI that audits websites across 36 checks for AI search readiness (GEO), crawler policies, structured data, and pre-launch SEO/OG sanity—then generates the missing config files locally.

Why I built it:
Most GEO/AI visibility tools charge $29–$49/month just to tell you whether ChatGPT or Perplexity mentioned your brand, while lots of indie sites still accidentally block OAI-SearchBot/PerplexityBot in robots.txt, ship broken JSON-LD, or have no llms.txt at all.

What it checks (pure Node.js fetch + local static dir mode, no API keys):
1. /llms.txt compliance against the llmstxt.org H1 + blockquote + H2 markdown-link structure, plus /llms-full.txt and semantic HTML landmarks (<main>, <article>, extractable Q&A).
2. /robots.txt longest-prefix rule matching for 10 AI crawlers (separating search/citation bots like OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot from training bots like GPTBot).
3. JSON-LD syntax validation + schema.org entities (Organization, SoftwareApplication, FAQPage).
4. Technical SEO, Open Graph image reachability (HEAD/GET check), and HTML payload checks.

It runs against live URLs or local build folders (`--dir ./dist --min-score 85` for CI gates). There is an interactive browser HTML scanner on the landing page and a Free Lite CLI, plus a $19 Pro CLI / $29 done-for-you pack that exports all 6 fix files (`llms.txt`, `llms-full.txt`, `robots.txt`, JSON-LD, meta patch, Next.js Metadata) and a standalone HTML report.

Link: [LIVE_SITE_URL]
Interactive sample report: [LIVE_SITE_URL]/sample-report.html

Would appreciate feedback on the 36-check rubric—especially any edge cases in robots.txt matching or llmstxt.org parsing you think we should add.
```

---

## 2. Reddit — `r/SideProject`

**Title:** `Built a zero-dependency CLI + browser scanner that checks why ChatGPT/Perplexity ignore your site (and generates the fix files)`

**Body:**
```text
Got tired of seeing GEO/AI visibility SaaS tools charging $29–$49/month for dashboards without actually fixing anything in a repo.

So I built **CiteReady** — a Node.js 18+ tool (zero npm dependencies, zero API keys) that runs 36 checks across:
- `/llms.txt` (`llmstxt.org` spec validation) & `/llms-full.txt`
- AI crawler `robots.txt` policies (`OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `GPTBot`, etc.)
- JSON-LD syntax + `Organization` / `SoftwareApplication` / `FAQPage`
- Core technical SEO, `<link rel="canonical">`, and live `og:image` 200 verification

You can test raw HTML right in the browser on the site (nothing is uploaded to a backend), inspect a real generated HTML audit report, or run the CLI locally against `./dist` with `--min-score 85` in GitHub Actions.

The Free Lite edition does single-page audits; the $19 Pro one-time pack generates all 6 drop-in fix files (`llms.txt`, `llms-full.txt`, `robots.txt`, JSON-LD snippets, `<head>` meta patch, `nextjs-metadata.ts`) + a white-label HTML/PDF report.

Would love feedback on the scoring weights or if anyone wants me to run a quick audit on their landing page URL in the comments!
Link: [LIVE_SITE_URL]
```

---

## 3. Reddit — `r/SaaS` & `r/indiehackers`

**Title:** `Before paying $49/mo for an "AI SEO" tracker, check if your robots.txt is literally blocking ChatGPT & Perplexity`

**Body:**
```text
Quick pattern I kept seeing while checking indie SaaS launches:
Founders buy or worry about $29–$49/mo AI visibility trackers, yet their own domain either:
1. Blocks `OAI-SearchBot` / `PerplexityBot` / `ClaudeBot` via legacy scraper-blocking `robots.txt` rules,
2. Has no `/llms.txt` file following `llmstxt.org` structure,
3. Has invalid or missing JSON-LD (`Organization`, `SoftwareApplication`, `FAQPage`), or
4. Has a broken `og:image` returning 404.

I put together **CiteReady** — a browser HTML checker + Node 18+ CLI that scores those 36 checks locally without any monthly subscription. Drop your URL in the comments if you want me to paste your 6-pillar breakdown + AI crawler status here so you can fix it yourself!

Demo & live browser scanner: [LIVE_SITE_URL]
```

---

## 4. Product Hunt Launch Copy

- **Tagline (58 chars):** `Audit & auto-fix llms.txt, AI bots & SEO for $19 one-time`
- **Short Description:**
  `CiteReady audits 36 AI Search (GEO), llms.txt, AI crawler robots.txt, JSON-LD, Open Graph, and SEO checks with zero dependencies—then generates 6 drop-in fix files and a white-label HTML/PDF report. No $49/mo subscription.`
- **Maker Comment:**
  `Hey Product Hunt! I built CiteReady for founders and small agencies tired of $29–$49/mo monitoring subscriptions. You can try the in-browser HTML scanner right on the homepage, inspect a sample output report, run the free Lite CLI, or grab the $19 Pro auto-fix kit / $29 done-for-you fix pack. Happy to audit anyone's launch URL in the comments today!`

---

## 5. Dev.to Technical Article Outline

**Title:** `The 36-Point Pre-Launch Checklist for AI Search (llms.txt, AI Crawlers & JSON-LD)`
- Section 1: Why Googlebot != `OAI-SearchBot`, `PerplexityBot`, and `ClaudeBot` (and how to separate search citations from model training in `robots.txt`).
- Section 2: The exact `llmstxt.org` Markdown order (H1 -> Blockquote -> Plain Details -> H2 Links -> Optional) and common parser mistakes.
- Section 3: Validating JSON-LD (`Organization` + `SoftwareApplication` + `FAQPage`) and `og:image` HTTP 200 checks in CI before shipping.
- Section 4: Automating all 36 checks in GitHub Actions with `citeready --dir ./dist --min-score 85`.

---

## 6. X / LinkedIn Short Thread

```text
Most "AI search optimization" SaaS tools charge $29–$49/mo just to monitor prompts.

Meanwhile, half of indie SaaS sites fail the basics:
- Missing /llms.txt (llmstxt.org spec)
- robots.txt blocking OAI-SearchBot or PerplexityBot
- Missing/invalid JSON-LD
- Broken og:image

So I built CiteReady: a zero-dependency Node 18+ CLI that audits 36 checks and generates all 6 drop-in fix files locally.

$19 one-time (or $29 done-for-you). Zero subscriptions.

Try the live browser HTML demo: [LIVE_SITE_URL]
```
