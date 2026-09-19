const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  const out = 'output/site-forced-colors';
  await fs.mkdir(out, { recursive: true });
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const colorScheme of ['light', 'dark']) for (const width of [320, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, forcedColors: 'active', colorScheme, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const outlined = async locator => {
          const style = await locator.evaluate(node => { const s = getComputedStyle(node); return { width: s.outlineWidth, style: s.outlineStyle }; });
          assert.equal(style.style, 'solid'); assert.ok(parseFloat(style.width) >= 2);
        };
        try {
          await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
          await page.getByRole('button', { name: 'Next slide', exact: true }).click();
          await page.locator('.header-brand').focus();
          await outlined(page.locator('.hero-indicator[aria-pressed="true"]'));
          assert.equal(await page.locator('.hero-icon-button').last().evaluate(node => getComputedStyle(node).borderTopStyle), 'solid');
          await page.goto('http://localhost:6650/products?category=smart-lock', { waitUntil: 'networkidle' });
          await outlined(page.locator('nav[aria-label="Product categories"] [aria-current]'));
          if (width === 320) {
            await page.getByRole('button', { name: 'Open navigation menu', exact: true }).click();
            await outlined(page.locator('#mobile-navigation a[aria-current]'));
            await page.keyboard.press('Escape');
          } else {
            await outlined(page.locator('.desktop-navigation .header-link[data-nav-active="true"]'));
            assert.equal(await page.locator('.header-active-indicator').evaluate(node => getComputedStyle(node).display), 'none');
          }
          await page.goto('http://localhost:6650/products/lockin-x9-smart-lock', { waitUntil: 'networkidle' });
          await page.locator('.product-thumbnails button').nth(1).click();
          await page.locator('.header-brand').focus();
          await outlined(page.locator('.product-thumbnails button[aria-pressed="true"]'));
          await page.locator('.product-gallery-main').click();
          const dialog = page.getByRole('dialog', { name: 'Product image preview', exact: true });
          await dialog.waitFor();
          for (const button of await dialog.locator('button').all()) assert.ok(await button.evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth) >= 1));
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'hidden' });
          await page.evaluate(() => document.documentElement.style.fontSize = '200%');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          await page.locator('.product-thumbnails').screenshot({ path: `${out}/${engine}-${colorScheme}-${width}.png` });
          assert.deepEqual(errors, []);
          results.push({ engine, colorScheme, width, selections: true, dialog: true, enlarged: true, scope: engine === 'chrome' ? 'Emulated forced system palette' : 'CSS media emulation only; not native palette' });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
