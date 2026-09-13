(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const scenario of ['slow', 'broken', 'fallback-broken', 'no-js']) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', javaScriptEnabled: scenario !== 'no-js' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        let release;
        const hold = new Promise(resolve => { release = resolve; });
        try {
          await page.route('**/_next/image?*', async route => {
            const src = new URL(route.request().url()).searchParams.get('url') ?? '';
            if (scenario === 'slow' && src.includes('auslock-smart-lock-side-view.jpg')) await hold;
            if (['broken', 'fallback-broken'].includes(scenario) && (src.includes('auslock-smart-lock-side-view.jpg') || scenario === 'fallback-broken' && src.includes('hero1-optimized.avif'))) {
              await route.fulfill({ status: 404, body: 'Synthetic unavailable image' });
            } else await route.continue();
          });
          await page.goto('http://localhost:6650/', { waitUntil: 'domcontentloaded' });
          await page.locator('.hero-slide[data-active="true"] img').evaluate(i => i.decode());
          if (scenario === 'no-js') {
            assert.equal(await page.getByRole('group', { name: 'Slideshow controls', exact: true }).count(), 0);
            assert.equal(await page.locator('h1').count(), 1);
            assert.equal(await page.locator('.hero-primary-cta').getAttribute('href'), '/contact?service=supply-install#quote');
          } else {
            await page.getByRole('button', { name: 'Next slide', exact: true }).click();
            if (scenario === 'slow') {
              assert.equal(await page.locator('.hero-carousel').getAttribute('data-index'), '0');
              assert.equal(await page.locator('.hero-carousel').getAttribute('data-pending'), '1');
              assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), '/contact?service=supply-install#quote');
              release();
            }
            await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '1');
            assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), '/contact?service=installation-only#quote');
            if (scenario === 'broken') {
              const fallback = page.locator('.hero-slide[data-active="true"] img');
              assert.equal(await fallback.getAttribute('alt'), 'Modern home exterior');
              await fallback.evaluate(i => i.decode());
            }
            if (scenario === 'fallback-broken') assert.ok(await page.locator('.hero-slide[data-active="true"] .hero-image-unavailable').isVisible());
            assert.ok((await page.locator('.hero-media').boundingBox()).height >= 170);
          }
          assert.deepEqual(errors, []);
          results.push({ engine, scenario, actualNextImages: true, passed: true });
        } finally { release(); await context.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/hero-verification/failure-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, checks: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
