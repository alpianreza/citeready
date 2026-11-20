/**
 * Automated offline verification suite for CiteReady.
 * Uses local node:http mock servers on 127.0.0.1 (port 0) — zero external internet calls.
 */

import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

import { parseHtml, escapeHtml } from '../src/html-parser.mjs';
import { parseRobotsTxt, evaluateAiCrawlers } from '../src/robots-parser.mjs';
import { validateLlmsTxt } from '../src/llmstxt-validator.mjs';
import { loadLiveSite } from '../src/fetcher.mjs';
import { auditSite } from '../src/auditor.mjs';
import { generateFixes } from '../src/fix-generator.mjs';
import { renderHtmlReport } from '../src/report-html.mjs';

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');
const CLI_PATH = path.join(ROOT_DIR, 'bin', 'citeready.mjs');

let passed = 0;
let failed = 0;

async function test(name, fn) {
  try {
    await fn();
    passed += 1;
    console.log(`PASS  ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL  ${name}`);
    console.error(`      ${err?.stack || err}`);
  }
}

function createServer(handler) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(handler);
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      resolve({ server, baseUrl: `http://127.0.0.1:${addr.port}` });
    });
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(() => resolve()));
}

const BROKEN_HTML = (baseUrl) => `<!doctype html>
<html>
<head>
  <title>Bad &lt;script&gt;alert(1)&lt;/script&gt;</title>
  <meta content='${baseUrl}/missing-og.png' property='og:image'>
</head>
<body>
  <h1>First Heading</h1>
  <h1>Second Heading</h1>
  <img src="/logo.png">
  <p>Short.</p>
</body>
</html>`;

const GOLD_HTML = (baseUrl) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GoldSaaS — Automated Invoice Reconciliation for Freelancers</title>
  <meta name="description" content="GoldSaaS automatically matches bank deposits to client invoices in seconds without complex accounting software.">
  <link rel="canonical" href="https://gold.example.com/">
  <link rel="icon" href="/favicon.svg">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="GoldSaaS">
  <meta property="og:title" content="GoldSaaS — Automated Invoice Reconciliation">
  <meta property="og:description" content="Match bank deposits to client invoices in seconds without complex accounting software.">
  <meta property="og:url" content="https://gold.example.com/">
  <meta property="og:image" content="${baseUrl}/og.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="GoldSaaS — Automated Invoice Reconciliation">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "GoldSaaS",
    "url": "https://gold.example.com"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "GoldSaaS",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web"
  }
  </script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How does GoldSaaS work?",
        "acceptedAnswer": { "@type": "Answer", "text": "Upload a CSV bank export and match invoices automatically locally." }
      }
    ]
  }
  </script>
</head>
<body>
  <header><nav><a href="/docs">Docs</a></nav></header>
  <main>
    <h1>Automated Invoice Reconciliation Without Monthly Accounting Bloat</h1>
    <p>GoldSaaS is a lightweight browser utility that matches messy bank CSV exports directly against unpaid freelancer invoices so you save hours every month.</p>
    <article>
      <h2>Why freelancers switch to GoldSaaS</h2>
      <p>Traditional bookkeeping suites require dozens of setup screens and recurring subscriptions. GoldSaaS focuses strictly on fast reconciliation, clear status tracking, and clean CSV exports that import straight into your tax folder. Teams and solo consultants can inspect every matched transaction locally before exporting any report.</p>
      <p>Every workflow is deterministic, fast, and designed around zero-setup productivity for independent contractors, design studios, software agencies, and technical freelancers who want clarity over cash flow without fighting bloated accounting dashboards every Friday afternoon.</p>
    </article>
    <section>
      <h2>Frequently Asked Questions</h2>
      <details>
        <summary>Does GoldSaaS upload my bank CSV?</summary>
        <p>No, all matching runs locally inside your browser session.</p>
      </details>
      <details>
        <summary>Is there a recurring subscription?</summary>
        <p>No, GoldSaaS uses simple one-time licensing.</p>
      </details>
    </section>
    <img src="/preview.png" alt="GoldSaaS invoice matching screen">
  </main>
  <footer><p>GoldSaaS Inc.</p></footer>
</body>
</html>`;

const GOLD_DOCS_HTML = `<!doctype html>
<html lang="en">
<head><title>GoldSaaS Documentation</title><meta name="description" content="Complete setup guide for GoldSaaS CSV matching."></head>
<body><main><h1>GoldSaaS Documentation</h1><p>Step by step guide to import CSV statements and match invoices automatically.</p></main></body>
</html>`;

const GOLD_LLMS_TXT = (baseUrl) => `# GoldSaaS

> GoldSaaS automatically matches bank deposits to client invoices in seconds without complex accounting software.

## Documentation
- [GoldSaaS Home](${baseUrl}/): Product overview and pricing.
- [Docs](${baseUrl}/docs): Complete CSV matching setup guide.

