const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const baseline = process.argv.includes('--baseline');
const base = 'http://localhost:6650';

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = `output/mobile-dock-layout/${baseline ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const path of ['/', '/products/lockin-v5-max-smart-lock', '/products/dahua-5mp-2-camera-poe-security-kit']) {
        for (const width of [320, 360, 390, 430]) for (const mode of ['normal', 'large', 'large-nojs']) {
          const page = await browser.newPage({ viewport: { width, height: width === 430 ? 480 : 844 }, javaScriptEnabled: mode !== 'large-nojs', reducedMotion: 'reduce' });
          page.setDefaultTimeout(10000);
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
          try {
            await page.goto(base + path, { waitUntil: 'networkidle' });
            if (mode !== 'normal') await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
            const dock = page.getByRole('navigation', { name: 'Quick contact' });
            await dock.waitFor({ state: 'visible' });
            if (mode !== 'large-nojs') await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            const geometry = await dock.evaluate(node => {
              const rect = el => { const r = el.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height }; };
              return { dock: rect(node), links: [...node.querySelectorAll('a')].map(el => ({ ...rect(el), scrollWidth: el.scrollWidth, clientWidth: el.clientWidth })), spacer: rect(document.querySelector('.mobile-contact-spacer')), viewport: { width: innerWidth, height: innerHeight } };
            });
            const fits = geometry.links.every(link => link.left >= geometry.dock.left && link.right <= geometry.dock.right + 1 && link.top >= geometry.dock.top && link.bottom <= geometry.dock.bottom + 1 && link.width >= 48 && link.height >= 48 && link.scrollWidth <= link.clientWidth + 1);
            const cleared = geometry.spacer.height >= geometry.viewport.height - geometry.dock.top;
            results.push({ engine, path, width, mode, geometry, fits, cleared, errors });
            await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
            if (!baseline) {
              assert.ok(fits && cleared, JSON.stringify(results.at(-1)));
              assert.deepEqual(errors, []);
              assert.ok(await dock.evaluate(node => [...node.querySelectorAll('a')].every(link => {
                const text = link.innerText.replace(/\s+/g, ' ').trim().toLowerCase();
                return !text || (link.getAttribute('aria-label') || text).toLowerCase().includes(text);
              })), 'Accessible names must contain the visible label');
            }
            if (width === 320 && path.includes('v5-max') && mode !== 'large-nojs') {
              await dock.screenshot({ path: `${out}/${engine}-${mode}.png` });
            }
            if (width === 320 && path.includes('v5-max') && mode === 'normal') {
              await dock.locator('a').first().focus();
              // Fixture for a stale observer/form flag: native focus must win immediately.
              const retained = await dock.evaluate(node => {
                node.dataset.primaryVisible = 'true'; node.dataset.formActive = 'true';
                return getComputedStyle(node).display !== 'none' && node.contains(document.activeElement);
              });
              results.at(-1).staleFlagFocusFixture = retained;
              if (!baseline) assert.equal(retained, true);
            }
          } finally { await page.close(); }
        }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ cases: results.length, fitting: results.filter(r => r.fits).length, cleared: results.filter(r => r.cleared).length, focusFixtures: results.filter(r => r.staleFlagFocusFixture !== undefined).map(r => r.staleFlagFocusFixture), output: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
