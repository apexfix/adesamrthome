const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        await context.addInitScript(() => {
          window.IntersectionObserver = undefined;
          window.ResizeObserver = undefined;
          Element.prototype.animate = undefined;
          Element.prototype.getAnimations = undefined;
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
        try {
          await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
          await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
          assert.ok(await page.getByRole('button', { name: 'Play slideshow', exact: true }).isDisabled());
          assert.equal(await page.locator('.hero-carousel').getAttribute('data-playing'), 'false');
          await page.getByRole('button', { name: 'Next slide', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '1');
          assert.match(await page.locator('.hero-caption').innerText(), /X9/);
          await page.getByRole('button', { name: 'Previous slide', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '0');
          if (width === 320) {
            await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
            await page.keyboard.press('Escape');
            assert.equal(await page.getByRole('button', { name: 'Open navigation menu', exact: true }).getAttribute('aria-expanded'), 'false');
          }
          await page.locator('.hero-primary-cta').click();
          await page.waitForURL('**/contact?service=supply-install#quote');
          await page.waitForFunction(() => !document.querySelector('form fieldset').disabled);
          assert.ok(await page.locator('form input[name="name"]').isEnabled());
          await page.locator('.header-brand').click();
          await page.waitForURL('http://localhost:6650/');
          await page.setViewportSize({ width: width === 320 ? 390 : 1280, height: 900 });
          await page.waitForFunction(() => document.documentElement.style.getPropertyValue('--site-header-clearance'));
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          assert.deepEqual(errors, []);
          results.push({ engine, width, manualCarousel: true, formUsable: true, nativeResizeFallback: true, errors });
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/observer-fallback', { recursive: true });
  await fs.writeFile('output/observer-fallback/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, scope: 'Missing observer/animation API simulation, not physical legacy browsers' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
