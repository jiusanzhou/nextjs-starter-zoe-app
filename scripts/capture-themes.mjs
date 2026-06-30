// Capture theme showcases for README
// Strategy: build ONCE (example content + a theme as default), then for each theme:
//   navigate to `/?theme=<name>` which triggers the client-side ThemeSwitcher
//   to swap html.theme-xxx class. Wait for hydration + paint, then CDP screenshot.
// Usage: node scripts/capture-themes.mjs
//   Skip build (reuse existing out/): node scripts/capture-themes.mjs --no-build
import WebSocket from 'ws';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'docs', 'showcase');
const BUILD_DIR = path.join(ROOT, 'out');
const PORT = 4099;
const SERVE_URL = `http://localhost:${PORT}`;
const CDP_URL = 'http://127.0.0.1:18800';

// Must match src/components/theme-switcher.tsx THEMES list
const THEMES = ['default', 'vercel', 'wellwell', 'wenzi', 'linear', 'stripe', 'terminal'];

const args = process.argv.slice(2);
const SKIP_BUILD = args.includes('--no-build');

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function buildSite() {
  console.log('▶ Building (USE_EXAMPLE_CONTENT=true)...');
  const t0 = Date.now();
  execSync('pnpm build', {
    cwd: ROOT,
    stdio: ['ignore', 'inherit', 'inherit'],
    env: { ...process.env, USE_EXAMPLE_CONTENT: 'true', NODE_ENV: 'production' },
  });
  console.log(`  done in ${((Date.now()-t0)/1000).toFixed(1)}s`);
}

function startServer() {
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    let urlPath = decodeURIComponent(req.url.split('?')[0]);
    if (urlPath.endsWith('/')) urlPath += 'index.html';
    let filePath = path.join(BUILD_DIR, urlPath);
    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(filePath + '.html')) filePath += '.html';
      else if (fs.existsSync(filePath + '/index.html')) filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      res.statusCode = 404; res.end('404'); return;
    }
    const ext = path.extname(filePath);
    const mime = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css', '.js': 'application/javascript',
      '.json': 'application/json', '.svg': 'image/svg+xml',
      '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
      '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
      '.ico': 'image/x-icon',
    }[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

async function captureWithFreshTab(url, outFile) {
  const created = await fetch(`${CDP_URL}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' }).then(r => r.json());
  const tabId = created.id;
  try {
    const ws = new WebSocket(created.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      ws.once('open', resolve);
      ws.once('error', reject);
    });

    let nextId = 1;
    const pending = new Map();
    ws.on('message', (raw) => {
      const msg = JSON.parse(raw.toString());
      if (msg.id && pending.has(msg.id)) {
        pending.get(msg.id)(msg);
        pending.delete(msg.id);
      }
    });
    const send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, (m) => m.error ? reject(new Error(m.error.message)) : resolve(m.result));
      ws.send(JSON.stringify({ id, method, params }));
    });

    await send('Page.enable');
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1440, height: 900, deviceScaleFactor: 2, mobile: false,
    });

    // Listen for load
    let loaded = false;
    const onLoad = new Promise((resolve) => {
      ws.on('message', (raw) => {
        const m = JSON.parse(raw.toString());
        if (m.method === 'Page.loadEventFired' && !loaded) { loaded = true; resolve(); }
      });
    });

    await send('Page.navigate', { url });
    await Promise.race([onLoad, sleep(8000)]);
    // Extra wait: ThemeSwitcher reads ?theme=, mutates <html class>, fonts load, etc.
    await sleep(3000);

    // Reset scroll to top + wait for fonts + disable animations for stable capture
    await send('Runtime.evaluate', {
      expression: `(async () => {
        if (document.fonts && document.fonts.ready) await document.fonts.ready;
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Kill ongoing CSS transitions/animations
        const style = document.createElement('style');
        style.textContent = '*,*::before,*::after{animation:none!important;transition:none!important}';
        document.head.appendChild(style);
        return true;
      })()`,
      awaitPromise: true,
    });
    // One more paint cycle after scroll/animation kill
    await sleep(500);

    const { data: b64 } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
    fs.writeFileSync(outFile, Buffer.from(b64, 'base64'));
    ws.close();
  } finally {
    await fetch(`${CDP_URL}/json/close/${tabId}`).catch(() => {});
  }
  return fs.statSync(outFile).size;
}

function resizeAndCompress(pngFile, jpgFile, width = 1440, quality = 85) {
  execSync(`sips --resampleWidth ${width} -s format jpeg -s formatOptions ${quality} "${pngFile}" --out "${jpgFile}"`, { stdio: 'pipe' });
  fs.unlinkSync(pngFile);
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  if (!SKIP_BUILD) buildSite();

  console.log(`▶ Static server on ${SERVE_URL}`);
  const server = await startServer();

  for (const theme of THEMES) {
    process.stdout.write(`▶ ${theme.padEnd(10)} `);
    const url = `${SERVE_URL}/?theme=${theme}&cb=${Date.now()}`;
    const pngFile = path.join(OUT_DIR, `${theme}.png`);
    const jpgFile = path.join(OUT_DIR, `${theme}.jpg`);
    const size = await captureWithFreshTab(url, pngFile);
    resizeAndCompress(pngFile, jpgFile);
    const jpgSize = fs.statSync(jpgFile).size;
    console.log(`→ ${theme}.jpg (${(jpgSize/1024).toFixed(0)} KB, png=${(size/1024).toFixed(0)} KB)`);
  }

  server.close();
  console.log('\n✓ All themes captured.');
}

main().catch((e) => { console.error('\nFAIL:', e.message); process.exit(1); });
