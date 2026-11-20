/**
 * Zero-dependency HTML parser and extraction helpers for CiteReady.
 */

export function escapeHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function decodeEntities(str) {
  if (!str) return '';
  return String(str)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      const code = Number.parseInt(hex, 16);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    })
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = Number.parseInt(dec, 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : _;
    });
}

function stripTags(raw) {
  return decodeEntities(String(raw ?? '').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

export function parseAttributes(attrText) {
  const attrs = {};
  if (!attrText) return attrs;
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*(?:=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let match;
  while ((match = re.exec(attrText)) !== null) {
    const key = match[1].toLowerCase();
    const val = match[2] ?? match[3] ?? match[4] ?? '';
    attrs[key] = decodeEntities(val);
  }
  return attrs;
}

function resolveLink(href, baseUrl) {
  if (!href) return null;
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith('#') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:') ||
    trimmed.startsWith('javascript:') ||
    trimmed.startsWith('data:')
  ) {
    return null;
  }
  try {
    return new URL(trimmed, baseUrl).toString();
  } catch {
    return null;
  }
}

export function parseHtml(html, baseUrl = 'https://example.com/') {
  const source = String(html ?? '');
  const htmlBytes = Buffer.byteLength(source, 'utf8');

  let baseOrigin = '';
  try {
    baseOrigin = new URL(baseUrl).origin;
  } catch {
    baseOrigin = '';
  }

  // <html lang="...">
  const htmlTagMatch = source.match(/<html\b([^>]*)>/i);
  const htmlAttrs = htmlTagMatch ? parseAttributes(htmlTagMatch[1]) : {};
  const lang = (htmlAttrs.lang || htmlAttrs['xml:lang'] || '').trim();

  // <title>
  const titleMatch = source.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? stripTags(titleMatch[1]) : '';

  // <meta ...>
  const metas = [];
  const metaMap = {};
  const metaRe = /<meta\b([^>]*)\/?>/gi;
  let m;
  while ((m = metaRe.exec(source)) !== null) {
    const attrs = parseAttributes(m[1]);
    metas.push(attrs);
    const key = (attrs.name || attrs.property || attrs['http-equiv'] || '').toLowerCase().trim();
    if (key && attrs.content !== undefined) {
      metaMap[key] = attrs.content.trim();
    }
  }

  // <link ...>
  let canonical = '';
  let favicon = '';
  const linkRe = /<link\b([^>]*)\/?>/gi;
  while ((m = linkRe.exec(source)) !== null) {
    const attrs = parseAttributes(m[1]);
    const relTokens = (attrs.rel || '')
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);
    if (relTokens.includes('canonical') && attrs.href && !canonical) {
      canonical = attrs.href.trim();
    }
    if (
      (relTokens.includes('icon') ||
        relTokens.includes('apple-touch-icon') ||
        (relTokens.includes('shortcut') && relTokens.includes('icon'))) &&
      attrs.href &&
      !favicon
    ) {
      favicon = attrs.href.trim();
    }
  }

  // <script ...> & JSON-LD
  const jsonLdBlocks = [];
  let scriptCount = 0;
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  while ((m = scriptRe.exec(source)) !== null) {
    scriptCount += 1;
    const attrs = parseAttributes(m[1]);
    const type = (attrs.type || '').toLowerCase().split(';')[0].trim();
    if (type === 'application/ld+json') {
      const raw = m[2].trim();
      try {
        const data = JSON.parse(raw);
        jsonLdBlocks.push({ valid: true, raw, data, error: null });
      } catch (err) {
        jsonLdBlocks.push({ valid: false, raw, data: null, error: err.message });
      }
    }
  }

  // <style ...>
  let inlineStyleBytes = 0;
  const styleRe = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
  while ((m = styleRe.exec(source)) !== null) {
    inlineStyleBytes += Buffer.byteLength(m[1], 'utf8');
  }

  // Strip non-visible containers for body parsing
  const bodySource = (source.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? source)
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, ' ');

  // Headings h1..h6
  const headings = [];
  const headingRe = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  while ((m = headingRe.exec(bodySource)) !== null) {
    const text = stripTags(m[2]);
    if (text) {
      headings.push({ level: Number.parseInt(m[1], 10), text });
    }
  }

  // Images
  const images = [];
  const imgRe = /<img\b([^>]*)\/?>/gi;
  while ((m = imgRe.exec(bodySource)) !== null) {
    const attrs = parseAttributes(m[1]);
    const hasAlt = Object.prototype.hasOwnProperty.call(attrs, 'alt');
    const alt = hasAlt ? attrs.alt.trim() : '';
    const isDecorative = hasAlt && alt === '' && (attrs['aria-hidden'] === 'true' || attrs.role === 'presentation');
    images.push({
      src: attrs.src || attrs['data-src'] || '',
      alt,
      hasAlt: hasAlt && (alt.length > 0 || isDecorative),
    });
  }

  // Links
  const links = [];
  const seenUrls = new Set();
  const anchorRe = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
  while ((m = anchorRe.exec(bodySource)) !== null) {
    const attrs = parseAttributes(m[1]);
    const resolved = resolveLink(attrs.href, baseUrl);
    if (!resolved) continue;
    let internal = false;
    try {
      internal = baseOrigin ? new URL(resolved).origin === baseOrigin : false;
    } catch {
      internal = false;
    }
    const text = stripTags(m[2]);
    if (!seenUrls.has(resolved)) {
      seenUrls.add(resolved);
      links.push({ href: attrs.href, url: resolved, text, internal });
    }
  }

  // Landmarks
  const countTag = (tag) => (bodySource.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
  const landmarks = {
    main: countTag('main'),
    article: countTag('article'),
    header: countTag('header'),
    nav: countTag('nav'),
    footer: countTag('footer'),
  };

  // Visible text & word count
  const visibleText = stripTags(bodySource);
  const words = visibleText ? visibleText.split(/\s+/).filter(Boolean) : [];
  const wordCount = words.length;

  // Paragraphs & first substantial paragraph
  const paragraphs = [];
  const pRe = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
  while ((m = pRe.exec(bodySource)) !== null) {
    const text = stripTags(m[1]);
    if (text) paragraphs.push(text);
  }
  const firstParagraph = paragraphs.find((p) => p.length >= 25) || paragraphs[0] || visibleText.slice(0, 220);

  // FAQ extraction heuristics
  const faqPairs = [];
  const seenQuestions = new Set();

  // 1) <details><summary>Q</summary>A</details>
  const detailsRe = /<details\b[^>]*>[\s\S]*?<summary\b[^>]*>([\s\S]*?)<\/summary>([\s\S]*?)<\/details>/gi;
  while ((m = detailsRe.exec(bodySource)) !== null) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a && !seenQuestions.has(q)) {
      seenQuestions.add(q);
      faqPairs.push({ question: q, answer: a });
    }
  }

  // 2) Heading ending with '?' followed immediately by <p> or <div>
  const qHeadingRe = /<h[2-4]\b[^>]*>([\s\S]*?\?)<\/h[2-4]>\s*(?:<p\b[^>]*>([\s\S]*?)<\/p>|<div\b[^>]*>([\s\S]*?)<\/div>)/gi;
  while ((m = qHeadingRe.exec(bodySource)) !== null) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2] ?? m[3]);
    if (q && a && !seenQuestions.has(q)) {
      seenQuestions.add(q);
      faqPairs.push({ question: q, answer: a });
    }
  }

  // 3) <dt>Q</dt><dd>A</dd>
  const dtddRe = /<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi;
  while ((m = dtddRe.exec(bodySource)) !== null) {
    const q = stripTags(m[1]);
    const a = stripTags(m[2]);
    if (q && a && !seenQuestions.has(q)) {
      seenQuestions.add(q);
      faqPairs.push({ question: q, answer: a });
    }
  }

  const robotsMeta = `${metaMap.robots || ''} ${metaMap.googlebot || ''}`.toLowerCase();
  const noindex = /\bnoindex\b/.test(robotsMeta);
  const hasViewport = Boolean(metaMap.viewport);

  return {
    lang,
    title,
    metas,
    metaMap,
    canonical,
    favicon,
    jsonLdBlocks,
    headings,
    images,
    links,
    landmarks,
    hasViewport,
    noindex,
    visibleText,
    wordCount,
    paragraphs,
    firstParagraph,
    faqPairs,
    scriptCount,
    inlineStyleBytes,
    htmlBytes,
  };
}
