/**
 * 36-check weighted audit engine across 6 pillars (100 points total).
 */

import { parseRobotsTxt, evaluateAiCrawlers } from './robots-parser.mjs';
import { validateLlmsTxt } from './llmstxt-validator.mjs';

export const PILLAR_DEFS = [
  { id: 'geo', name: 'AI Search & GEO', maxPoints: 30 },
  { id: 'crawlers', name: 'AI Crawler Policy', maxPoints: 20 },
  { id: 'schema', name: 'Structured Data (JSON-LD)', maxPoints: 15 },
  { id: 'seo', name: 'Technical SEO', maxPoints: 15 },
  { id: 'social', name: 'Social & Open Graph', maxPoints: 10 },
  { id: 'quality', name: 'Quality & Signals', maxPoints: 10 },
];

function extractSchemaTypes(jsonLdBlocks) {
  const types = new Set();
  const contexts = [];
  let hasFaqSchema = false;

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (node['@context']) {
      contexts.push(String(node['@context']));
    }
    const rawType = node['@type'];
    if (typeof rawType === 'string') {
      types.add(rawType);
      if (rawType.toLowerCase() === 'faqpage') hasFaqSchema = true;
    } else if (Array.isArray(rawType)) {
      for (const t of rawType) {
        if (typeof t === 'string') {
          types.add(t);
          if (t.toLowerCase() === 'faqpage') hasFaqSchema = true;
        }
      }
    }
    if (Array.isArray(node['@graph'])) {
      node['@graph'].forEach(visit);
    }
  };

  for (const block of jsonLdBlocks) {
    if (block.valid && block.data) {
      visit(block.data);
    }
  }

  return { types, contexts, hasFaqSchema };
}

function checkHeadingHierarchy(headings) {
  if (!headings || headings.length === 0) return { ok: false, reason: 'No headings found.' };
  let prev = headings[0].level;
  if (prev !== 1) {
    return { ok: false, reason: `First heading is <h${prev}> instead of <h1>.` };
  }
  for (let i = 1; i < headings.length; i++) {
    const curr = headings[i].level;
    if (curr - prev > 1) {
      return { ok: false, reason: `Skipped heading level from <h${prev}> to <h${curr}>.` };
    }
    prev = curr;
  }
  return { ok: true, reason: 'Sequential heading hierarchy.' };
}

