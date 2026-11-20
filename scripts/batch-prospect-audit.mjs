/**
 * Batch Prospect Auditor for CiteReady Day 2+ Outreach.
 * Runs real live audits against a list of target URLs (1 per line in a .txt file),
 * ranks sites by highest remediation need (lowest score / most critical issues),
 * appends verified findings to ops/prospects.csv, and writes ready-to-review
 * 1-on-1 value-first outreach drafts (never auto-sent).
 *
 * Usage:
 *   node scripts/batch-prospect-audit.mjs ops/prospect-urls.txt [--out ./tmp-outreach] [--append-csv]
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadLiveSite } from '../src/fetcher.mjs';
import { auditSite } from '../src/auditor.mjs';
import { generateFixes } from '../src/fix-generator.mjs';
import { renderHtmlReport } from '../src/report-html.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

function csvEscape(val) {
  const str = String(val ?? '').replace(/\r?\n/g, ' ').trim();
  if (str.includes(',') || str.includes('"')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function slugFromOrigin(origin) {
  return origin
    .replace(/^https?:\/\//i, '')
    .replace(/[^a-z0-9.-]+/gi, '_')
    .replace(/^_+|_+$/g, '');
}

function buildOutreachDraft(audit, channel = 'Launch Thread / Direct') {
  const domain = audit.origin.replace(/^https?:\/\//i, '');
  const llmsMissing = audit.checks.some((c) => c.id === 'geo-llms-exists' && c.status === 'fail');
  const filterRedundant = (c) => !(llmsMissing && c.id === 'geo-llms-spec');
  const criticals = audit.checks.filter((c) => c.severity === 'critical' && filterRedundant(c));
  const warnings = audit.checks.filter((c) => c.severity === 'warning' && filterRedundant(c));
  const topFindings = [...criticals, ...warnings].slice(0, 3);

  const bulletLines = topFindings.map((f, i) => `${i + 1}. **${f.title}** — ${f.detail}`).join('\n');

  return `### ${domain} — Score: ${audit.score}/100 (Grade ${audit.grade} | ${audit.summary.critical} Critical, ${audit.summary.warning} Warnings)
- **URL:** ${audit.url}
- **Channel:** ${channel}
- **Top Verified Findings:**
${bulletLines}

**Draft 1-on-1 Value-First Message (Review Before Sending):**
\`\`\`text
Hi — saw your site at ${domain} and ran a quick 36-check AI Search (GEO) & launch-readiness scan.

It scored ${audit.score}/100 with ${audit.summary.critical} critical gap(s):
${topFindings.map((f, i) => `${i + 1}) ${f.title}: ${f.detail}`).join('\n')}

Quick win you can apply right away:
${topFindings[0]?.fixHint || 'Publish /llms.txt and allow OAI-SearchBot & PerplexityBot in robots.txt.'}

If helpful, I already generated the complete 6-file fix pack (llms.txt, llms-full.txt, robots.txt, validated JSON-LD, <head> meta patch, and HTML audit report). You can grab the Done-For-You reviewed pack ($29 one-time) at https://eiran.gumroad.com/l/eiosatl or run the zero-dependency CLI yourself ($19 one-time) at https://citeready.eiran.tech.
\`\`\`
`;
}

async function main() {
  const argv = process.argv.slice(2);
  let inputFile = '';
  let outDir = path.join(ROOT, 'tmp-outreach');
  let appendCsv = false;
  let crawlPages = 3;

  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === '--out') outDir = path.resolve(argv[++i] || outDir);
    else if (t === '--append-csv') appendCsv = true;
    else if (t === '--crawl') crawlPages = Math.max(1, Number.parseInt(argv[++i] || '3', 10) || 3);
    else if (!t.startsWith('-') && !inputFile) inputFile = t;
  }

  if (!inputFile) {
    console.error('Usage: node scripts/batch-prospect-audit.mjs <urls-file.txt> [--out ./tmp-outreach] [--append-csv] [--crawl 3]');
    process.exitCode = 2;
    return;
  }

  const rawLines = (await fs.readFile(path.resolve(inputFile), 'utf8'))
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));

  if (rawLines.length === 0) {
    console.error('No URLs found in input file.');
    process.exitCode = 2;
    return;
  }

  await fs.mkdir(outDir, { recursive: true });
  const results = [];
  const today = new Date().toISOString().slice(0, 10);

  for (const line of rawLines) {
    // Allow optional "url | productName | channel" format
    const [rawUrl, productName = '', channel = 'Manual'] = line.split('|').map((s) => s.trim());
    if (!rawUrl) continue;

    console.log(`Auditing ${rawUrl} ...`);
    const siteData = await loadLiveSite(rawUrl, { crawl: crawlPages });
    if (!siteData.homeOk) {
      console.warn(`  SKIPPED (${siteData.homeStatus} ${siteData.homeError || 'unreachable'})`);
      continue;
    }

    const audit = auditSite(siteData);
    const fixes = generateFixes(siteData, audit);
    const slug = slugFromOrigin(audit.origin);
    const siteOutDir = path.join(outDir, slug);
    await fs.mkdir(siteOutDir, { recursive: true });

    const htmlReport = renderHtmlReport(audit, fixes, { brand: 'CiteReady' });
    await fs.writeFile(path.join(siteOutDir, 'citeready-report.html'), htmlReport, 'utf8');
    for (const [fname, content] of Object.entries(fixes)) {
      await fs.writeFile(path.join(siteOutDir, fname), content, 'utf8');
    }

    results.push({ audit, productName: productName || slug, channel, slug });
    console.log(`  OK: ${audit.score}/100 (Grade ${audit.grade}, ${audit.summary.critical} critical)`);
  }

  // Sort by highest pain first (most critical issues, then lowest score)
  results.sort((a, b) => {
    if (b.audit.summary.critical !== a.audit.summary.critical) {
      return b.audit.summary.critical - a.audit.summary.critical;
    }
    return a.audit.score - b.audit.score;
  });

  const draftMd = [
    `# Batch Prospect Audit & 1-on-1 Outreach Drafts (${today})`,
    '',
    `Audited **${results.length}** reachable sites. Ranked by highest remediation urgency first. **Review every draft manually before sending.**`,
    '',
    ...results.map((r) => buildOutreachDraft(r.audit, r.channel)),
  ].join('\n');

  const draftPath = path.join(outDir, 'outreach-drafts.md');
  await fs.writeFile(draftPath, draftMd, 'utf8');
  console.log(`\nWrote ranked outreach drafts to ${draftPath}`);

  if (appendCsv && results.length > 0) {
    const csvPath = path.join(ROOT, 'ops', 'prospects.csv');
    const newRows = results.map(({ audit, productName, channel }) => {
      const topIssue =
        audit.checks.find((c) => c.severity === 'critical')?.title ||
        audit.checks.find((c) => c.severity === 'warning')?.title ||
        'Minor optimizations';
      const domain = audit.origin.replace(/^https?:\/\//i, '');
      return [
        today,
        productName,
        domain,
        channel,
        audit.score,
        audit.summary.critical,
        topIssue,
        'pending_review',
        'audited_draft_ready',
        `Report in tmp-outreach/${slugFromOrigin(audit.origin)}`,
      ]
        .map(csvEscape)
        .join(',');
    });

    await fs.appendFile(csvPath, newRows.join('\n') + '\n', 'utf8');
    console.log(`Appended ${newRows.length} verified prospect rows to ${csvPath}`);
  }
}

main().catch((err) => {
  console.error(`Batch audit error: ${err?.message || err}`);
  process.exitCode = 1;
});
