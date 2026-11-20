/**
 * CiteReady Frontend Controller:
 * - Hero interactive Before/After telemetry diff console + copy command
 * - Bento card cursor-tracking radial spotlight
 * - Interactive pricing persona recommender
 * - 3-in-1 Client-Side Browser GEO Toolkit (HTML Scanner, robots.txt AI Bot Matrix, llms.txt Spec Validator)
 * - Centralized Gumroad / Polar checkout router
 */
(function () {
  // =========================================================================
  // 0. Hero Before/After Interactive Telemetry Console + Copy CLI
  // =========================================================================
  const btnBefore = document.getElementById('hero-toggle-before');
  const btnAfter = document.getElementById('hero-toggle-after');
  const heroRing = document.getElementById('hero-ring');
  const heroNum = document.getElementById('hero-score-num');
  const heroGrade = document.getElementById('hero-score-grade');
  const heroTitle = document.getElementById('hero-console-title');
  const heroSub = document.getElementById('hero-console-sub');
  const heroPills = document.getElementById('hero-console-pills');
  const heroLog = document.getElementById('hero-console-log');

  const CIRC = 2 * Math.PI * 36; // 226.19

  function setHeroState(mode) {
    const isAfter = mode === 'after';
    if (btnBefore) {
      btnBefore.className = isAfter ? 'diff-btn' : 'diff-btn active-before';
    }
    if (btnAfter) {
      btnAfter.className = isAfter ? 'diff-btn active-after' : 'diff-btn';
    }

    const score = isAfter ? 100 : 29;
    const color = isAfter ? '#10b981' : '#f43f5e';
    if (heroRing) {
      heroRing.style.stroke = color;
      heroRing.style.strokeDashoffset = (CIRC * (1 - score / 100)).toFixed(2);
    }
    if (heroNum) {
      heroNum.textContent = String(score);
      heroNum.style.color = isAfter ? '#34d399' : '#fda4af';
    }
    if (heroGrade) heroGrade.textContent = isAfter ? 'Grade A' : 'Grade F';
    if (heroTitle) heroTitle.textContent = isAfter ? 'citeready.eiran.tech (self-audit)' : 'invoicespark-demo.example.com';
    if (heroSub) {
      heroSub.textContent = isAfter
        ? 'After applying the 6 generated CiteReady fix files'
        : 'Fresh SaaS launch fixture before CiteReady fix pack';
    }
    if (heroPills) {
      heroPills.innerHTML = isAfter
        ? '<span class="tag-pass">0 CRITICAL</span><span class="tag-pass">0 WARNINGS</span><span class="tag-pass">36/36 PASSED</span>'
        : '<span class="tag-fail">5 CRITICAL</span><span class="tag-warn">22 WARNINGS</span><span class="tag-pass">9 PASSED</span>';
    }

    const bars = isAfter
      ? [
          ['bar-geo', 'val-geo', '100%', '#10b981', '30/30'],
          ['bar-crawl', 'val-crawl', '100%', '#10b981', '20/20'],
          ['bar-schema', 'val-schema', '100%', '#10b981', '15/15'],
          ['bar-seo', 'val-seo', '100%', '#10b981', '25/25'],
        ]
      : [
          ['bar-geo', 'val-geo', '13%', '#f43f5e', '4/30'],
          ['bar-crawl', 'val-crawl', '55%', '#f59e0b', '11/20'],
          ['bar-schema', 'val-schema', '0%', '#f43f5e', '0/15'],
          ['bar-seo', 'val-seo', '40%', '#f59e0b', '10/25'],
        ];

    for (const [barId, valId, w, bg, txt] of bars) {
      const b = document.getElementById(barId);
      const v = document.getElementById(valId);
      if (b) { b.style.width = w; b.style.background = bg; }
      if (v) v.textContent = txt;
    }

    if (heroLog) {
      heroLog.innerHTML = isAfter
        ? `<div class="log-ok">+ llms.txt &amp; llms-full.txt validated (llmstxt.org spec)</div>
           <div class="log-ok">+ OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot ALLOWED</div>
           <div class="log-ok">+ Organization, WebSite, SoftwareApplication &amp; FAQPage JSON-LD valid</div>
           <div class="log-dim">CI Gate Passed (--min-score 95) &middot; Exit Code 0</div>`
        : `<div class="log-crit">[CRITICAL] /llms.txt missing (HTTP 404)</div>
           <div class="log-crit">[CRITICAL] OAI-SearchBot &amp; PerplexityBot BLOCKED in robots.txt</div>
           <div class="log-crit">[CRITICAL] No Organization / Product / FAQPage JSON-LD</div>
           <div class="log-dim">Toggle "After Fixes (100/100)" above to view post-fix output &rarr;</div>`;
    }
  }

  btnBefore?.addEventListener('click', () => setHeroState('before'));
  btnAfter?.addEventListener('click', () => setHeroState('after'));

  const btnHeroCopy = document.getElementById('btn-copy-hero-cmd');
  btnHeroCopy?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('node bin/citeready.mjs https://yourapp.com --fix --min-score 85');
      btnHeroCopy.textContent = 'Copied!';
      setTimeout(() => { btnHeroCopy.textContent = 'Copy'; }, 1400);
    } catch {
      btnHeroCopy.textContent = 'Copied';
    }
  });

  // Bento cursor spotlight
  document.querySelectorAll('.bento-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
      card.style.setProperty('--my', `${e.clientY - rect.top}px`);
    });
  });

  // Interactive pricing persona highlighter
  document.querySelectorAll('.persona-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-persona');
      document.querySelectorAll('.persona-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('[data-tier-card]').forEach((card) => {
        card.classList.toggle('persona-highlight', card.getAttribute('data-tier-card') === target);
      });
    });
  });

  // =========================================================================
  // Samples & AI Bot Definitions for 3-in-1 Workbench
  // =========================================================================
  const SAMPLE_BROKEN = `<!doctype html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <h1>Welcome</h1>
  <h1>Pricing</h1>
  <img src="/shot.png">
  <p>Fast tool.</p>
</body>
</html>`;

  const SAMPLE_GOOD = `<!doctype html>
<html lang="en">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>InvoiceSpark — Automated Client Invoicing for Solo Consultants</title>
  <meta name="description" content="Create PDF invoices, track overdue payments, and export clean tax CSVs without bloated monthly accounting software.">
  <link rel="canonical" href="https://invoicespark.example.com/">
  <link rel="icon" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:title" content="InvoiceSpark — Automated Client Invoicing">
  <meta property="og:description" content="Create PDF invoices and track overdue payments locally.">
  <meta property="og:image" content="https://invoicespark.example.com/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InvoiceSpark",
    "url": "https://invoicespark.example.com"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{"@type":"Question","name":"Does it require a monthly plan?","acceptedAnswer":{"@type":"Answer","text":"No, InvoiceSpark uses a one-time license."}}]
  }
  </script>
</head>
<body>
  <main>
    <h1>Client Invoicing Without Monthly Accounting Subscriptions</h1>
    <p>InvoiceSpark helps freelancers generate crisp PDF invoices, match incoming bank transfers, and send polite overdue reminders in under two minutes.</p>
    <details><summary>Is my client data stored locally?</summary><p>Yes, your ledger never leaves your machine unless you export it.</p></details>
    <details><summary>Can I export CSVs for tax season?</summary><p>Yes, export year-end income and expense CSVs in one click.</p></details>
    <img src="/ui.png" alt="InvoiceSpark invoice builder dashboard">
  </main>
</body>
</html>`;

  const SAMPLE_ROBOTS_BLOCKED = `User-agent: *
Allow: /

# Legacy anti-scraper block that hides you from ChatGPT & Perplexity
User-agent: OAI-SearchBot
Disallow: /

User-agent: PerplexityBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: GPTBot
Disallow: /
`;

  const SAMPLE_ROBOTS_OPEN = `User-agent: *
Allow: /

# Allow AI Search & Citation Bots
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

# Optional training opt-out example
User-agent: GPTBot
Disallow: /

Sitemap: https://yourapp.com/sitemap.xml
`;

  const SAMPLE_LLMS_INVALID = `My SaaS Product
Some intro text without an H1 heading or blockquote.

### Random H3 before H2
https://yourapp.com/docs
`;

  const SAMPLE_LLMS_VALID = `# InvoiceSpark

> Lightweight client invoicing and overdue payment tracking for freelancers without monthly accounting bloat.

InvoiceSpark runs locally and exports clean CSVs for year-end taxes.

## Core Pages
- [Homepage](https://invoicespark.example.com/): Product overview and one-time pricing.
- [Documentation](https://invoicespark.example.com/docs): Setup guide and CSV export format.

## Optional
- [Full Context](https://invoicespark.example.com/llms-full.txt): Consolidated Markdown digest.
`;

  const AI_BOTS = [
    { name: 'OAI-SearchBot', role: 'AI Search (ChatGPT)' },
    { name: 'ChatGPT-User', role: 'AI Live Retrieval' },
    { name: 'PerplexityBot', role: 'AI Search (Perplexity)' },
    { name: 'ClaudeBot', role: 'AI Search (Claude)' },
    { name: 'GPTBot', role: 'Model Training (OpenAI)' },
    { name: 'anthropic-ai', role: 'Bulk Crawler (Anthropic)' },
    { name: 'Google-Extended', role: 'Gemini AI Grounding' },
    { name: 'Applebot-Extended', role: 'Apple Intelligence' },
    { name: 'Meta-ExternalAgent', role: 'Meta AI' },
    { name: 'Amazonbot', role: 'Amazon Q / Alexa' },
  ];

  // Top-level 3-in-1 Tool Tabs
  document.querySelectorAll('.tool-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tool-tab').forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.tool-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const target = tab.getAttribute('data-tool-tab');
      document.getElementById(`tool-panel-${target}`)?.classList.add('active');
    });
  });

  // =========================================================================
  // TOOL 1: HTML Scanner & Fix Preview
  // =========================================================================
  const urlInput = document.getElementById('demo-url');
  const htmlInput = document.getElementById('demo-html');
  const scoreEl = document.getElementById('demo-score');
  const checksEl = document.getElementById('demo-checks');
  const llmsCodeEl = document.getElementById('preview-llms');
  const robotsCodeEl = document.getElementById('preview-robots');
  const jsonldCodeEl = document.getElementById('preview-jsonld');
  const btnCopyPreview = document.getElementById('btn-copy-preview');
  let activePreview = 'llms';

  function runBrowserScan() {
    const rawUrl = (urlInput?.value || 'https://example.com').trim();
    let origin = 'https://example.com';
    try {
      origin = new URL(rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`).origin;
    } catch {
      origin = 'https://example.com';
    }

    const html = htmlInput?.value || SAMPLE_BROKEN;
    const doc = new DOMParser().parseFromString(html, 'text/html');

    const title = (doc.querySelector('title')?.textContent || '').trim();
    const desc = (doc.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim();
    const canonical = (doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '').trim();
    const lang = (doc.documentElement?.getAttribute('lang') || '').trim();
    const ogTitle = (doc.querySelector('meta[property="og:title"]')?.getAttribute('content') || '').trim();
    const ogImage = (doc.querySelector('meta[property="og:image"]')?.getAttribute('content') || '').trim();
    const twCard = (doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') || '').trim();
    const h1Count = doc.querySelectorAll('h1').length;
    const hasLandmark = Boolean(doc.querySelector('main, article'));
    const imgs = [...doc.querySelectorAll('img')];
    const imgsMissingAlt = imgs.filter((img) => !img.getAttribute('alt')?.trim()).length;
    const faqCount = doc.querySelectorAll('details > summary').length;

    const ldScripts = [...doc.querySelectorAll('script[type="application/ld+json"]')];
    let validJsonLd = ldScripts.length > 0;
    for (const s of ldScripts) {
      try {
        JSON.parse(s.textContent || '');
      } catch {
        validJsonLd = false;
      }
    }

    const items = [
      { label: 'Title length (20–68 chars)', ok: title.length >= 20 && title.length <= 68, pts: 12 },
      { label: 'Meta description (70–165 chars)', ok: desc.length >= 70 && desc.length <= 165, pts: 12 },
      { label: 'Valid JSON-LD structured data', ok: validJsonLd, pts: 16 },
      { label: 'Single <h1> heading', ok: h1Count === 1, pts: 12 },
      { label: 'Canonical & <html lang> set', ok: Boolean(canonical && lang), pts: 12 },
      { label: 'Semantic <main>/<article> landmark', ok: hasLandmark, pts: 12 },
      { label: 'Open Graph & Twitter Card tags', ok: Boolean(ogTitle && ogImage && twCard), pts: 12 },
      { label: 'FAQ Q&A & Image Alt coverage', ok: faqCount >= 1 && imgsMissingAlt === 0, pts: 12 },
    ];

    const score = items.reduce((acc, item) => acc + (item.ok ? item.pts : 0), 0);
    if (scoreEl) {
      scoreEl.textContent = `${score}/100`;
      scoreEl.style.color = score >= 85 ? '#34d399' : score >= 55 ? '#fcd34d' : '#fda4af';
    }

    if (checksEl) {
      checksEl.innerHTML = items
        .map(
          (it) =>
            `<div class="mini-check"><span>${it.label}</span><span class="${
              it.ok ? 'tag-pass' : 'tag-fail'
            }">${it.ok ? 'PASS' : 'FIX NEEDED'}</span></div>`
        )
        .join('');
    }

    const brand = title ? title.split(/[|–—:-]/)[0].trim() : new URL(origin).hostname;
    const summary = desc || `${brand} official product overview and documentation at ${origin}.`;

    if (llmsCodeEl) {
      llmsCodeEl.textContent = `# ${brand}\n\n> ${summary}\n\n## Key Pages\n- [${brand} Home](${origin}/): Main product overview.\n- [Documentation](${origin}/docs): Setup and usage guide.\n\n## Optional\n- [Full Context](${origin}/llms-full.txt): Single-fetch Markdown context.\n`;
    }

    if (robotsCodeEl) {
      robotsCodeEl.textContent = `User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`;
    }

    if (jsonldCodeEl) {
      const schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: brand,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: origin,
        description: summary,
      };
      jsonldCodeEl.textContent = `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>\n`;
    }
  }

  document.getElementById('btn-sample-broken')?.addEventListener('click', () => {
    if (urlInput) urlInput.value = 'https://broken-saas.example.com';
    if (htmlInput) htmlInput.value = SAMPLE_BROKEN;
    runBrowserScan();
  });

  document.getElementById('btn-sample-good')?.addEventListener('click', () => {
    if (urlInput) urlInput.value = 'https://invoicespark.example.com';
    if (htmlInput) htmlInput.value = SAMPLE_GOOD;
    runBrowserScan();
  });

  document.getElementById('btn-run-demo')?.addEventListener('click', runBrowserScan);

  document.querySelectorAll('.preview-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.preview-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      activePreview = tab.getAttribute('data-preview') || 'llms';
      if (llmsCodeEl) llmsCodeEl.style.display = activePreview === 'llms' ? 'block' : 'none';
      if (robotsCodeEl) robotsCodeEl.style.display = activePreview === 'robots' ? 'block' : 'none';
      if (jsonldCodeEl) jsonldCodeEl.style.display = activePreview === 'jsonld' ? 'block' : 'none';
    });
  });

  btnCopyPreview?.addEventListener('click', async () => {
    const map = { llms: llmsCodeEl, robots: robotsCodeEl, jsonld: jsonldCodeEl };
    const text = map[activePreview]?.textContent || '';
    try {
      await navigator.clipboard.writeText(text);
      const orig = btnCopyPreview.textContent;
      btnCopyPreview.textContent = 'Copied!';
      setTimeout(() => { btnCopyPreview.textContent = orig; }, 1400);
    } catch {
      btnCopyPreview.textContent = 'Select & Copy';
    }
  });

  // =========================================================================
  // TOOL 2: robots.txt AI Bot Checker
  // =========================================================================
  const robotsInput = document.getElementById('robots-input');
  const robotsMatrix = document.getElementById('robots-matrix');
  const robotsSummary = document.getElementById('robots-summary');

  function evalRobotsBrowser() {
    const raw = (robotsInput?.value || '').split(/\r?\n/);
    const groups = [];
    let current = null;
    let hasSitemap = false;

    for (const line of raw) {
      const clean = line.replace(/#.*$/, '').trim();
      if (!clean) {
        if (current && current.rules.length > 0) current = null;
        continue;
      }
      const idx = clean.indexOf(':');
      if (idx === -1) continue;
      const key = clean.slice(0, idx).trim().toLowerCase();
      const val = clean.slice(idx + 1).trim();
      if (key === 'sitemap' && val) { hasSitemap = true; continue; }
      if (key === 'user-agent') {
        if (!current || current.rules.length > 0) {
          current = { agents: [], rules: [] };
          groups.push(current);
        }
        if (val) current.agents.push(val.toLowerCase());
      } else if ((key === 'allow' || key === 'disallow') && current) {
        current.rules.push({ type: key, path: val });
      }
    }

    const checkBot = (botName) => {
      const low = botName.toLowerCase();
      let specific = [];
      let wild = [];
      for (const g of groups) {
        if (g.agents.includes(low)) specific.push(...g.rules);
        else if (g.agents.includes('*')) wild.push(...g.rules);
      }
      const rules = specific.length > 0 ? specific : wild;
      let bestLen = -1;
      let bestType = 'allow';
      for (const r of rules) {
        if (r.type === 'disallow' && r.path === '') continue;
        if (r.path === '/' || r.path === '/*') {
          const len = r.path.replace(/\*/g, '').length;
          if (len > bestLen || (len === bestLen && r.type === 'allow')) {
            bestLen = len;
            bestType = r.type;
          }
        }
      }
      return { allowed: bestLen === -1 ? true : bestType === 'allow', explicit: specific.length > 0 };
    };

    let blockedSearch = 0;
    const htmlRows = AI_BOTS.map((bot, idx) => {
      const res = checkBot(bot.name);
      if (idx < 4 && !res.allowed) blockedSearch += 1;
      const cls = res.allowed ? 'tag-pass' : 'tag-fail';
      const txt = res.allowed ? (res.explicit ? 'ALLOWED' : 'DEFAULT ALLOW') : 'BLOCKED';
      return `<div class="mini-check"><span><code>${bot.name}</code> &middot; ${bot.role}</span><span class="${cls}">${txt}</span></div>`;
    });

    htmlRows.push(
      `<div class="mini-check"><span><code>Sitemap:</code> declaration</span><span class="${hasSitemap ? 'tag-pass' : 'tag-warn'}">${hasSitemap ? 'FOUND' : 'MISSING'}</span></div>`
    );

    if (robotsMatrix) robotsMatrix.innerHTML = htmlRows.join('');
    if (robotsSummary) {
      if (blockedSearch > 0) {
        robotsSummary.textContent = `${blockedSearch}/4 AI Search Bots BLOCKED`;
        robotsSummary.style.color = '#fda4af';
      } else {
        robotsSummary.textContent = 'All 4 AI Search Bots Allowed';
        robotsSummary.style.color = '#34d399';
      }
    }
  }

  document.getElementById('btn-robots-blocked')?.addEventListener('click', () => {
    if (robotsInput) robotsInput.value = SAMPLE_ROBOTS_BLOCKED;
    evalRobotsBrowser();
  });
  document.getElementById('btn-robots-open')?.addEventListener('click', () => {
    if (robotsInput) robotsInput.value = SAMPLE_ROBOTS_OPEN;
    evalRobotsBrowser();
  });
  document.getElementById('btn-check-robots')?.addEventListener('click', evalRobotsBrowser);

  // =========================================================================
  // TOOL 3: llms.txt Spec Validator
  // =========================================================================
  const llmsInput = document.getElementById('llms-input');
  const llmsScoreEl = document.getElementById('llms-score');
  const llmsBadgeEl = document.getElementById('llms-status-badge');
  const llmsChecksEl = document.getElementById('llms-checks');
  const llmsIssuesEl = document.getElementById('llms-issues');

  function evalLlmsBrowser() {
    const lines = (llmsInput?.value || '').trim().split(/\r?\n/);
    let hasH1 = false;
    let hasQuote = false;
    let noPrematureHeading = true;
    let h2Count = 0;
    let linkCount = 0;
    let sawFirstNonEmpty = false;
    let sawH2 = false;
    const issues = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (!line) continue;
      if (!sawFirstNonEmpty) {
        sawFirstNonEmpty = true;
        if (/^#\s+.+/.test(line)) { hasH1 = true; continue; }
        issues.push('First line must be an H1 heading (# Site Name).');
      }
      if (hasH1 && !hasQuote && !sawH2 && line.startsWith('>')) {
        hasQuote = line.replace(/^>\s*/, '').trim().length > 0;
        continue;
      }
      if (/^##\s+.+/.test(line)) {
        sawH2 = true;
        h2Count += 1;
        continue;
      }
      if (!sawH2 && /^#{3,6}\s+/.test(line)) {
        noPrematureHeading = false;
        issues.push(`Premature heading before first H2 link section: ${line}`);
      }
      if (sawH2 && /^[-*]\s+\[[^\]]+\]\([^)]+\)/.test(line)) {
        linkCount += 1;
      }
    }

    const checks = [
      { label: 'Starts with H1 title (# Project Name)', ok: hasH1, pts: 25 },
      { label: 'Blockquote summary (> description) after H1', ok: hasQuote, pts: 25 },
      { label: 'No premature H3+ headings before H2 links', ok: noPrematureHeading, pts: 10 },
      { label: `H2 link sections present (${h2Count} found)`, ok: h2Count > 0, pts: 20 },
      { label: `Markdown links under H2 (${linkCount} found)`, ok: linkCount > 0, pts: 20 },
    ];

    const score = checks.reduce((a, c) => a + (c.ok ? c.pts : 0), 0);
    const valid = checks.every((c) => c.ok);

    if (llmsScoreEl) {
      llmsScoreEl.textContent = `${score}/100`;
      llmsScoreEl.style.color = valid ? '#34d399' : '#fda4af';
    }
    if (llmsBadgeEl) {
      llmsBadgeEl.textContent = valid ? 'SPEC VALID' : 'SPEC INVALID';
      llmsBadgeEl.className = valid ? 'tag-pass' : 'tag-fail';
    }
    if (llmsChecksEl) {
      llmsChecksEl.innerHTML = checks
        .map((c) => `<div class="mini-check"><span>${c.label}</span><span class="${c.ok ? 'tag-pass' : 'tag-fail'}">${c.ok ? 'PASS' : 'FAIL'}</span></div>`)
        .join('');
    }
    if (llmsIssuesEl) {
      llmsIssuesEl.textContent = valid
        ? 'Valid llmstxt.org structure! Ready to publish at /llms.txt.'
        : issues.join(' ') || 'Fix the failed items above to comply with llmstxt.org.';
    }
  }

  document.getElementById('btn-llms-invalid')?.addEventListener('click', () => {
    if (llmsInput) llmsInput.value = SAMPLE_LLMS_INVALID;
    evalLlmsBrowser();
  });
  document.getElementById('btn-llms-valid')?.addEventListener('click', () => {
    if (llmsInput) llmsInput.value = SAMPLE_LLMS_VALID;
    evalLlmsBrowser();
  });
  document.getElementById('btn-validate-llms')?.addEventListener('click', evalLlmsBrowser);

  // =========================================================================
  // Checkout Link Router
  // =========================================================================
  const modal = document.getElementById('checkout-modal');
  const modalTitle = document.getElementById('modal-tier-title');
  const modalClose = document.getElementById('modal-close');
  const cfg = window.CITEREADY_CONFIG || {};

  document.querySelectorAll('[data-checkout-tier]').forEach((el) => {
    const tierKey = el.getAttribute('data-checkout-tier');
    const configuredUrl = cfg[tierKey];
    if (configuredUrl) {
      el.setAttribute('href', configuredUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    } else {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        if (modalTitle) {
          modalTitle.textContent = el.getAttribute('data-tier-label') || 'CiteReady Checkout';
        }
        if (modal) modal.classList.add('open');
      });
    }
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Initialize defaults
  if (htmlInput && !htmlInput.value.trim()) htmlInput.value = SAMPLE_BROKEN;
  if (robotsInput && !robotsInput.value.trim()) robotsInput.value = SAMPLE_ROBOTS_BLOCKED;
  if (llmsInput && !llmsInput.value.trim()) llmsInput.value = SAMPLE_LLMS_INVALID;
  setHeroState('before');
  runBrowserScan();
  evalRobotsBrowser();
  evalLlmsBrowser();
})();
