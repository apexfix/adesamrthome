const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) for (const delayed of [false, true]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => {
          sessionStorage.setItem('ade-enquiry-receipt-v1', JSON.stringify({ leadId: 'LOCAL-HYDRATION-123', service: 'installation-only' }));
        });
        await page.route('**/*', async route => {
          if (new URL(route.request().url()).origin !== base) return route.abort();
          if (route.request().method() !== 'GET') throw Error('This test must never submit an enquiry');
          if (delayed && route.request().resourceType() === 'script') await new Promise(resolve => setTimeout(resolve, 250));
          await route.continue();
        });
        try {
          for (let reload = 0; reload < 12; reload++) {
            const response = reload ? await page.reload({ waitUntil: 'domcontentloaded' }) : await page.goto(`${base}/contact/thank-you`, { waitUntil: 'domcontentloaded' });
            assert.equal(response.status(), 200);
            await page.keyboard.press('Tab');
            await page.locator('[data-enquiry-reference]').waitFor();
            await page.waitForLoadState('networkidle');
            assert.deepEqual(errors, [], `${engine}/${width}/${delayed}/${reload}`);
            assert.equal(await page.locator('#site-content > main [data-enquiry-reference]').innerText(), 'LOCAL-HYDRATION-123');
            assert.equal(await page.locator('h1').count(), 1);
            assert.equal(await page.locator('.mobile-contact-dock').isVisible(), false);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          }
          results.push({ engine, width, delayed, loads: 12, errors: [] });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/enquiry-confirmation', { recursive: true });
  await fs.writeFile('output/enquiry-confirmation/hydration-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, layouts: results.length, loads: results.reduce((n, r) => n + r.loads, 0) }));
})().catch(error => { console.error(error); process.exitCode = 1; });
