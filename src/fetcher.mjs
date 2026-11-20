/**
 * Zero-dependency site fetcher & local directory loader for CiteReady.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { parseHtml } from './html-parser.mjs';

const DEFAULT_USER_AGENT = 'CiteReadyBot/1.0 (+https://citeready.eiran.tech)';
const FETCH_TIMEOUT_MS = 10000;

async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, {
      method: options.method || 'GET',
      redirect: 'follow',
      signal: AbortSignal.timeout(options.timeoutMs || FETCH_TIMEOUT_MS),
      headers: {
        'User-Agent': DEFAULT_USER_AGENT,
        Accept: options.accept || 'text/html,application/xhtml+xml,text/plain,application/xml;q=0.9,*/*;q=0.8',
        ...options.headers,
      },
    });
    const headersObj = {};
    res.headers.forEach((v, k) => {
      headersObj[k.toLowerCase()] = v;
    });
    const text = options.method === 'HEAD' ? '' : await res.text();
    return {
      ok: res.ok,
      status: res.status,
      url: res.url || url,
      headers: headersObj,
      text,
      error: null,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      url,
      headers: {},
      text: '',
      error: err?.message || 'Fetch failed',
    };
  }
}

async function checkImageUrl(imageUrl) {
  if (!imageUrl) return { checked: false, ok: false, status: 0, error: 'Missing og:image URL' };
  let res = await safeFetch(imageUrl, { method: 'HEAD', accept: 'image/*,*/*;q=0.8' });
  if (!res.ok && (res.status === 405 || res.status === 403 || res.status === 0)) {
    res = await safeFetch(imageUrl, { method: 'GET', accept: 'image/*,*/*;q=0.8' });
  }
  const ct = res.headers['content-type'] || '';
  const validType = !ct || ct.startsWith('image/') || ct.includes('svg');
  return {
    checked: true,
    ok: res.ok && validType,
    status: res.status,
    contentType: ct,
    error: res.ok ? (validType ? null : `Unexpected content-type: ${ct}`) : res.error || `HTTP ${res.status}`,
  };
}

function normalizeStartUrl(inputUrl) {
  let raw = String(inputUrl || '').trim();
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }
  const u = new URL(raw);
  if (!u.pathname) u.pathname = '/';
  return u;
}

export async function loadLiveSite(targetUrl, options = {}) {
  const maxCrawl = Math.max(1, Number.parseInt(options.crawl ?? 10, 10) || 10);
  const startUrl = normalizeStartUrl(targetUrl);
  const origin = startUrl.origin;

  const [homeRes, robotsRes, llmsRes, llmsFullRes, sitemapRes] = await Promise.all([
    safeFetch(startUrl.toString()),
    safeFetch(new URL('/robots.txt', origin).toString(), { accept: 'text/plain,*/*' }),
    safeFetch(new URL('/llms.txt', origin).toString(), { accept: 'text/markdown,text/plain,*/*' }),
    safeFetch(new URL('/llms-full.txt', origin).toString(), { accept: 'text/markdown,text/plain,*/*' }),
    safeFetch(new URL('/sitemap.xml', origin).toString(), { accept: 'application/xml,text/xml,*/*' }),
  ]);

  const homeParsed = parseHtml(homeRes.text, homeRes.url || startUrl.toString());
  const pages = [
    {
      url: startUrl.toString(),
      path: startUrl.pathname || '/',
      status: homeRes.status,
      ok: homeRes.ok,
      error: homeRes.error,
      headers: homeRes.headers,
      parsed: homeParsed,
    },
  ];

  // Crawl internal HTML pages up to maxCrawl
  if (homeRes.ok && maxCrawl > 1) {
    const queue = [];
    const seen = new Set([startUrl.toString()]);
    for (const link of homeParsed.links) {
      if (!link.internal) continue;
      if (/\.(png|jpe?g|gif|webp|svg|ico|pdf|zip|css|js|mjs|json|xml|txt|woff2?)$/i.test(link.url)) continue;
      if (!seen.has(link.url)) {
        seen.add(link.url);
        queue.push(link.url);
      }
    }

    const toFetch = queue.slice(0, maxCrawl - 1);
    const subResults = await Promise.all(toFetch.map((u) => safeFetch(u)));
    for (let i = 0; i < subResults.length; i++) {
      const r = subResults[i];
      const pageUrl = toFetch[i];
      const ct = r.headers['content-type'] || '';
      if (ct && !ct.includes('html') && !ct.includes('xhtml')) continue;
      let pathName = '/';
      try {
        pathName = new URL(pageUrl).pathname;
      } catch {
        pathName = pageUrl;
      }
      pages.push({
        url: pageUrl,
        path: pathName,
        status: r.status,
        ok: r.ok,
        error: r.error,
        headers: r.headers,
        parsed: parseHtml(r.text, r.url || pageUrl),
      });
    }
  }

  let ogImageCheck = { checked: false, ok: false, status: 0, error: 'No og:image declared' };
  const rawOgImage = homeParsed.metaMap['og:image'];
  if (rawOgImage) {
    try {
      const resolvedImg = new URL(rawOgImage, startUrl.toString()).toString();
      ogImageCheck = await checkImageUrl(resolvedImg);
    } catch {
      ogImageCheck = { checked: true, ok: false, status: 0, error: 'Invalid og:image URL' };
    }
  }

  return {
    mode: 'live',
    targetUrl: startUrl.toString(),
    origin,
    homeHeaders: homeRes.headers,
    homeOk: homeRes.ok,
    homeStatus: homeRes.status,
    homeError: homeRes.error,
    robotsTxt: { ok: robotsRes.ok && Boolean(robotsRes.text.trim()), status: robotsRes.status, text: robotsRes.text },
    llmsTxt: { ok: llmsRes.ok && Boolean(llmsRes.text.trim()), status: llmsRes.status, text: llmsRes.text },
    llmsFullTxt: { ok: llmsFullRes.ok && Boolean(llmsFullRes.text.trim()), status: llmsFullRes.status, text: llmsFullRes.text },
    sitemapXml: { ok: sitemapRes.ok && Boolean(sitemapRes.text.trim()), status: sitemapRes.status, text: sitemapRes.text },
    ogImageCheck,
    pages,
  };
}

