const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');

(async () => {
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const directory = path.resolve('output/rollback-96b4708');
  const archiveEntries = execFileSync('git', ['ls-tree', '-r', '-z', '96b4708'], { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 }).split('\0').filter(Boolean);
  let blobs = 0;
  const lineEndingConversions = [];
  for (const entry of archiveEntries) {
    const [metadata, file] = entry.split('\t');
    const [, type, expected] = metadata.split(' ');
    assert.equal(type, 'blob');
    const resolved = path.resolve(directory, file);
    assert.ok(resolved.startsWith(directory + path.sep));
    const bytes = fs.readFileSync(resolved);
    const hash = value => createHash('sha1').update(`blob ${value.length}\0`).update(value).digest('hex');
    if (hash(bytes) !== expected) {
      // Git archive honors Windows text checkout conversion; binary content must match exactly.
      assert.ok(!bytes.includes(0), `Archived binary mismatch: ${file}`);
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      const normalized = Buffer.from(text.replace(/\r\n/g, '\n'));
      assert.equal(hash(normalized), expected, `Archived source/asset mismatch: ${file}`);
      lineEndingConversions.push(file);
    }
    blobs++;
  }
  const bases = ['http://127.0.0.1:6651', 'http://localhost:6650'];
  const routes = ['/', '/products', '/products/lockin-v5-max-smart-lock', '/products/lockin-x9-smart-lock', '/products/security-camera-kits', '/smart-lock-installation-only-adelaide', '/contact', '/contact/thank-you'];
  const results = [];
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 1000 }, reducedMotion: 'reduce' });
    await context.route('**/*', route => bases.includes(new URL(route.request().url()).origin) ? route.continue() : route.abort());
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const base of bases) for (const route of routes) {
      errors.length = 0;
      const response = await page.goto(base + route, { waitUntil: 'networkidle' });
      assert.equal(response.status(), 200, base + route);
      assert.equal(await page.locator('h1').count(), 1);
      assert.deepEqual(errors, [], base + route);
      const state = await page.evaluate(() => ({
        title: document.title,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
        schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)),
        contacts: [...document.querySelectorAll('a[href^="sms:"],a[href^="mailto:"]')].map(node => node.getAttribute('href')).sort(),
      }));
      if (base === bases[1]) assert.deepEqual(state, results.find(item => item.route === route).state, `Rollback metadata/contact compatibility: ${route}`);
      results.push({ base, route, state });
    }
    await context.close();
  } finally { await browser.close(); }
  const report = {
    checkpoint: '96b4708', archiveBlobsVerified: blobs, lineEndingConversions, cases: results.length, passed: true,
    scope: 'Isolated archived source/assets, shared existing dependencies, clean Webpack build on loopback 6651, then current Turbopack preview on 6650. No database or live hosting state rolled back; no form submission, email, production traffic or cache purge. This does not approve restoring an older production deployment.',
    results,
  };
  fs.writeFileSync('output/rollback-verification.json', JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ checkpoint: report.checkpoint, blobs, cases: results.length, passed: true }));
})().catch(error => { console.error(error); process.exitCode = 1; });
