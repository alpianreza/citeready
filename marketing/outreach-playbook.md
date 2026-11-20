# Ethical 1-on-1 Value-First Outreach Playbook

**Strict Rules (Section 6 Compliance):**
- **ZERO mass messaging / cold spam.**
- **NEVER send bulk messages without explicit human approval.**
- Every outreach message must be **1-on-1, personalized, and deliver genuine upfront value** to someone who recently launched or explicitly requested feedback.

---

## Step 1: Identify High-Intent Prospects (Manual Daily List: 10–15/day)
Look in public launch feeds where founders explicitly ask for feedback:
- Recent **Show HN** launches (`news.ycombinator.com/show`)
- Recent **Product Hunt** launches (`producthunt.com`)
- `r/SideProject`, `r/SaaS`, `r/indiehackers`, `r/roastmystartup` threads asking *"Feedback on our landing page?"* or *"Why isn't our SaaS getting traffic?"*

## Step 2: Run the Real CiteReady Audit Locally (or on User's Machine)
```bash
node bin/citeready.mjs https://prospect-domain.com --fix --out ./tmp-outreach/prospect-domain
```
Inspect the **real observed findings** (never guess or fabricate failures):
- Did `/llms.txt` return 404?
- Is `OAI-SearchBot`, `PerplexityBot`, or `ClaudeBot` blocked in `/robots.txt`?
- Is JSON-LD (`Organization` / `SoftwareApplication` / `FAQPage`) missing or invalid JSON?
- Is `og:image` returning 404 or missing?

## Step 3: Send Value First (80% Free Value, 20% Soft Offer)

### Template A — Public Thread Reply (e.g., `r/SideProject` / `r/roastmystartup` / Show HN)
```text
Congrats on launching [ProductName]! I liked [specific genuine detail from their site].

Just a heads-up from running an automated pre-launch check on [Domain]:
1. [Specific real finding 1, e.g. `/llms.txt` returns 404]
2. [Specific real finding 2, e.g. `robots.txt` has no `OAI-SearchBot` / `PerplexityBot` rule or `Sitemap:` line]
3. [Specific real finding 3, e.g. no `Organization` / `SoftwareApplication` JSON-LD detected]

Quick fix for your `robots.txt` right away:
User-agent: OAI-SearchBot
Allow: /
User-agent: PerplexityBot
Allow: /
Sitemap: https://[Domain]/sitemap.xml

If helpful, I already generated the full 36-check HTML audit report plus ready-to-drop `llms.txt`, `llms-full.txt`, JSON-LD, and meta files for your repo — happy to share the summary or you can grab the CLI/DFY pack at [LIVE_SITE_URL].
```

### Template B — 1-on-1 Direct Message / Founder Email (After Genuine Engagement)
```text
Subject: Quick 36-check AI Search / Launch check for [ProductName] ([Score]/100)

Hi [FirstName],

Saw your launch of [ProductName] on [Platform] — [specific compliment on their product].

I ran a quick technical AI Search & launch-readiness check on [Domain] and noticed [Score]/100 with [X] critical gaps (for example: [Real Finding 1] and [Real Finding 2]).

Because fixing these manually takes an hour of boilerplate work, I generated a ready-to-drop fix pack for [Domain] (`llms.txt` per llmstxt.org, clean `robots.txt`, validated JSON-LD, `<head>` meta patch, and full HTML/PDF audit report).

Want me to send over the complete fix pack ZIP for $29 one-time, or you can run the CLI yourself anytime for $19 at [LIVE_SITE_URL]?

Either way, congrats on shipping [ProductName]!
```

## Step 4: Log Everything in `ops/prospects.csv`
Track every prospect's domain, audit score, top real issue found, channel, date contacted, response status, and conversion outcome.
