(async () => {
  const assert = require('node:assert/strict');
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const fs = require('node:fs/promises');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const browser = await chromium.launch({ channel: 'chrome' });
  const routes = ['/', '/smart-lock-installation-only-adelaide', '/smart-lock-supply-installation-adelaide', '/products/smart-lock-installation-only-service', '/products/lockin-x9-smart-lock'];
  await fs.mkdir('output/installation-inclusions', { recursive: true });
  try {
    for (const width of [390, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 950 } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route(/google-analytics|googletagmanager|connect\.facebook|facebook\.com\/tr/, route => route.abort());
      for (const [index, route] of routes.entries()) {
        await page.goto(base + route, { waitUntil: 'networkidle' });
        const section = page.locator('#installation-inclusions');
        assert.equal(await section.count(), 1);
        assert.equal(await section.locator('li').count(), 6);
        const text = await section.innerText();
        for (const phrase of ['A$200', 'A$350', 'supply-and-install', 'vacuum', 'PIN and fingerprints']) assert.ok(text.includes(phrase));
        assert.equal(await section.locator('a').getAttribute('href'), '/contact');
        await section.scrollIntoViewIfNeeded();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        await section.screenshot({ path: `output/installation-inclusions/${width}-${index}.png` });
      }
      await page.goto(base + '/products/dahua-5mp-2-camera-poe-security-kit', { waitUntil: 'networkidle' });
      assert.equal(await page.locator('#installation-inclusions').count(), 0);
      assert.deepEqual(errors, []);
      await page.close();
    }
    console.log(JSON.stringify({ base, layouts: 10, cameraExclusions: 2, errors: 0, enquiriesSent: 0 }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
