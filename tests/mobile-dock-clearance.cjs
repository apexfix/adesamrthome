(async () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/mobile-dock-clearance';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['standard', 'no-js', 'large-text']) for (const width of [360, 390, 430]) {
        const page = await browser.newPage({ viewport: { width, height: 844 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const slug of ['lockin-v5-max-smart-lock', 'lockin-x9-smart-lock', 'smart-lock-installation-only-service', 'dahua-5mp-2-camera-poe-security-kit']) {
          await page.goto(`${base}/products/${slug}`, { waitUntil: 'networkidle' });
          if (mode === 'large-text') await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
          const quote = page.locator('.product-primary-action');
          const dock = page.getByRole('navigation', { name: 'Quick contact' });
          // Reproduce native scrolling to the lower edge, without centring or forcing a click.
          await quote.evaluate(link => link.scrollIntoView({ block: 'end', behavior: 'instant' }));
          const visiblePoint = await quote.evaluate(link => {
            const r = link.getBoundingClientRect();
            return link.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
          });
          assert.ok(visiblePoint, `${engine}/${mode}/${width}/${slug}: quote obscured after native scroll`);
          const header = await page.locator('.site-header').boundingBox();
          const box = await quote.boundingBox();
          assert.ok(box.y >= header.y + header.height, 'Quote clears fixed header');
          if (slug === 'lockin-v5-max-smart-lock') await page.screenshot({ path: `${out}/quote-${engine}-${mode}-${width}.png` });
          const expected = await quote.getAttribute('href');
          await quote.click();
          await page.waitForURL(url => url.pathname === '/contact' && url.search === new URL(expected, base).search);
          assert.equal(await dock.count(), 0);
          results.push({ engine, mode, width, slug, nativeScrollAndClick: true });
        }
        await page.goto(`${base}/products/lockin-v5-max-smart-lock`, { waitUntil: 'networkidle' });
        if (mode === 'large-text') await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
        const dock = page.getByRole('navigation', { name: 'Quick contact' });
        await page.keyboard.press('Tab');
        await page.locator('.product-primary-action').focus();
        assert.ok(await page.locator('.product-primary-action').evaluate(link => link.matches(':focus-visible')));
        await dock.waitFor({ state: 'hidden' });
        await page.keyboard.press('Tab');
        assert.ok(await page.evaluate(() => document.activeElement.closest('main') && document.activeElement.matches(':focus-visible')));
        await dock.waitFor({ state: 'hidden' });
        await page.locator('.site-footer').getByRole('link', { name: 'Request a Quote', exact: true }).focus();
        await dock.waitFor({ state: 'hidden' });
        await page.locator('.site-footer').getByRole('link', { name: 'Request a Quote', exact: true }).evaluate(link => link.blur());
        await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
        await dock.waitFor({ state: 'visible' });
        await dock.getByRole('link').first().focus();
        assert.ok(await dock.isVisible(), 'Dock must not hide its own focused link');
        await page.screenshot({ path: `${out}/${engine}-${mode}-${width}.png` });
        assert.deepEqual(errors, []);
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, routeChecks: results.length, focusLayouts: 18 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
