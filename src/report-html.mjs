/**
 * Standalone, zero-dependency, print-to-PDF ready HTML report renderer.
 * Styled in CiteReady's Obsidian Engineering Console theme on screen,
 * with crisp white-paper formatting automatically applied under @media print.
 */

import { escapeHtml } from './html-parser.mjs';

function scoreColor(score) {
  if (score >= 85) return '#10b981';
  if (score >= 65) return '#f59e0b';
  return '#f43f5e';
}

function badgeClass(severity) {
  if (severity === 'pass') return 'pill-pass';
  if (severity === 'warning') return 'pill-warn';
  return 'pill-crit';
}

function severityLabel(severity) {
  if (severity === 'pass') return 'PASS';
  if (severity === 'warning') return 'WARNING';
  return 'CRITICAL';
}

export function renderHtmlReport(auditResult, fixes = {}, options = {}) {
  const brand = options.brand ? String(options.brand).trim() : 'CiteReady';
  const color = scoreColor(auditResult.score);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.max(0, Math.min(100, auditResult.score)) / 100) * circumference;

  const demoBanner = options.demoNotice
    ? `<div class="demo-banner"><span>${escapeHtml(options.demoNotice)}</span><a class="back-link" href="/">&larr; Back to CiteReady</a></div>`
    : '';

  const pillarCards = auditResult.pillars
    .map((p) => {
      const pColor = scoreColor(p.pct);
      return `
      <div class="pillar-card">
        <div class="pillar-top">
          <span class="pillar-name">${escapeHtml(p.name)}</span>
          <span class="pillar-pts">${p.earned} / ${p.maxPoints} pts</span>
        </div>
        <div class="bar-track"><div class="bar-fill" style="width:${p.pct}%;background:${pColor};"></div></div>
        <div class="pillar-sub">${p.passed} of ${p.total} checks passed (${p.pct}%)</div>
      </div>`;
    })
    .join('');

  const crawlerRows = auditResult.crawlers.bots
    .map((bot) => {
      const allowed = bot.allowed;
      const cls = allowed ? 'pill-pass' : 'pill-crit';
      const statusText = allowed
        ? bot.explicit
          ? 'Allowed (Explicit)'
          : 'Allowed (Default)'
        : 'BLOCKED';
      return `
      <tr>
        <td><code>${escapeHtml(bot.name)}</code></td>
        <td>${escapeHtml(bot.owner)}</td>
        <td>${escapeHtml(bot.role === 'search' ? 'AI Search / Citations' : 'Model Training')}</td>
        <td>${escapeHtml(bot.label)}</td>
        <td><span class="pill ${cls}">${escapeHtml(statusText)}</span></td>
      </tr>`;
    })
    .join('');

  const sortedChecks = [...auditResult.checks].sort((a, b) => {
    const rank = { critical: 0, warning: 1, pass: 2 };
    return rank[a.severity] - rank[b.severity];
  });

  const checkRows = sortedChecks
    .map((c) => {
      return `
      <div class="check-item">
        <div class="check-head">
          <div>
            <span class="pill ${badgeClass(c.severity)}">${severityLabel(c.severity)}</span>
            <strong>${escapeHtml(c.title)}</strong>
          </div>
          <span class="pts-tag">${c.earned}/${c.maxPoints} pts</span>
        </div>
        <p class="check-detail">${escapeHtml(c.detail)}</p>
        ${c.severity !== 'pass' ? `<p class="check-fix"><strong>Fix:</strong> ${escapeHtml(c.fixHint)}</p>` : ''}
      </div>`;
    })
    .join('');

  const fixEntries = Object.entries(fixes || {});
  const fixTabs = fixEntries
    .map(([name], idx) => {
      return `<button type="button" class="tab-btn${idx === 0 ? ' active' : ''}" data-tab="fix-${idx}">${escapeHtml(name)}</button>`;
    })
    .join('');

  const fixPanels = fixEntries
    .map(([name, content], idx) => {
      return `
      <div class="tab-panel${idx === 0 ? ' active' : ''}" id="fix-${idx}">
        <div class="panel-bar">
          <code>${escapeHtml(name)}</code>
          <button type="button" class="copy-btn" data-copy-target="code-${idx}">Copy File</button>
        </div>
        <pre id="code-${idx}"><code>${escapeHtml(content)}</code></pre>
      </div>`;
    })
    .join('');

  const pageRows = (auditResult.pages || [])
    .map(
      (p) => `
      <tr>
        <td><code>${escapeHtml(p.path)}</code></td>
        <td>${p.status}</td>
        <td>${escapeHtml(p.title || '(no title)')}</td>
        <td>${p.wordCount}</td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(brand)} Audit Report — ${escapeHtml(auditResult.origin)}</title>
  <style>
    :root {
      --bg: #05080f;
      --surface: #0d1424;
      --surface-alt: #080d18;
      --ink: #f8fafc;
      --muted: #94a3b8;
      --border: rgba(148, 163, 184, 0.18);
      --accent: #10b981;
      --accent-bright: #34d399;
      --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, sans-serif;
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 70% 40% at 50% -10%, rgba(16, 185, 129, 0.14), transparent 70%),
        linear-gradient(rgba(148, 163, 184, 0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(148, 163, 184, 0.04) 1px, transparent 1px);
      background-size: 100% 100%, 48px 48px, 48px 48px;
      color: var(--ink);
      line-height: 1.55;
    }
    code, pre { font-family: var(--mono); }
    .wrap { max-width: 1100px; margin: 0 auto; padding: 32px 20px 64px; }
    .demo-banner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(52, 211, 153, 0.3);
      color: #d1fae5;
      padding: 12px 18px;
      border-radius: 12px;
      margin-bottom: 20px;
      font-size: 13px;
    }
    .back-link {
      color: #34d399;
      text-decoration: none;
      font-family: var(--mono);
      font-weight: 700;
      white-space: nowrap;
    }
    .header {
      background: linear-gradient(180deg, rgba(19, 28, 49, 0.85) 0%, rgba(9, 14, 26, 0.96) 100%);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 30px;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 24px;
      align-items: center;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
    }
    .brand-tag {
      display: inline-block;
      font-family: var(--mono);
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--accent-bright);
      margin-bottom: 8px;
    }
    h1 { margin: 0 0 8px; font-size: 28px; line-height: 1.15; letter-spacing: -0.02em; }
    .meta-line { color: var(--muted); font-size: 13.5px; margin: 0; }
    .summary-badges { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .stat-chip {
      font-family: var(--mono);
      padding: 5px 12px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      border: 1px solid var(--border);
      background: var(--surface-alt);
    }
    .score-ring-box { text-align: center; }
    .score-ring-wrap { position: relative; width: 136px; height: 136px; }
    .score-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    .score-num { font-size: 36px; font-weight: 800; line-height: 1; }
    .score-sub { font-family: var(--mono); font-size: 11.5px; color: var(--muted); margin-top: 4px; font-weight: 600; }
    .section {
      margin-top: 24px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 26px;
    }
    .section h2 { margin: 0 0 18px; font-size: 18px; letter-spacing: -0.01em; }
    .pillar-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
      gap: 14px;
    }
    .pillar-card {
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 16px;
      background: var(--surface-alt);
    }
    .pillar-top { display: flex; justify-content: space-between; font-weight: 700; font-size: 14px; margin-bottom: 10px; }
    .pillar-pts { font-family: var(--mono); color: var(--muted); font-size: 12.5px; }
    .bar-track { height: 8px; background: rgba(148, 163, 184, 0.16); border-radius: 999px; overflow: hidden; }
    .bar-fill { height: 100%; border-radius: 999px; }
    .pillar-sub { font-size: 12px; color: var(--muted); margin-top: 8px; font-family: var(--mono); }
    table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
    th, td { text-align: left; padding: 11px 12px; border-bottom: 1px solid var(--border); }
    th { font-family: var(--mono); font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
    .pill {
      display: inline-block;
      font-family: var(--mono);
      padding: 2px 9px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 700;
      margin-right: 8px;
      vertical-align: middle;
    }
    .pill-pass { background: rgba(16, 185, 129, 0.14); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }
    .pill-warn { background: rgba(245, 158, 11, 0.14); color: #fcd34d; border: 1px solid rgba(251, 191, 36, 0.3); }
    .pill-crit { background: rgba(244, 63, 94, 0.15); color: #fda4af; border: 1px solid rgba(251, 113, 133, 0.32); }
    .check-item { padding: 15px 0; border-bottom: 1px solid var(--border); }
    .check-item:last-child { border-bottom: none; }
    .check-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; }
    .pts-tag { font-family: var(--mono); font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; }
    .check-detail { margin: 6px 0 0; font-size: 13.5px; color: var(--muted); }
    .check-fix {
      margin: 8px 0 0;
      font-size: 13px;
      color: #d1fae5;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(52, 211, 153, 0.2);
      padding: 8px 12px;
      border-radius: 8px;
    }
    .tab-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
    .tab-btn {
      border: 1px solid var(--border);
      background: var(--surface-alt);
      color: var(--muted);
      padding: 7px 13px;
      border-radius: 8px;
      font-family: var(--mono);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .tab-btn.active { background: rgba(16, 185, 129, 0.16); color: var(--accent-bright); border-color: rgba(52, 211, 153, 0.35); }
    .tab-panel { display: none; }
    .tab-panel.active { display: block; }
    .panel-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #04070d;
      border: 1px solid var(--border);
      border-bottom: none;
      color: #cbd5e1;
      padding: 9px 14px;
      border-radius: 10px 10px 0 0;
      font-size: 12.5px;
    }
    .copy-btn {
      background: rgba(148, 163, 184, 0.12);
      color: #f8fafc;
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 4px 10px;
      font-family: var(--mono);
      font-size: 11.5px;
      cursor: pointer;
    }
    pre {
      margin: 0;
      background: #02050a;
      color: #a7f3d0;
      border: 1px solid var(--border);
      padding: 16px;
      border-radius: 0 0 10px 10px;
      overflow-x: auto;
      font-size: 12.5px;
      line-height: 1.55;
      max-height: 440px;
    }
    .actions-top { display: flex; gap: 10px; margin-top: 16px; }
    .print-btn {
      background: linear-gradient(180deg, #10b981 0%, #059669 100%);
      color: #03150e;
      border: none;
      padding: 9px 16px;
      border-radius: 9px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    footer { margin-top: 30px; text-align: center; font-size: 13px; color: var(--muted); }

    @media print {
      :root {
        --bg: #ffffff;
        --surface: #ffffff;
        --surface-alt: #f8fafc;
        --ink: #0f172a;
        --muted: #475569;
        --border: #cbd5e1;
      }
      body { background: #fff !important; color: #0f172a !important; }
      .header, .section { background: #fff !important; box-shadow: none !important; }
      .print-btn, .copy-btn, .tab-bar, .back-link { display: none !important; }
      .tab-panel { display: block !important; margin-bottom: 16px; }
      .check-fix { background: #f1f5f9 !important; color: #0f172a !important; border-color: #cbd5e1 !important; }
      pre { background: #f8fafc !important; color: #0f172a !important; max-height: none !important; }
      .pill-pass { background: #ecfdf5 !important; color: #065f46 !important; }
      .pill-warn { background: #fffbeb !important; color: #92400e !important; }
      .pill-crit { background: #fef2f2 !important; color: #991b1b !important; }
      .section, .header { break-inside: avoid; }
    }
    @media (max-width: 700px) {
      .header { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    ${demoBanner}
    <header class="header">
      <div>
        <span class="brand-tag">${escapeHtml(brand)} &mdash; AI Search &amp; Launch Readiness Report</span>
        <h1>${escapeHtml(auditResult.origin)}</h1>
        <p class="meta-line">
          Target: <code>${escapeHtml(auditResult.url)}</code> &middot;
          Mode: ${escapeHtml(auditResult.mode)} &middot;
          Pages Crawled: ${auditResult.meta.pagesCrawled} &middot;
          Audited: ${escapeHtml(auditResult.auditedAt)}
        </p>
        <div class="summary-badges">
          <span class="stat-chip" style="color:#fda4af;">${auditResult.summary.critical} Critical</span>
          <span class="stat-chip" style="color:#fcd34d;">${auditResult.summary.warning} Warnings</span>
          <span class="stat-chip" style="color:#34d399;">${auditResult.summary.pass} Passed</span>
        </div>
        <div class="actions-top">
          <button type="button" class="print-btn" onclick="window.print()">Save / Print as PDF</button>
        </div>
      </div>
      <div class="score-ring-box">
        <div class="score-ring-wrap">
          <svg width="136" height="136" viewBox="0 0 136 136" aria-hidden="true">
            <circle cx="68" cy="68" r="${radius}" fill="none" stroke="rgba(148,163,184,0.18)" stroke-width="12"/>
            <circle cx="68" cy="68" r="${radius}" fill="none" stroke="${color}" stroke-width="12"
              stroke-linecap="round"
              stroke-dasharray="${circumference.toFixed(2)}"
              stroke-dashoffset="${offset.toFixed(2)}"
              transform="rotate(-90 68 68)"/>
          </svg>
          <div class="score-center">
            <span class="score-num" style="color:${color};">${auditResult.score}</span>
            <span class="score-sub">Grade ${escapeHtml(auditResult.grade)} / 100</span>
          </div>
        </div>
      </div>
    </header>

    <section class="section">
      <h2>Pillar Breakdown</h2>
      <div class="pillar-grid">${pillarCards}</div>
    </section>

    <section class="section">
      <h2>AI Crawler &amp; Citation Access Matrix (robots.txt)</h2>
      <table>
        <thead>
          <tr><th>Bot</th><th>Owner</th><th>Purpose</th><th>Engine</th><th>Status</th></tr>
        </thead>
        <tbody>${crawlerRows}</tbody>
      </table>
    </section>

    <section class="section">
      <h2>36-Check Audit Findings</h2>
      ${checkRows}
    </section>

    ${
      fixEntries.length > 0
        ? `<section class="section">
      <h2>Generated Drop-In Fix Files</h2>
      <div class="tab-bar">${fixTabs}</div>
      ${fixPanels}
    </section>`
        : ''
    }

    <section class="section">
      <h2>Crawled Pages (${(auditResult.pages || []).length})</h2>
      <table>
        <thead><tr><th>Path</th><th>Status</th><th>Title</th><th>Words</th></tr></thead>
        <tbody>${pageRows}</tbody>
      </table>
    </section>

    <footer>
      Generated by ${escapeHtml(brand)} &middot; Zero-dependency AI Search (GEO) &amp; Launch Audit Engine
    </footer>
  </div>

  <script>
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach((p) => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = document.getElementById(btn.getAttribute('data-tab'));
        if (panel) panel.classList.add('active');
      });
    });
    document.querySelectorAll('.copy-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const el = document.getElementById(btn.getAttribute('data-copy-target'));
        if (!el) return;
        try {
          await navigator.clipboard.writeText(el.innerText);
          const orig = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => { btn.textContent = orig; }, 1500);
        } catch {
          btn.textContent = 'Copy manually';
        }
      });
    });
  </script>
</body>
</html>
`;
}