function gradeFromScore(score) {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 65) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function auditSite(siteData) {
  const home = siteData.pages[0];
  const parsed = home.parsed;
  const meta = parsed.metaMap;
  const checks = [];

  const addCheck = ({ id, pillar, title, maxPoints, earned, status, severity, detail, fixHint }) => {
    checks.push({
      id,
      pillar,
      title,
      maxPoints,
      earned,
      status, // 'pass' | 'warn' | 'fail'
      severity, // 'pass' | 'warning' | 'critical'
      detail,
      fixHint,
    });
  };

  // =========================================================================
  // 1. GEO / AI SEARCH READINESS (7 checks, 30 pts)
  // =========================================================================
  const llmsVal = validateLlmsTxt(siteData.llmsTxt.ok ? siteData.llmsTxt.text : '');

  addCheck({
    id: 'geo-llms-exists',
    pillar: 'geo',
    title: '/llms.txt file exists',
    maxPoints: 7,
    earned: siteData.llmsTxt.ok ? 7 : 0,
    status: siteData.llmsTxt.ok ? 'pass' : 'fail',
    severity: siteData.llmsTxt.ok ? 'pass' : 'critical',
    detail: siteData.llmsTxt.ok
      ? `Found /llms.txt (${siteData.llmsTxt.text.length} chars).`
      : `Missing /llms.txt (status ${siteData.llmsTxt.status}). AI assistants look here for curated Markdown context.`,
    fixHint: 'Drop the generated llms.txt into your site root (/llms.txt).',
  });

  addCheck({
    id: 'geo-llms-spec',
    pillar: 'geo',
    title: 'llms.txt follows llmstxt.org spec',
    maxPoints: 6,
    earned: llmsVal.valid ? 6 : siteData.llmsTxt.ok && llmsVal.score >= 50 ? 3 : 0,
    status: llmsVal.valid ? 'pass' : siteData.llmsTxt.ok && llmsVal.score >= 50 ? 'warn' : 'fail',
    severity: llmsVal.valid ? 'pass' : siteData.llmsTxt.ok ? 'warning' : 'critical',
    detail: llmsVal.valid
      ? `Valid llmstxt.org structure: H1 "${llmsVal.title}", blockquote summary, ${llmsVal.sections.length} H2 section(s), ${llmsVal.linkCount} link(s).`
      : `Spec issues: ${llmsVal.issues.join(' ')}`,
    fixHint: 'Ensure llms.txt starts with # Title, > Blockquote summary, and ## Section markdown links.',
  });

  addCheck({
    id: 'geo-llms-full',
    pillar: 'geo',
    title: '/llms-full.txt deep context pack exists',
    maxPoints: 4,
    earned: siteData.llmsFullTxt.ok ? 4 : 0,
    status: siteData.llmsFullTxt.ok ? 'pass' : 'fail',
    severity: siteData.llmsFullTxt.ok ? 'pass' : 'warning',
    detail: siteData.llmsFullTxt.ok
      ? `Found /llms-full.txt (${siteData.llmsFullTxt.text.length} chars).`
      : 'No /llms-full.txt found for deep single-fetch LLM ingestion.',
    fixHint: 'Publish the generated llms-full.txt alongside /llms.txt.',
  });

  const hasClearIntro = parsed.firstParagraph && parsed.firstParagraph.length >= 45;
  addCheck({
    id: 'geo-opening-summary',
    pillar: 'geo',
    title: 'Clear opening summary paragraph',
    maxPoints: 4,
    earned: hasClearIntro ? 4 : parsed.firstParagraph ? 2 : 0,
    status: hasClearIntro ? 'pass' : parsed.firstParagraph ? 'warn' : 'fail',
    severity: hasClearIntro ? 'pass' : 'warning',
    detail: hasClearIntro
      ? `Extractable opening copy (${parsed.firstParagraph.length} chars).`
      : 'First <p> paragraph is missing or too short for clean AI snippet extraction.',
    fixHint: 'Place a concise, factual 1–2 sentence definition of your product near the top of <main>.',
  });

  const hasLandmarks = parsed.landmarks.main > 0 || parsed.landmarks.article > 0;
  addCheck({
    id: 'geo-landmarks',
    pillar: 'geo',
    title: 'Semantic HTML landmarks (<main> / <article>)',
    maxPoints: 3,
    earned: hasLandmarks ? 3 : 0,
    status: hasLandmarks ? 'pass' : 'fail',
    severity: hasLandmarks ? 'pass' : 'warning',
    detail: hasLandmarks
      ? `Found <main>: ${parsed.landmarks.main}, <article>: ${parsed.landmarks.article}.`
      : 'No <main> or <article> semantic landmark found.',
    fixHint: 'Wrap primary page content inside <main> and structured sections in <article> or <section>.',
  });

  const deepContent = parsed.wordCount >= 150;
  addCheck({
    id: 'geo-content-depth',
    pillar: 'geo',
    title: 'Adequate indexable copy (>= 150 words)',
    maxPoints: 3,
    earned: deepContent ? 3 : parsed.wordCount >= 60 ? 1 : 0,
    status: deepContent ? 'pass' : parsed.wordCount >= 60 ? 'warn' : 'fail',
    severity: deepContent ? 'pass' : 'warning',
    detail: `Detected ${parsed.wordCount} visible words on the homepage.`,
    fixHint: 'Add descriptive, server-rendered product copy, use-cases, and concrete facts (>=150 words).',
  });

  const hasFaq = parsed.faqPairs.length >= 2;
  addCheck({
    id: 'geo-faq-extractability',
    pillar: 'geo',
    title: 'Extractable FAQ / Q&A content',
    maxPoints: 3,
    earned: hasFaq ? 3 : parsed.faqPairs.length === 1 ? 1 : 0,
    status: hasFaq ? 'pass' : parsed.faqPairs.length === 1 ? 'warn' : 'fail',
    severity: hasFaq ? 'pass' : 'warning',
    detail: `Detected ${parsed.faqPairs.length} Q&A pair(s) in HTML.`,
    fixHint: 'Add a concise FAQ section using <details>/<summary> or question headings paired with direct answers.',
  });

  // =========================================================================
  // 2. AI CRAWLER POLICY (8 checks, 20 pts)
  // =========================================================================
  const parsedRobots = parseRobotsTxt(siteData.robotsTxt.text);
  const crawlerEval = evaluateAiCrawlers(parsedRobots);
  const botByName = Object.fromEntries(crawlerEval.bots.map((b) => [b.name, b]));

  addCheck({
    id: 'crawl-robots-exists',
    pillar: 'crawlers',
    title: '/robots.txt exists',
    maxPoints: 3,
    earned: siteData.robotsTxt.ok ? 3 : 0,
    status: siteData.robotsTxt.ok ? 'pass' : 'fail',
    severity: siteData.robotsTxt.ok ? 'pass' : 'critical',
    detail: siteData.robotsTxt.ok
      ? `Found /robots.txt (${siteData.robotsTxt.text.length} chars).`
      : 'Missing /robots.txt. Crawlers lack explicit directives and sitemap discovery.',
    fixHint: 'Deploy the generated robots.txt to your domain root.',
  });

  const hasSitemapInRobots = crawlerEval.sitemaps.length > 0;
  addCheck({
    id: 'crawl-sitemap-ref',
    pillar: 'crawlers',
    title: 'Sitemap declared in robots.txt',
    maxPoints: 2,
    earned: hasSitemapInRobots ? 2 : 0,
    status: hasSitemapInRobots ? 'pass' : 'fail',
    severity: hasSitemapInRobots ? 'pass' : 'warning',
    detail: hasSitemapInRobots
      ? `Declared sitemap(s): ${crawlerEval.sitemaps.join(', ')}`
      : 'No Sitemap: line found inside robots.txt.',
    fixHint: `Add "Sitemap: ${siteData.origin}/sitemap.xml" to robots.txt.`,
  });

  const checkSearchBot = (id, botName, points = 3) => {
    const bot = botByName[botName];
    const allowed = Boolean(bot?.allowed);
    addCheck({
      id,
      pillar: 'crawlers',
      title: `${botName} allowed (${bot?.label || 'AI Search'})`,
      maxPoints: points,
      earned: allowed ? points : 0,
      status: allowed ? 'pass' : 'fail',
      severity: allowed ? 'pass' : 'critical',
      detail: allowed
        ? `${botName} is ${bot.explicit ? 'explicitly allowed' : 'allowed via wildcard/default'}.`
        : `${botName} is BLOCKED (${bot?.matchedRule || 'Disallow'}). Your site cannot be cited by this engine.`,
      fixHint: `Add "User-agent: ${botName}\\nAllow: /" to robots.txt.`,
    });
  };

  checkSearchBot('crawl-oai-search', 'OAI-SearchBot', 3);
  checkSearchBot('crawl-chatgpt-user', 'ChatGPT-User', 3);
  checkSearchBot('crawl-perplexity', 'PerplexityBot', 3);
  checkSearchBot('crawl-claude', 'ClaudeBot', 3);

  const explicitSearchPolicy =
    botByName['OAI-SearchBot']?.explicit &&
    botByName['PerplexityBot']?.explicit &&
    botByName['ClaudeBot']?.explicit;
  addCheck({
    id: 'crawl-explicit-policy',
    pillar: 'crawlers',
    title: 'Explicit AI crawler rules configured',
    maxPoints: 2,
    earned: explicitSearchPolicy ? 2 : siteData.robotsTxt.ok ? 1 : 0,
    status: explicitSearchPolicy ? 'pass' : siteData.robotsTxt.ok ? 'warn' : 'fail',
    severity: explicitSearchPolicy ? 'pass' : 'warning',
    detail: explicitSearchPolicy
      ? 'Explicit rules defined for major AI search crawlers (separating citation search from training).'
      : 'AI crawlers rely on implicit fallback rules instead of explicit User-agent directives.',
    fixHint: 'Explicitly allow OAI-SearchBot, ChatGPT-User, PerplexityBot, and ClaudeBot in robots.txt.',
  });

  addCheck({
    id: 'crawl-no-blanket-block',
    pillar: 'crawlers',
    title: 'No blanket User-agent: * Disallow: /',
    maxPoints: 1,
    earned: crawlerEval.wildcardBlocked ? 0 : 1,
    status: crawlerEval.wildcardBlocked ? 'fail' : 'pass',
    severity: crawlerEval.wildcardBlocked ? 'critical' : 'pass',
    detail: crawlerEval.wildcardBlocked
      ? 'Wildcard User-agent: * has Disallow: / — blocking search engines and AI bots globally.'
      : 'Wildcard crawler access is open.',
    fixHint: 'Remove Disallow: / under User-agent: * and only disallow private admin paths.',
  });

  // =========================================================================
  // 3. STRUCTURED DATA / JSON-LD (6 checks, 15 pts)
  // =========================================================================
  const hasJsonLd = parsed.jsonLdBlocks.length > 0;
  const allJsonLdValid = hasJsonLd && parsed.jsonLdBlocks.every((b) => b.valid);
  const { types: schemaTypes, contexts: schemaContexts, hasFaqSchema } = extractSchemaTypes(parsed.jsonLdBlocks);
  const hasSchemaOrgContext = schemaContexts.some((c) => /schema\.org/i.test(c));
  const hasOrgOrPerson = schemaTypes.has('Organization') || schemaTypes.has('Person') || schemaTypes.has('LocalBusiness');
  const hasSiteOrProduct =
    schemaTypes.has('WebSite') ||
    schemaTypes.has('SoftwareApplication') ||
    schemaTypes.has('WebApplication') ||
    schemaTypes.has('Product') ||
    schemaTypes.has('Service');

  addCheck({
    id: 'schema-present',
    pillar: 'schema',
    title: 'JSON-LD structured data present',
    maxPoints: 3,
    earned: hasJsonLd ? 3 : 0,
    status: hasJsonLd ? 'pass' : 'fail',
    severity: hasJsonLd ? 'pass' : 'critical',
    detail: hasJsonLd
      ? `Found ${parsed.jsonLdBlocks.length} JSON-LD block(s). Types: ${[...schemaTypes].join(', ') || 'none'}.`
      : 'No <script type="application/ld+json"> found on homepage.',
    fixHint: 'Embed the generated jsonld-snippets.html inside <head>.',
  });

  addCheck({
    id: 'schema-valid-json',
    pillar: 'schema',
    title: 'All JSON-LD blocks are valid JSON',
    maxPoints: 3,
    earned: allJsonLdValid ? 3 : 0,
    status: allJsonLdValid ? 'pass' : 'fail',
    severity: allJsonLdValid ? 'pass' : hasJsonLd ? 'critical' : 'warning',
    detail: allJsonLdValid
      ? 'All JSON-LD blocks parsed cleanly.'
      : hasJsonLd
        ? `Invalid JSON-LD syntax: ${parsed.jsonLdBlocks.find((b) => !b.valid)?.error || 'parse error'}`
        : 'No JSON-LD blocks to validate.',
    fixHint: 'Validate all JSON-LD blocks with JSON.parse before deploying.',
  });

  addCheck({
    id: 'schema-context',
    pillar: 'schema',
    title: '@context uses schema.org',
    maxPoints: 2,
    earned: hasSchemaOrgContext ? 2 : 0,
    status: hasSchemaOrgContext ? 'pass' : 'fail',
    severity: hasSchemaOrgContext ? 'pass' : 'warning',
    detail: hasSchemaOrgContext
      ? `Detected @context: ${schemaContexts[0]}`
      : 'Missing "@context": "https://schema.org" in JSON-LD.',
    fixHint: 'Include "@context": "https://schema.org" at the root of each JSON-LD entity.',
  });

  addCheck({
    id: 'schema-org-entity',
    pillar: 'schema',
    title: 'Organization or Person entity schema',
    maxPoints: 3,
    earned: hasOrgOrPerson ? 3 : 0,
    status: hasOrgOrPerson ? 'pass' : 'fail',
    severity: hasOrgOrPerson ? 'pass' : 'warning',
    detail: hasOrgOrPerson
      ? 'Organization/Person identity schema detected for entity disambiguation.'
      : 'Missing Organization or Person schema.',
    fixHint: 'Add an Organization JSON-LD schema with name, url, logo, and sameAs links.',
  });

  addCheck({
    id: 'schema-site-product',
    pillar: 'schema',
    title: 'WebSite / SoftwareApplication / Product schema',
    maxPoints: 2,
    earned: hasSiteOrProduct ? 2 : 0,
    status: hasSiteOrProduct ? 'pass' : 'fail',
    severity: hasSiteOrProduct ? 'pass' : 'warning',
    detail: hasSiteOrProduct
      ? 'Product/Site schema present.'
      : 'Missing WebSite, SoftwareApplication, or Product schema.',
    fixHint: 'Add SoftwareApplication or Product schema with pricing offers.',
  });

  addCheck({
    id: 'schema-faq',
    pillar: 'schema',
    title: 'FAQPage JSON-LD schema',
    maxPoints: 2,
    earned: hasFaqSchema ? 2 : 0,
    status: hasFaqSchema ? 'pass' : 'fail',
    severity: hasFaqSchema ? 'pass' : 'warning',
    detail: hasFaqSchema
      ? 'FAQPage schema detected for direct answer extraction.'
      : 'No FAQPage JSON-LD schema detected.',
    fixHint: 'Add FAQPage JSON-LD mirroring your visible FAQ questions and answers.',
  });

  // =========================================================================
  // 4. TECHNICAL SEO (7 checks, 15 pts)
  // =========================================================================
  const titleLen = parsed.title.length;
  const titleGood = titleLen >= 20 && titleLen <= 68;
  addCheck({
    id: 'seo-title',
    pillar: 'seo',
    title: '<title> tag present & optimal length (20–68 chars)',
    maxPoints: 2,
    earned: titleGood ? 2 : titleLen > 0 ? 1 : 0,
    status: titleGood ? 'pass' : titleLen > 0 ? 'warn' : 'fail',
    severity: titleGood ? 'pass' : titleLen > 0 ? 'warning' : 'critical',
    detail: titleLen > 0 ? `Title (${titleLen} chars): "${parsed.title}"` : 'Missing <title> tag.',
    fixHint: 'Write a descriptive 45–65 character <title> including your brand and primary outcome.',
  });

  const desc = meta.description || '';
  const descLen = desc.length;
  const descGood = descLen >= 70 && descLen <= 165;
  addCheck({
    id: 'seo-description',
    pillar: 'seo',
    title: '<meta name="description"> present & optimal (70–165 chars)',
    maxPoints: 2,
    earned: descGood ? 2 : descLen > 0 ? 1 : 0,
    status: descGood ? 'pass' : descLen > 0 ? 'warn' : 'fail',
    severity: descGood ? 'pass' : descLen > 0 ? 'warning' : 'critical',
    detail: descLen > 0 ? `Meta description (${descLen} chars).` : 'Missing <meta name="description">.',
    fixHint: 'Add a 120–160 character <meta name="description"> summarizing who the product helps.',
  });

  const h1Count = parsed.headings.filter((h) => h.level === 1).length;
  const hierarchy = checkHeadingHierarchy(parsed.headings);
  const headingsPerfect = h1Count === 1 && hierarchy.ok;
  addCheck({
    id: 'seo-headings',
    pillar: 'seo',
    title: 'Single <h1> & clean heading hierarchy',
    maxPoints: 3,
    earned: headingsPerfect ? 3 : h1Count === 1 || hierarchy.ok ? 1 : 0,
    status: headingsPerfect ? 'pass' : h1Count > 0 ? 'warn' : 'fail',
    severity: headingsPerfect ? 'pass' : h1Count === 0 ? 'critical' : 'warning',
    detail: `Found ${h1Count} <h1> tag(s). ${hierarchy.reason}`,
    fixHint: 'Use exactly one <h1> for the hero headline and nest <h2>/<h3> sequentially.',
  });

  let canonicalValid = false;
  if (parsed.canonical) {
    try {
      const cu = new URL(parsed.canonical, siteData.targetUrl);
      canonicalValid = /^https?:$/i.test(cu.protocol);
    } catch {
      canonicalValid = false;
    }
  }
  addCheck({
    id: 'seo-canonical',
    pillar: 'seo',
    title: 'Valid <link rel="canonical">',
    maxPoints: 2,
    earned: canonicalValid ? 2 : 0,
    status: canonicalValid ? 'pass' : 'fail',
    severity: canonicalValid ? 'pass' : 'warning',
    detail: canonicalValid ? `Canonical: ${parsed.canonical}` : 'Missing or invalid <link rel="canonical">.',
    fixHint: `Add <link rel="canonical" href="${siteData.targetUrl}"> inside <head>.`,
  });

  addCheck({
    id: 'seo-lang',
    pillar: 'seo',
    title: '<html lang="..."> attribute declared',
    maxPoints: 1,
    earned: parsed.lang ? 1 : 0,
    status: parsed.lang ? 'pass' : 'fail',
    severity: parsed.lang ? 'pass' : 'warning',
    detail: parsed.lang ? `<html lang="${parsed.lang}">` : 'Missing lang attribute on <html>.',
    fixHint: 'Set <html lang="en"> (or your primary page language).',
  });

  const sitemapValid =
    siteData.sitemapXml.ok &&
    (/<urlset\b/i.test(siteData.sitemapXml.text) || /<sitemapindex\b/i.test(siteData.sitemapXml.text));
  addCheck({
    id: 'seo-sitemap',
    pillar: 'seo',
    title: '/sitemap.xml exists & valid XML',
    maxPoints: 3,
    earned: sitemapValid ? 3 : siteData.sitemapXml.ok ? 1 : 0,
    status: sitemapValid ? 'pass' : siteData.sitemapXml.ok ? 'warn' : 'fail',
    severity: sitemapValid ? 'pass' : 'warning',
    detail: sitemapValid
      ? 'Valid XML sitemap detected at /sitemap.xml.'
      : siteData.sitemapXml.ok
        ? '/sitemap.xml returned content but lacks <urlset> or <sitemapindex>.'
        : 'Missing /sitemap.xml.',
    fixHint: 'Publish a valid XML sitemap listing all canonical indexable URLs.',
  });

  addCheck({
    id: 'seo-indexable',
    pillar: 'seo',
    title: 'No accidental noindex directive',
    maxPoints: 2,
    earned: parsed.noindex ? 0 : 2,
    status: parsed.noindex ? 'fail' : 'pass',
    severity: parsed.noindex ? 'critical' : 'pass',
    detail: parsed.noindex
      ? 'Homepage has <meta name="robots" content="...noindex...">! Engines and AI search will drop it.'
      : 'Page is indexable (no noindex meta detected).',
    fixHint: 'Remove noindex from production <meta name="robots"> tags.',
  });

  // =========================================================================
  // 5. SOCIAL & OPEN GRAPH (4 checks, 10 pts)
  // =========================================================================
  const hasOgTitle = Boolean(meta['og:title']);
  const hasOgDesc = Boolean(meta['og:description']);
  addCheck({
    id: 'social-og-core',
    pillar: 'social',
    title: 'og:title & og:description set',
    maxPoints: 2,
    earned: hasOgTitle && hasOgDesc ? 2 : hasOgTitle || hasOgDesc ? 1 : 0,
    status: hasOgTitle && hasOgDesc ? 'pass' : hasOgTitle || hasOgDesc ? 'warn' : 'fail',
    severity: hasOgTitle && hasOgDesc ? 'pass' : 'warning',
    detail: `og:title: ${hasOgTitle ? 'present' : 'missing'}, og:description: ${hasOgDesc ? 'present' : 'missing'}.`,
    fixHint: 'Add og:title and og:description meta tags using the generated head-meta-patch.html.',
  });

  const hasOgImg = Boolean(meta['og:image']);
  const ogImgOk = hasOgImg && siteData.ogImageCheck.ok;
  addCheck({
    id: 'social-og-image',
    pillar: 'social',
    title: 'og:image present & reachable (HTTP 200)',
    maxPoints: 4,
    earned: ogImgOk ? 4 : hasOgImg ? 1 : 0,
    status: ogImgOk ? 'pass' : hasOgImg ? 'warn' : 'fail',
    severity: ogImgOk ? 'pass' : hasOgImg ? 'critical' : 'warning',
    detail: ogImgOk
      ? `og:image verified (${meta['og:image']}).`
      : hasOgImg
        ? `og:image declared (${meta['og:image']}) but failed verification: ${siteData.ogImageCheck.error}`
        : 'Missing og:image meta tag.',
    fixHint: 'Set og:image to a live 1200x630 image returning HTTP 200.',
  });

  const hasOgUrl = Boolean(meta['og:url']);
  const hasOgType = Boolean(meta['og:type']);
  addCheck({
    id: 'social-og-meta',
    pillar: 'social',
    title: 'og:url & og:type configured',
    maxPoints: 2,
    earned: hasOgUrl && hasOgType ? 2 : hasOgUrl || hasOgType ? 1 : 0,
    status: hasOgUrl && hasOgType ? 'pass' : hasOgUrl || hasOgType ? 'warn' : 'fail',
    severity: hasOgUrl && hasOgType ? 'pass' : 'warning',
    detail: `og:url: ${hasOgUrl ? meta['og:url'] : 'missing'}, og:type: ${hasOgType ? meta['og:type'] : 'missing'}.`,
    fixHint: 'Include og:url and og:type="website" in <head>.',
  });

  const hasTwCard = Boolean(meta['twitter:card']);
  const hasTwTitle = Boolean(meta['twitter:title'] || meta['og:title']);
  addCheck({
    id: 'social-twitter',
    pillar: 'social',
    title: 'Twitter Card metadata (twitter:card + title)',
    maxPoints: 2,
    earned: hasTwCard && hasTwTitle ? 2 : hasTwCard || hasTwTitle ? 1 : 0,
    status: hasTwCard && hasTwTitle ? 'pass' : hasTwCard || hasTwTitle ? 'warn' : 'fail',
    severity: hasTwCard && hasTwTitle ? 'pass' : 'warning',
    detail: `twitter:card: ${meta['twitter:card'] || 'missing'}.`,
    fixHint: 'Add <meta name="twitter:card" content="summary_large_image"> and twitter:title/description/image.',
  });

  // =========================================================================
  // 6. QUALITY & SIGNALS (4 checks, 10 pts)
  // =========================================================================
  const isHttps = siteData.targetUrl.startsWith('https://') || /^https:\/\//i.test(parsed.canonical);
  addCheck({
    id: 'quality-https',
    pillar: 'quality',
    title: 'HTTPS canonical origin',
    maxPoints: 2,
    earned: isHttps ? 2 : 0,
    status: isHttps ? 'pass' : 'fail',
    severity: isHttps ? 'pass' : 'warning',
    detail: isHttps ? `HTTPS active (${siteData.origin}).` : 'Target URL uses plain HTTP instead of HTTPS.',
    fixHint: 'Serve your site over HTTPS and use https:// URLs in canonical and OG tags.',
  });

  const hasFavicon = Boolean(parsed.favicon);
  addCheck({
    id: 'quality-mobile-brand',
    pillar: 'quality',
    title: 'Responsive viewport & favicon configured',
    maxPoints: 3,
    earned: parsed.hasViewport && hasFavicon ? 3 : parsed.hasViewport || hasFavicon ? 1 : 0,
    status: parsed.hasViewport && hasFavicon ? 'pass' : parsed.hasViewport || hasFavicon ? 'warn' : 'fail',
    severity: parsed.hasViewport && hasFavicon ? 'pass' : 'warning',
    detail: `viewport: ${parsed.hasViewport ? 'present' : 'missing'}, favicon: ${hasFavicon ? parsed.favicon : 'missing'}.`,
    fixHint: 'Ensure <meta name="viewport" content="width=device-width, initial-scale=1.0"> and a favicon <link>.',
  });

  const totalImgs = parsed.images.length;
  const imgsWithAlt = parsed.images.filter((i) => i.hasAlt).length;
  const altRatio = totalImgs === 0 ? 1 : imgsWithAlt / totalImgs;
  addCheck({
    id: 'quality-alt',
    pillar: 'quality',
    title: 'Image alt attribute coverage (>= 90%)',
    maxPoints: 3,
    earned: altRatio >= 0.9 ? 3 : altRatio >= 0.5 ? 1 : 0,
    status: altRatio >= 0.9 ? 'pass' : altRatio >= 0.5 ? 'warn' : 'fail',
    severity: altRatio >= 0.9 ? 'pass' : 'warning',
    detail:
      totalImgs === 0
        ? 'No <img> tags found (or SVG icons used).'
        : `${imgsWithAlt}/${totalImgs} images have alt text (${Math.round(altRatio * 100)}%).`,
    fixHint: 'Add descriptive alt attributes to every meaningful <img> tag.',
  });

  const htmlKb = Math.round((parsed.htmlBytes / 1024) * 10) / 10;
  const lightHtml = parsed.htmlBytes > 0 && parsed.htmlBytes < 250 * 1024;
  const hasSecurityHeader =
    siteData.mode === 'local'
      ? true
      : Boolean(
          siteData.homeHeaders['strict-transport-security'] ||
            siteData.homeHeaders['x-content-type-options'] ||
            siteData.homeHeaders['x-frame-options'] ||
            siteData.homeHeaders['content-security-policy'] ||
            siteData.homeHeaders['cache-control']
        );
  addCheck({
    id: 'quality-weight-headers',
    pillar: 'quality',
    title: 'Lean HTML payload (< 250 KB) & delivery signals',
    maxPoints: 2,
    earned: lightHtml && hasSecurityHeader ? 2 : lightHtml ? 1 : 0,
    status: lightHtml && hasSecurityHeader ? 'pass' : lightHtml ? 'warn' : 'fail',
    severity: lightHtml && hasSecurityHeader ? 'pass' : 'warning',
    detail:
      siteData.mode === 'local'
        ? `HTML size ${htmlKb} KB (local static mode: HTTP response headers skipped).`
        : `HTML size ${htmlKb} KB; security/cache headers: ${hasSecurityHeader ? 'detected' : 'none detected'}.`,
    fixHint: 'Keep initial HTML under 250 KB and enable security/caching headers on your host.',
  });

  // =========================================================================
  // AGGREGATE PILLARS & OVERALL SCORE
  // =========================================================================
  const pillars = PILLAR_DEFS.map((def) => {
    const pChecks = checks.filter((c) => c.pillar === def.id);
    const earned = pChecks.reduce((acc, c) => acc + c.earned, 0);
    const maxPoints = pChecks.reduce((acc, c) => acc + c.maxPoints, 0);
    const pct = maxPoints > 0 ? Math.round((earned / maxPoints) * 100) : 0;
    return {
      id: def.id,
      name: def.name,
      earned,
      maxPoints,
      pct,
      passed: pChecks.filter((c) => c.status === 'pass').length,
      total: pChecks.length,
    };
  });

  const score = Math.round(pillars.reduce((acc, p) => acc + p.earned, 0));
  const summary = {
    totalChecks: checks.length,
    critical: checks.filter((c) => c.severity === 'critical').length,
    warning: checks.filter((c) => c.severity === 'warning').length,
    pass: checks.filter((c) => c.severity === 'pass').length,
  };

  return {
    url: siteData.targetUrl,
    origin: siteData.origin,
    mode: siteData.mode,
    auditedAt: new Date().toISOString(),
    score,
    grade: gradeFromScore(score),
    pillars,
    checks,
    summary,
    crawlers: crawlerEval,
    llmsValidation: llmsVal,
    meta: {
      title: parsed.title,
      description: desc,
      h1: parsed.headings.find((h) => h.level === 1)?.text || '',
      wordCount: parsed.wordCount,
      pagesCrawled: siteData.pages.length,
    },
    pages: siteData.pages.map((p) => ({
      url: p.url,
      path: p.path,
      status: p.status,
      title: p.parsed.title,
      wordCount: p.parsed.wordCount,
      h1: p.parsed.headings.find((h) => h.level === 1)?.text || '',
    })),
  };
}
