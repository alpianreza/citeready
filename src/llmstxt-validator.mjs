/**
 * Official llmstxt.org specification validator.
 * Spec order:
 *  1. H1 (# Title) - required
 *  2. Blockquote (> summary) - strongly recommended immediately after H1
 *  3. Optional markdown paragraphs/lists (no headings before H2 link sections)
 *  4. H2 (## Section) link lists (- [Name](url): note)
 *  5. Optional "## Optional" section
 */

export function validateLlmsTxt(content) {
  const text = String(content ?? '').trim();
  if (!text) {
    return {
      valid: false,
      score: 0,
      title: '',
      summary: '',
      sections: [],
      linkCount: 0,
      hasOptionalSection: false,
      checks: {
        hasH1: false,
        hasBlockquote: false,
        noPrematureHeadings: false,
        hasH2Sections: false,
        hasMarkdownLinks: false,
      },
      issues: ['llms.txt is empty or missing.'],
    };
  }

  const lines = text.split(/\r?\n/);
  let title = '';
  let summary = '';
  let h1Index = -1;
  let blockquoteIndex = -1;
  let firstH2Index = -1;
  let noPrematureHeadings = true;
  const sections = [];
  let currentSection = null;
  let linkCount = 0;
  let hasOptionalSection = false;
  const issues = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (h1Index === -1) {
      const h1Match = line.match(/^#\s+(.+)$/);
      if (h1Match) {
        title = h1Match[1].trim();
        h1Index = i;
        continue;
      } else {
        issues.push('First non-empty line should be an H1 heading (# Project Name).');
        h1Index = -2; // mark seen non-H1 start
      }
    }

    if (h1Index >= 0 && blockquoteIndex === -1 && firstH2Index === -1) {
      if (line.startsWith('>')) {
        summary = line.replace(/^>\s*/, '').trim();
        blockquoteIndex = i;
        continue;
      }
    }

    const h2Match = line.match(/^##\s+(.+)$/);
    if (h2Match) {
      if (firstH2Index === -1) firstH2Index = i;
      const sectionTitle = h2Match[1].trim();
      if (sectionTitle.toLowerCase() === 'optional') {
        hasOptionalSection = true;
      }
      currentSection = { title: sectionTitle, links: [] };
      sections.push(currentSection);
      continue;
    }

    const otherHeading = line.match(/^(#{1,6})\s+(.+)$/);
    if (otherHeading) {
      const level = otherHeading[1].length;
      if (firstH2Index === -1 && level >= 3) {
        noPrematureHeadings = false;
        issues.push(`Unexpected H${level} heading before first H2 link section: "${otherHeading[2]}".`);
      }
      continue;
    }

    if (currentSection) {
      const linkMatch = line.match(/^[-*]\s+\[([^\]]+)\]\(([^)]+)\)(?::\s*(.*))?$/);
      if (linkMatch) {
        linkCount += 1;
        currentSection.links.push({
          title: linkMatch[1].trim(),
          url: linkMatch[2].trim(),
          description: (linkMatch[3] || '').trim(),
        });
      }
    }
  }

  const hasH1 = Boolean(title) && h1Index >= 0;
  const hasBlockquote = Boolean(summary);
  const hasH2Sections = sections.length > 0;
  const hasMarkdownLinks = linkCount > 0;

  if (!hasH1) issues.push('Missing required H1 title (# Site Name).');
  if (!hasBlockquote) issues.push('Missing blockquote summary (> concise description) after H1.');
  if (!hasH2Sections) issues.push('Missing H2 sections (## Docs / ## Key Pages).');
  if (!hasMarkdownLinks) issues.push('No markdown list links (- [Page](https://...)) found under H2 sections.');

  const checks = {
    hasH1,
    hasBlockquote,
    noPrematureHeadings,
    hasH2Sections,
    hasMarkdownLinks,
  };

  let score = 0;
  if (hasH1) score += 25;
  if (hasBlockquote) score += 25;
  if (noPrematureHeadings) score += 10;
  if (hasH2Sections) score += 20;
  if (hasMarkdownLinks) score += 20;

  const valid = hasH1 && hasBlockquote && noPrematureHeadings && hasH2Sections && hasMarkdownLinks;

  return {
    valid,
    score,
    title,
    summary,
    sections,
    linkCount,
    hasOptionalSection,
    checks,
    issues,
  };
}
