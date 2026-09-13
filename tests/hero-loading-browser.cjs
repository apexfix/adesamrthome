(async () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const source = url => new URL(url).searchParams.get('url') || new URL(url).pathname;
  const first = '/img/hero/lockin-v5max-composition-v1.webp';
  const second = '/img/hero/lockin-x9-composition-v1.webp';
  const third = '/img/products/dahua-2-camera-kit/dahua-2-camera-kit-poster-v1.png';
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const scenario of ['sequential', 'direct-third', 'failed-second']) {
        const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [], requested = [];
        const releases = new Map();
        const gates = new Map([first, second].map(src => [src, new Promise(resolve => releases.set(src, resolve))]));
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', async route => {
          const src = source(route.request().url());
          if ([first, second, third].includes(src)) requested.push(src);
          if (gates.has(src)) await gates.get(src);
          if (scenario === 'failed-second' && (src === second || src === '/img/hero1-optimized.avif')) await route.abort();
          else await route.continue();
        });
        try {
          await page.goto(base, { waitUntil: 'domcontentloaded' });
          await page.getByRole('button', { name: 'Next slide', exact: true }).waitFor();
          assert.ok(requested.includes(first));
          assert.ok(!requested.includes(second) && !requested.includes(third));
          const primary = page.locator('.hero-slide img').first();
          assert.notEqual(await primary.getAttribute('loading'), 'lazy');
          assert.equal(await page.locator('link[rel="preload"][as="image"]').count(), 1);
          releases.get(first)();
          await page.waitForFunction(() => document.querySelectorAll('.hero-slide').length === 2);
          // A blocked second response must prevent background loading of the third.
          await page.waitForTimeout(500);
          assert.ok(requested.includes(second));
          assert.ok(!requested.includes(third));
          if (scenario === 'direct-third') {
            await page.getByRole('button', { name: 'Show slide 3: Dahua 5MP Camera Kit', exact: true }).click();
            await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '2');
            assert.ok(requested.includes(third));
            await page.getByRole('button', { name: 'Show slide 1: Lockin V5 MAX', exact: true }).click();
            assert.equal(await page.locator('.hero-slide').count(), 3, 'Manually loaded slide stays mounted');
          }
          releases.get(second)();
          await page.waitForFunction(() => document.querySelectorAll('.hero-slide').length === 3);
          await page.getByRole('button', { name: 'Show slide 3: Dahua 5MP Camera Kit', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '2');
          await page.waitForFunction(() => { const image = document.querySelector('.hero-slide[data-active="true"] img'); return image?.complete && image.naturalWidth > 0; });
          assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), '/products/dahua-5mp-2-camera-poe-security-kit');
          assert.equal(await page.locator('.hero-primary-cta').count(), 1);
          assert.match(await page.locator('.hero-caption').innerText(), /A\$443/);
          if (scenario === 'failed-second') assert.equal(await page.locator('.hero-image-unavailable').innerText(), 'Lockin X9');
          assert.deepEqual(errors, []);
          results.push({ engine, scenario, passed: true });
        } finally {
          for (const release of releases.values()) release();
          await context.close();
        }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/hero-verification', { recursive: true });
  await fs.writeFile('output/hero-verification/loading-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
