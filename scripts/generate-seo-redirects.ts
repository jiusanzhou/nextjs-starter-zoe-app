#!/usr/bin/env tsx
/**
 * generate-seo-redirects.ts
 *
 * Post-build script: reads `seo.redirects` and `seo.gone` from the site
 * config and materializes static HTML files under `out/` so that:
 *
 *   - Every `redirect.from` becomes an `index.html` with a
 *     `<meta http-equiv="refresh">` + `<link rel="canonical">` pointing to `to`.
 *   - Every `gone` path becomes an `index.html` that renders a friendly
 *     "permanently removed" page with `<meta name="robots" content="noindex, nofollow">`.
 *
 * WHY:
 *   `output: export` + GitHub Pages = no server-side redirects, no real 410.
 *   This script gets us the closest static equivalent:
 *     - 301 ≈ instant meta-refresh (browsers do it in <100ms; Google honors
 *       meta refresh with time=0 as a 301 signal per its own docs).
 *     - 410 ≈ HTML page with `noindex` + human-readable "gone" copy.
 *
 * WHEN TO RUN:
 *   Automatically triggered by `postbuild` in package.json.
 *   Reads the same zoe-site config used by the app (ZOE_CONFIG_PATH env or
 *   the default `zoe-site.yaml` in the site repo).
 *
 * SITE USAGE:
 *   Add a `seo:` block to your zoe-site.yaml:
 *
 *     seo:
 *       redirects:
 *         - from: /blogs/archives
 *           to: /blog/archives/
 *         - from: /old-slug
 *           to: /blog/new-slug/
 *       gone:
 *         - /month
 *         - /index.xml
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

// __dirname polyfill for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// -----------------------------------------------------------------------------
// Config loading — mirror the app's zoe-site.yaml resolution rules.
//
// Priority (highest first):
//   1. ZOE_CONFIG_PATH env
//   2. `zoe-site.yaml` in CWD
//   3. `zoe-site.yaml` in repo root (project root of this theme)
// -----------------------------------------------------------------------------
function resolveConfigPath(): string | null {
  const candidates = [
    process.env.ZOE_CONFIG_PATH,
    path.join(process.cwd(), 'zoe-site.yaml'),
    path.join(__dirname, '..', 'zoe-site.yaml'),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

interface RedirectRule {
  from: string;
  to: string;
  label?: string;
}

interface SeoConfig {
  redirects?: RedirectRule[];
  gone?: string[];
}

interface ZoeConfig {
  url?: string;
  title?: string;
  seo?: SeoConfig;
}

// -----------------------------------------------------------------------------
// HTML templates
// -----------------------------------------------------------------------------
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function absoluteTo(base: string | undefined, to: string): string {
  if (/^https?:\/\//i.test(to)) return to;
  const cleanBase = (base || '').replace(/\/$/, '');
  return `${cleanBase}${to.startsWith('/') ? to : '/' + to}`;
}

function renderRedirectHtml(rule: RedirectRule, siteUrl?: string, siteTitle?: string): string {
  const targetAbs = absoluteTo(siteUrl, rule.to);
  const label = rule.label ?? 'Redirecting…';
  const escTitle = escapeHtml(siteTitle || 'Redirecting');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escTitle}</title>
<meta http-equiv="refresh" content="0; url=${escapeHtml(rule.to)}">
<link rel="canonical" href="${escapeHtml(targetAbs)}">
<meta name="robots" content="noindex, follow">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    display:flex;align-items:center;justify-content:center;height:100vh;margin:0;
    color:#333;background:#fafafa}
  .box{text-align:center;max-width:480px;padding:2rem}
  a{color:#0070f3;text-decoration:none}
  a:hover{text-decoration:underline}
</style>
</head>
<body>
<div class="box">
  <p>${escapeHtml(label)}</p>
  <p>If nothing happens, <a href="${escapeHtml(rule.to)}">click here</a>.</p>
  <script>window.location.replace(${JSON.stringify(rule.to)});</script>
</div>
</body>
</html>
`;
}

function renderGoneHtml(pathname: string, siteUrl?: string, siteTitle?: string): string {
  const escTitle = escapeHtml(siteTitle || 'Page removed');
  const home = (siteUrl || '/').replace(/\/$/, '') + '/';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Page removed — ${escTitle}</title>
<meta name="robots" content="noindex, nofollow">
<meta name="description" content="This page has been permanently removed.">
<style>
  body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
    display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;
    color:#333;background:#fafafa}
  .box{text-align:center;max-width:520px;padding:2rem}
  h1{font-size:1.5rem;margin:0 0 .75rem}
  p{color:#666;line-height:1.6}
  a{color:#0070f3;text-decoration:none}
  a:hover{text-decoration:underline}
  code{background:#f0f0f0;padding:.1rem .4rem;border-radius:.25rem;font-size:.9em}
</style>
</head>
<body>
<div class="box">
  <h1>This page has been permanently removed</h1>
  <p>The URL <code>${escapeHtml(pathname)}</code> no longer exists on this site.</p>
  <p><a href="${escapeHtml(home)}">Go to homepage</a></p>
</div>
</body>
</html>
`;
}

// -----------------------------------------------------------------------------
// Write helpers
// -----------------------------------------------------------------------------
function writeIndexHtml(outDir: string, rawPath: string, content: string): { outPath: string; wrote: boolean } {
  // Normalize:
  //   - must start with '/'
  //   - always write as directory/index.html (mirrors trailingSlash: true)
  //   - reject '..' or absolute escapes
  if (!rawPath.startsWith('/')) rawPath = '/' + rawPath;
  const clean = path.posix.normalize(rawPath).replace(/\/$/, '');
  if (clean.includes('..')) {
    console.warn(`[seo-redirects] refusing to write path with '..' segment: ${rawPath}`);
    return { outPath: '', wrote: false };
  }
  const dir = clean === '' ? outDir : path.join(outDir, ...clean.split('/').filter(Boolean));
  fs.mkdirSync(dir, { recursive: true });
  const outPath = path.join(dir, 'index.html');
  // Don't overwrite an existing real page — that would be a bug in the config.
  if (fs.existsSync(outPath)) {
    console.warn(
      `[seo-redirects] SKIP ${rawPath} — a real page already exists at ${outPath}. ` +
        `Remove it from seo.redirects/seo.gone or from the site content.`,
    );
    return { outPath, wrote: false };
  }
  fs.writeFileSync(outPath, content, 'utf8');
  return { outPath, wrote: true };
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------
function main() {
  const configPath = resolveConfigPath();
  if (!configPath) {
    console.log('[seo-redirects] No zoe-site.yaml found — skipping.');
    return;
  }
  const raw = fs.readFileSync(configPath, 'utf8');
  const cfg = yaml.load(raw) as ZoeConfig;
  const seo = cfg?.seo;
  if (!seo || (!seo.redirects?.length && !seo.gone?.length)) {
    console.log(`[seo-redirects] no seo.redirects / seo.gone in ${configPath} — skipping.`);
    return;
  }

  // Resolve out/ dir. Next.js `output: export` writes to `out/` by default.
  const outDir = path.join(process.cwd(), 'out');
  if (!fs.existsSync(outDir)) {
    console.warn(`[seo-redirects] ${outDir} not found — is next build done? skipping.`);
    return;
  }

  const siteUrl = cfg.url;
  const siteTitle = cfg.title;
  let redirCount = 0;
  let goneCount = 0;

  for (const rule of seo.redirects || []) {
    if (!rule.from || !rule.to) {
      console.warn(`[seo-redirects] invalid redirect rule: ${JSON.stringify(rule)} — skipping.`);
      continue;
    }
    const html = renderRedirectHtml(rule, siteUrl, siteTitle);
    const { wrote } = writeIndexHtml(outDir, rule.from, html);
    if (wrote) {
      redirCount++;
      console.log(`[seo-redirects] redirect ${rule.from} → ${rule.to}`);
    }
  }

  for (const p of seo.gone || []) {
    const html = renderGoneHtml(p, siteUrl, siteTitle);
    const { wrote } = writeIndexHtml(outDir, p, html);
    if (wrote) {
      goneCount++;
      console.log(`[seo-redirects] gone     ${p}`);
    }
  }

  console.log(`[seo-redirects] done. redirects=${redirCount} gone=${goneCount}`);
}

main();
