#!/usr/bin/env node
/**
 * CiteReady CLI — AI Search (GEO), llms.txt, AI Crawler & Launch-Readiness Audit Engine
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { loadLiveSite, loadLocalSite } from '../src/fetcher.mjs';
import { auditSite } from '../src/auditor.mjs';
import { generateFixes } from '../src/fix-generator.mjs';
import { renderHtmlReport } from '../src/report-html.mjs';

const VERSION = '1.0.0';

function printHelp() {
  console.log(`
CiteReady v${VERSION} — AI Search (GEO) & Launch-Readiness Audit Engine

Usage:
  citeready <url> [options]
  citeready --dir <path> --url <canonical-url> [options]

Options:
  --url <url>         Target live URL (or canonical URL when using --dir)
  --dir <path>        Audit a local static build folder instead of live HTTP
  --crawl <n>         Max internal HTML pages to inspect (default: 10; Lite caps at 1)
  --fix               Generate 6 drop-in fix files + standalone HTML/JSON report
  --out <dir>         Output directory for --fix files (default: ./citeready-output)
  --brand <name>      White-label brand name in the HTML report (default: CiteReady)
  --min-score <n>     Exit with code 1 if score is below <n> (for CI gates)
  --json              Print machine-readable JSON audit result to stdout
  --lite              Run in Free Lite edition mode (1 page, console/JSON audit only)
  -h, --help          Show this help message
  -v, --version       Show version number
`);
}

function parseArgs(argv) {
  const args = {
    url: '',
    dir: '',
    crawl: 10,
    fix: false,
    out: './citeready-output',
    brand: 'CiteReady',
    minScore: null,
    json: false,
    lite: false,
    help: false,
    version: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const token = argv[i];
    if (token === '-h' || token === '--help') {
      args.help = true;
    } else if (token === '-v' || token === '--version') {
      args.version = true;
    } else if (token === '--fix') {
      args.fix = true;
    } else if (token === '--json') {
      args.json = true;
    } else if (token === '--lite') {
      args.lite = true;
    } else if (token === '--url') {
      args.url = argv[++i] || '';
    } else if (token === '--dir') {
      args.dir = argv[++i] || '';
    } else if (token === '--crawl') {
      args.crawl = Number.parseInt(argv[++i] || '10', 10) || 10;
    } else if (token === '--out') {
      args.out = argv[++i] || './citeready-output';
    } else if (token === '--brand') {
      args.brand = argv[++i] || 'CiteReady';
    } else if (token === '--min-score') {
      const val = Number.parseFloat(argv[++i] || '');
      if (Number.isFinite(val)) args.minScore = val;
    } else if (!token.startsWith('-') && !args.url) {
      args.url = token;
    } else {
      console.error(`Unknown or incomplete option: ${token}`);
      process.exitCode = 2;
      return args;
    }
  }

  return args;
}

function printConsoleSummary(auditResult, writtenFiles = [], args = {}) {
  console.log('');
  console.log(`=== CiteReady Audit Report (${auditResult.grade} | ${auditResult.score}/100) ===`);
  console.log(`Target : ${auditResult.url} (${auditResult.mode})`);
  console.log(`Pages  : ${auditResult.meta.pagesCrawled} inspected | ${auditResult.summary.totalChecks} checks`);
  console.log(
    `Summary: ${auditResult.summary.critical} critical, ${auditResult.summary.warning} warnings, ${auditResult.summary.pass} passed`
  );
  console.log('');
  console.log('Pillar Scores:');
  for (const p of auditResult.pillars) {
    const barCount = Math.round(p.pct / 10);
    const bar = '#'.repeat(barCount) + '-'.repeat(10 - barCount);
    console.log(`  - ${p.name.padEnd(26)} [${bar}] ${String(p.earned).padStart(2)}/${p.maxPoints} (${p.pct}%)`);
  }

  const failures = auditResult.checks.filter((c) => c.severity !== 'pass');
  if (failures.length > 0) {
    console.log('');
    console.log('Top Action Items:');
    for (const item of failures.slice(0, 12)) {
      const tag = item.severity === 'critical' ? '[CRITICAL]' : '[WARN]    ';
      console.log(`  ${tag} ${item.title}`);
      console.log(`             -> ${item.fixHint}`);
    }
  }

  if (args.lite) {
    console.log('');
    if (args.fix) {
      console.log('[Lite Mode] Auto-fix file generation (--fix) and HTML/PDF reports require CiteReady Pro.');
    }
    if (failures.length > 0 || args.fix) {
      console.log(`Auto-generate all 6 drop-in fix files (llms.txt, llms-full.txt, robots.txt, JSON-LD, meta, Next.js) + white-label report:`);
      console.log(`  -> CiteReady Pro CLI ($19 one-time):      https://eiran.gumroad.com/l/shubyl`);
      console.log(`  -> Done-For-You 24h Fix Pack ($29):       https://eiran.gumroad.com/l/eiosatl`);
      console.log(`  -> Live demo & docs:                      https://citeready.eiran.tech`);
    }
  } else if (writtenFiles.length > 0) {
    console.log('');
    console.log(`Generated ${writtenFiles.length} fix & report files in ${path.resolve(args.out)}:`);
    for (const f of writtenFiles) {
      console.log(`  + ${f}`);
    }
  }
  console.log('');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (process.exitCode) return;

  if (args.version) {
    console.log(VERSION);
    return;
  }

  if (args.help || (!args.url && !args.dir)) {
    printHelp();
    process.exitCode = args.help ? 0 : 2;
    return;
  }

  const effectiveCrawl = args.lite ? 1 : Math.max(1, args.crawl);

  const siteData = args.dir
    ? await loadLocalSite(args.dir, args.url || 'https://example.com', { crawl: effectiveCrawl })
    : await loadLiveSite(args.url, { crawl: effectiveCrawl });

  if (!siteData.homeOk) {
    console.error(`Warning: Target root returned status ${siteData.homeStatus} (${siteData.homeError || 'not ok'}).`);
  }

  const auditResult = auditSite(siteData);
  const writtenFiles = [];

  if (args.fix && !args.lite) {
    const fixes = generateFixes(siteData, auditResult);
    const outDir = path.resolve(args.out);
    await fs.mkdir(outDir, { recursive: true });

    for (const [filename, content] of Object.entries(fixes)) {
      const targetPath = path.join(outDir, filename);
      await fs.writeFile(targetPath, content, 'utf8');
      writtenFiles.push(filename);
    }

    const htmlReport = renderHtmlReport(auditResult, fixes, { brand: args.brand });
    await fs.writeFile(path.join(outDir, 'citeready-report.html'), htmlReport, 'utf8');
    writtenFiles.push('citeready-report.html');

    await fs.writeFile(
      path.join(outDir, 'citeready-report.json'),
      JSON.stringify({ audit: auditResult, fixes }, null, 2),
      'utf8'
    );
    writtenFiles.push('citeready-report.json');
  }

  if (args.json) {
    console.log(JSON.stringify(auditResult, null, 2));
  } else {
    printConsoleSummary(auditResult, writtenFiles, args);
  }

  if (args.minScore !== null && auditResult.score < args.minScore) {
    console.error(`CI Gate Failed: score ${auditResult.score} is below --min-score ${args.minScore}.`);
    process.exitCode = 1;
    return;
  }
}

main().catch((err) => {
  console.error(`CiteReady Error: ${err?.message || err}`);
  process.exitCode = 1;
});