async function readOptionalFile(filePath) {
  try {
    const text = await fs.readFile(filePath, 'utf8');
    return { ok: Boolean(text.trim()), status: 200, text };
  } catch {
    return { ok: false, status: 404, text: '' };
  }
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

async function collectHtmlFiles(rootDir, currentDir, results = []) {
  const entries = await fs.readdir(currentDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
    const full = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      await collectHtmlFiles(rootDir, full, results);
    } else if (entry.isFile() && /\.html?$/i.test(entry.name)) {
      const rel = path.relative(rootDir, full).replace(/\\/g, '/');
      if (rel === 'sample-report.html' || rel.endsWith('/citeready-report.html')) continue;
      results.push({ full, rel });
    }
  }
  return results;
}

export async function loadLocalSite(dirPath, canonicalUrl = 'https://example.com', options = {}) {
  const maxCrawl = Math.max(1, Number.parseInt(options.crawl ?? 10, 10) || 10);
  const absDir = path.resolve(dirPath);
  const startUrl = normalizeStartUrl(canonicalUrl);
  const origin = startUrl.origin;

  const indexPath = path.join(absDir, 'index.html');
  let indexText = '';
  let homeOk = true;
  let homeStatus = 200;
  let homeError = null;
  try {
    indexText = await fs.readFile(indexPath, 'utf8');
  } catch (err) {
    homeOk = false;
    homeStatus = 404;
    homeError = `Missing index.html in ${absDir}: ${err.message}`;
  }

  const [robotsTxt, llmsTxt, llmsFullTxt, sitemapXml, allHtmlFiles] = await Promise.all([
    readOptionalFile(path.join(absDir, 'robots.txt')),
    readOptionalFile(path.join(absDir, 'llms.txt')),
    readOptionalFile(path.join(absDir, 'llms-full.txt')),
    readOptionalFile(path.join(absDir, 'sitemap.xml')),
    collectHtmlFiles(absDir, absDir).catch(() => []),
  ]);

  const homeParsed = parseHtml(indexText, startUrl.toString());
  const pages = [
    {
      url: startUrl.toString(),
      path: '/',
      status: homeStatus,
      ok: homeOk,
      error: homeError,
      headers: {},
      parsed: homeParsed,
    },
  ];

  const extraHtml = allHtmlFiles
    .filter((f) => f.rel.toLowerCase() !== 'index.html')
    .slice(0, Math.max(0, maxCrawl - 1));

  for (const item of extraHtml) {
    const html = await fs.readFile(item.full, 'utf8');
    const urlPath = item.rel.endsWith('/index.html')
      ? `/${item.rel.slice(0, -'index.html'.length)}`
      : `/${item.rel}`;
    const fullUrl = new URL(urlPath, origin).toString();
    pages.push({
      url: fullUrl,
      path: urlPath,
      status: 200,
      ok: true,
      error: null,
      headers: {},
      parsed: parseHtml(html, fullUrl),
    });
  }

  let ogImageCheck = { checked: false, ok: false, status: 0, error: 'No og:image declared' };
  const rawOgImage = homeParsed.metaMap['og:image'];
  if (rawOgImage) {
    let relPath = rawOgImage;
    try {
      const u = new URL(rawOgImage, origin);
      if (u.origin === origin) {
        relPath = u.pathname.replace(/^\/+/, '');
      } else {
        relPath = '';
      }
    } catch {
      relPath = rawOgImage.replace(/^\/+/, '');
    }

    if (relPath) {
      const exists = await fileExists(path.join(absDir, relPath));
      ogImageCheck = {
        checked: true,
        ok: exists,
        status: exists ? 200 : 404,
        error: exists ? null : `Local image not found: ${relPath}`,
      };
    } else {
      ogImageCheck = {
        checked: true,
        ok: /^https?:\/\//i.test(rawOgImage),
        status: /^https?:\/\//i.test(rawOgImage) ? 200 : 0,
        error: null,
      };
    }
  }

  return {
    mode: 'local',
    dirPath: absDir,
    targetUrl: startUrl.toString(),
    origin,
    homeHeaders: {},
    homeOk,
    homeStatus,
    homeError,
    robotsTxt,
    llmsTxt,
    llmsFullTxt,
    sitemapXml,
    ogImageCheck,
    pages,
  };
}
