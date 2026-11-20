/**
 * Deterministic release packager for CiteReady Pro & Free Lite ZIP distributions.
 * Uses Python 3 built-in zipfile module so zero external npm dependencies are required.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT, 'dist');
const STAGE_DIR = path.join(ROOT, 'tmp-package-stage');

const QUICKSTART_PRO = `# CiteReady Pro v1.0.0 — Quick Start

Thank you for picking up **CiteReady Pro**!

## Requirements
- **Node.js 18+** (zero \`npm install\` needed — zero external dependencies)

## 1. Run Your First Full Audit & Generate All 6 Fix Files
\`\`\`bash
node bin/citeready.mjs https://yourdomain.com --fix --out ./citeready-output
\`\`\`

## 2. White-Label Client Report (HTML + Print-to-PDF)
\`\`\`bash
node bin/citeready.mjs https://client.com --fix --brand "Your Studio" --out ./client-audit
\`\`\`
Open \`citeready-report.html\` in your browser and click **Save / Print as PDF**.

## 3. Audit a Local Static Build Before Deploying + CI Score Gate
\`\`\`bash
node bin/citeready.mjs --dir ./dist --url https://yourdomain.com --fix --min-score 85
\`\`\`
See \`.github/workflows/citeready-gate.yml\` for a ready-to-use GitHub Actions workflow.
`;

const README_LITE = `# CiteReady Free Lite v1.0.0

Zero-dependency AI Search (GEO), \`llms.txt\`, AI crawler \`robots.txt\`, JSON-LD & Technical SEO auditor.

## Requirements
- **Node.js 18+** (zero \`npm install\` required)

## Usage
\`\`\`bash
# Audit a live homepage (36 real checks)
node bin/citeready-lite.mjs https://yourdomain.com

# Output JSON for scripts
node bin/citeready-lite.mjs https://yourdomain.com --json

# Enforce a score threshold in terminal
node bin/citeready-lite.mjs https://yourdomain.com --min-score 80
\`\`\`

## Upgrade to CiteReady Pro ($19 One-Time)
CiteReady Pro unlocks:
- Multi-page internal crawling (\`--crawl 10+\`)
- Auto-generation of 6 drop-in fix files (\`--fix\`: \`llms.txt\`, \`llms-full.txt\`, \`robots.txt\`, \`jsonld-snippets.html\`, \`head-meta-patch.html\`, \`nextjs-metadata.ts\`)
- White-label standalone HTML / Print-PDF audit report (\`--brand\`)
- GitHub Actions CI/CD score gate workflow

- Get CiteReady Pro CLI ($19 one-time): https://eiran.gumroad.com/l/shubyl
- Order Done-For-You 24h Fix Pack ($29): https://eiran.gumroad.com/l/eiosatl
- Website & Interactive Browser Toolkit: https://citeready.eiran.tech
`;

const LITE_WRAPPER = `#!/usr/bin/env node
// CiteReady Free Lite Edition wrapper
process.argv.splice(2, 0, '--lite');
await import('./citeready.mjs');
`;

const LITE_PKG = `{
  "name": "citeready-lite",
  "version": "1.0.0",
  "description": "Free Lite CLI for CiteReady AI Search (GEO) & Launch-Readiness 36-check single-page audit.",
  "type": "module",
  "engines": {
    "node": ">=18.0.0"
  },
  "bin": {
    "citeready-lite": "./bin/citeready-lite.mjs"
  },
  "license": "MIT"
}
`;

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

function createZipFromDir(sourceDir, outZipPath) {
  const pyScript = `
import os, sys, zipfile
src = sys.argv[1]
dst = sys.argv[2]
with zipfile.ZipFile(dst, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
    for root, dirs, files in os.walk(src):
        dirs.sort()
        files.sort()
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src).replace(os.sep, '/')
            info = zipfile.ZipInfo(rel, date_time=(2026, 11, 19, 12, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            with open(full, 'rb') as fp:
                zf.writestr(info, fp.read())
print(f"ZIP_OK {dst} {os.path.getsize(dst)}")
`;
  const out = execFileSync('python', ['-c', pyScript, sourceDir, outZipPath], { encoding: 'utf8' });
  return out.trim();
}

async function main() {
  await fs.rm(STAGE_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  // 1. Stage Pro Release
  const proStage = path.join(STAGE_DIR, 'pro');
  await copyDir(path.join(ROOT, 'bin'), path.join(proStage, 'bin'));
  await copyDir(path.join(ROOT, 'src'), path.join(proStage, 'src'));
  await copyDir(path.join(ROOT, '.github'), path.join(proStage, '.github'));
  await fs.copyFile(path.join(ROOT, 'package.json'), path.join(proStage, 'package.json'));
  await fs.copyFile(path.join(ROOT, 'README.md'), path.join(proStage, 'README.md'));
  await fs.copyFile(path.join(ROOT, 'LICENSE.txt'), path.join(proStage, 'LICENSE.txt'));
  await fs.writeFile(path.join(proStage, 'QUICKSTART-PRO.md'), QUICKSTART_PRO, 'utf8');

  const proZip = path.join(DIST_DIR, 'citeready-pro-v1.0.0.zip');
  console.log(createZipFromDir(proStage, proZip));

  // 2. Stage Free Lite Release
  const liteStage = path.join(STAGE_DIR, 'free');
  await copyDir(path.join(ROOT, 'bin'), path.join(liteStage, 'bin'));
  await copyDir(path.join(ROOT, 'src'), path.join(liteStage, 'src'));
  await fs.writeFile(path.join(liteStage, 'bin', 'citeready-lite.mjs'), LITE_WRAPPER, 'utf8');
  await fs.writeFile(path.join(liteStage, 'package.json'), LITE_PKG, 'utf8');
  await fs.writeFile(path.join(liteStage, 'README-LITE.md'), README_LITE, 'utf8');
  await fs.copyFile(path.join(ROOT, 'LICENSE.txt'), path.join(liteStage, 'LICENSE.txt'));

  const freeZip = path.join(DIST_DIR, 'citeready-free-v1.0.0.zip');
  console.log(createZipFromDir(liteStage, freeZip));

  // Mirror Free Lite ZIP into site/downloads/ for 1-click zero-signup download
  const siteDownloads = path.join(ROOT, 'site', 'downloads');
  await fs.mkdir(siteDownloads, { recursive: true });
  await fs.copyFile(freeZip, path.join(siteDownloads, 'citeready-free-v1.0.0.zip'));

  await fs.rm(STAGE_DIR, { recursive: true, force: true });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