## Optional
- [Full Context](${baseUrl}/llms-full.txt): Consolidated markdown summary.
`;

const GOLD_ROBOTS_TXT = (baseUrl) => `User-agent: *
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

const BROKEN_ROBOTS_TXT = `User-agent: OAI-SearchBot
Disallow: /

User-agent: PerplexityBot
Disallow: /
`;

async function main() {
  // 1. Unit tests
  await test('html-parser extracts attributes in any order & escapes XSS safely', () => {
    const parsed = parseHtml(
      `<html lang="en"><head><meta content="Hello World" name='description'><link href="https://a.com/" rel="canonical"></head><body><h1>Main</h1><details><summary>What is it?</summary><p>A tool.</p></details></body></html>`,
      'https://a.com/'
    );
    assert.equal(parsed.lang, 'en');
    assert.equal(parsed.metaMap.description, 'Hello World');
    assert.equal(parsed.canonical, 'https://a.com/');
    assert.equal(parsed.faqPairs.length, 1);
    assert.equal(escapeHtml('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  await test('robots-parser accurately evaluates explicit AI search bot blocks and wildcard fallback', () => {
    const parsed = parseRobotsTxt(BROKEN_ROBOTS_TXT);
    const evalRes = evaluateAiCrawlers(parsed);
    const map = Object.fromEntries(evalRes.bots.map((b) => [b.name, b]));
    assert.equal(map['OAI-SearchBot'].allowed, false);
    assert.equal(map['PerplexityBot'].allowed, false);
    assert.equal(map['ClaudeBot'].allowed, true);

    // Regression: wildcard Allow: / followed by blank line and specific Disallow: /
    const withBlankLine = parseRobotsTxt(`User-agent: *\nAllow: /\n\nUser-agent: OAI-SearchBot\nDisallow: /\n\nUser-agent: PerplexityBot\nDisallow: /\n`);
    const blankMap = Object.fromEntries(evaluateAiCrawlers(withBlankLine).bots.map((b) => [b.name, b]));
    assert.equal(blankMap['OAI-SearchBot'].allowed, false);
    assert.equal(blankMap['PerplexityBot'].allowed, false);
    assert.equal(blankMap['ClaudeBot'].allowed, true);
  });

  await test('llmstxt-validator enforces official llmstxt.org structure', () => {
    const valid = validateLlmsTxt(`# Demo\n\n> Summary line.\n\n## Docs\n- [Home](https://x.com/): Overview\n`);
    assert.equal(valid.valid, true);
    assert.equal(valid.linkCount, 1);

    const missingQuote = validateLlmsTxt(`# Demo\n\n## Docs\n- [Home](https://x.com/): Overview\n`);
    assert.equal(missingQuote.valid, false);
    assert.equal(missingQuote.checks.hasBlockquote, false);

    const prematureHeading = validateLlmsTxt(`# Demo\n\n> Summary\n\n### Bad H3\n\n## Docs\n- [Home](https://x.com/)\n`);
    assert.equal(prematureHeading.valid, false);
    assert.equal(prematureHeading.checks.noPrematureHeadings, false);
  });

  // 2. Mock HTTP integration tests
  const brokenServer = await createServer((req, res) => {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(BROKEN_HTML(brokenServer.baseUrl));
    } else if (req.url === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(BROKEN_ROBOTS_TXT);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  const goldServer = await createServer((req, res) => {
    const bUrl = goldServer.baseUrl;
    if (req.url === '/') {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      });
      res.end(GOLD_HTML(bUrl));
    } else if (req.url === '/docs') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(GOLD_DOCS_HTML);
    } else if (req.url === '/robots.txt') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(GOLD_ROBOTS_TXT(bUrl));
    } else if (req.url === '/llms.txt') {
      res.writeHead(200, { 'Content-Type': 'text/markdown' });
      res.end(GOLD_LLMS_TXT(bUrl));
    } else if (req.url === '/llms-full.txt') {
      res.writeHead(200, { 'Content-Type': 'text/markdown' });
      res.end('# GoldSaaS Full\n\nComplete documentation.');
    } else if (req.url === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${bUrl}/</loc></url></urlset>`);
    } else if (req.url === '/og.png') {
      res.writeHead(200, { 'Content-Type': 'image/png' });
      res.end('PNGDATA');
    } else {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  try {
    await test('live audit detects broken site critical failures (< 45 pts)', async () => {
      const siteData = await loadLiveSite(brokenServer.baseUrl, { crawl: 5 });
      const audit = auditSite(siteData);
      assert.equal(audit.checks.length, 36);
      assert.ok(audit.score < 45, `Expected broken site score < 45, got ${audit.score}`);
      assert.ok(audit.summary.critical >= 4, `Expected >= 4 critical issues, got ${audit.summary.critical}`);
    });

    await test('live audit scores gold site >= 95 with 0 critical issues & crawls /docs', async () => {
      const siteData = await loadLiveSite(goldServer.baseUrl, { crawl: 10 });
      const audit = auditSite(siteData);
      assert.equal(audit.checks.length, 36);
      assert.equal(audit.meta.pagesCrawled, 2);
      assert.ok(audit.score >= 95, `Expected gold site score >= 95, got ${audit.score}`);
      assert.equal(audit.summary.critical, 0);
    });

    await test('generateFixes builds valid llms.txt, robots.txt, JSON-LD, meta patch, Next.js & XSS-safe report', async () => {
      const siteData = await loadLiveSite(brokenServer.baseUrl, { crawl: 5 });
      const audit = auditSite(siteData);
      const fixes = generateFixes(siteData, audit);

      const llmsCheck = validateLlmsTxt(fixes['llms.txt']);
      assert.equal(llmsCheck.valid, true, `llms.txt invalid: ${llmsCheck.issues.join('; ')}`);

      const robotsCheck = evaluateAiCrawlers(parseRobotsTxt(fixes['robots.txt']));
      const botMap = Object.fromEntries(robotsCheck.bots.map((b) => [b.name, b]));
      assert.equal(botMap['OAI-SearchBot'].allowed, true);
      assert.equal(botMap['ChatGPT-User'].allowed, true);
      assert.equal(botMap['PerplexityBot'].allowed, true);
      assert.equal(botMap['ClaudeBot'].allowed, true);

      const jsonLdMatches = [...fixes['jsonld-snippets.html'].matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      assert.ok(jsonLdMatches.length >= 3, 'Expected at least 3 JSON-LD blocks');
      for (const m of jsonLdMatches) {
        assert.doesNotThrow(() => JSON.parse(m[1]));
      }

      assert.ok(fixes['head-meta-patch.html'].includes('og:title'));
      assert.ok(fixes['nextjs-metadata.ts'].includes('export const metadata: Metadata'));

      const report = renderHtmlReport(audit, fixes, { brand: 'AgencyTest' });
      assert.ok(report.includes('AgencyTest'));
      assert.ok(!report.includes('<title>Bad <script>alert(1)</script>'));
      assert.ok(!report.includes('>undefined<'));
      assert.ok(!report.includes('NaN%'));
    });

    await test('CLI --min-score fails on broken site and passes on gold site', async () => {
      let brokenExitedNonZero = false;
      try {
        await execFileAsync('node', [CLI_PATH, brokenServer.baseUrl, '--min-score', '80']);
      } catch (err) {
        brokenExitedNonZero = err.code === 1;
      }
      assert.equal(brokenExitedNonZero, true, 'Expected CLI to exit with code 1 on broken site');

      const { stdout } = await execFileAsync('node', [CLI_PATH, goldServer.baseUrl, '--min-score', '80', '--json']);
      const parsedOut = JSON.parse(stdout);
      assert.ok(parsedOut.score >= 95);
    });

    await test('CLI --lite blocks --fix file generation and caps crawl to 1 page', async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'citeready-lite-'));
      try {
        const { stdout } = await execFileAsync('node', [
          CLI_PATH,
          goldServer.baseUrl,
          '--lite',
          '--fix',
          '--out',
          tmpDir,
          '--json',
        ]);
        const parsedOut = JSON.parse(stdout);
        assert.equal(parsedOut.meta.pagesCrawled, 1);
        const files = await fs.readdir(tmpDir);
        assert.equal(files.length, 0, 'Lite mode must not write Pro fix files');
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    await test('CLI --fix writes all 8 files in Pro mode', async () => {
      const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'citeready-pro-'));
      try {
        await execFileAsync('node', [CLI_PATH, brokenServer.baseUrl, '--fix', '--out', tmpDir]);
        const files = await fs.readdir(tmpDir);
        for (const expected of [
          'llms.txt',
          'llms-full.txt',
          'robots.txt',
          'jsonld-snippets.html',
          'head-meta-patch.html',
          'nextjs-metadata.ts',
          'citeready-report.html',
          'citeready-report.json',
        ]) {
          assert.ok(files.includes(expected), `Missing generated file: ${expected}`);
        }
      } finally {
        await fs.rm(tmpDir, { recursive: true, force: true });
      }
    });

    await test('CLI --dir ./site self-audit scores >= 95 with 0 critical issues', async () => {
      const { stdout } = await execFileAsync('node', [
        CLI_PATH,
        '--dir',
        path.join(ROOT_DIR, 'site'),
        '--url',
        'https://citeready.eiran.tech',
        '--min-score',
        '95',
        '--json',
      ]);
      const parsedOut = JSON.parse(stdout);
      assert.ok(parsedOut.score >= 95, `Expected site score >= 95, got ${parsedOut.score}`);
      assert.equal(parsedOut.summary.critical, 0);
    });
  } finally {
    await closeServer(brokenServer.server);
    await closeServer(goldServer.server);
  }

  console.log(`\nTest Results: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

main();
