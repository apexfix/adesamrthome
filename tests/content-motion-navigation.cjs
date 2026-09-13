(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
      const quote = page.locator('.hero-primary-cta');
      const size = await quote.evaluate(n => [n.offsetWidth, n.offsetHeight]);
      await quote.hover();
      await page.mouse.down();
      await page.waitForFunction(() => getComputedStyle(document.querySelector('.hero-primary-cta')).scale === '0.98');
      assert.deepEqual(await quote.evaluate(n => [n.offsetWidth, n.offsetHeight]), size);
      assert.match(await quote.evaluate(n => getComputedStyle(n).transitionDuration), /0.14s/);
      await page.mouse.move(1, 1);
      await page.mouse.up();
      await page.getByRole('link', { name: 'Smart Locks', exact: true }).first().click();
      await page.waitForURL('**/products?category=smart-lock');
      await page.locator('.motion-card').first().waitFor();
      const urls = await page.locator('.motion-card').evaluateAll(nodes => nodes.map(n => n.getAttribute('href')));
      assert.ok(urls.length > 1 && urls.every(url => !url.includes('dahua')));
      const panel = page.locator('[data-glass-highlight]').first();
      await panel.hover();
      await page.waitForFunction(() => document.querySelector('[data-highlight-active="true"]'));
      await panel.evaluate(n => { window.__oldPanel = n; });
      await page.locator('.motion-card').first().click();
      await page.waitForURL(url => url.pathname.startsWith('/products/') && !url.search);
      await page.waitForFunction(() => !window.__oldPanel.hasAttribute('data-highlight-active') && !window.__oldPanel.style.getPropertyValue('--shine-x'));
      await page.goBack();
      await page.waitForURL('**/products?category=smart-lock');
      assert.deepEqual(await page.locator('.motion-card').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), urls);
      await page.locator('main a[href="/products"]').first().click();
      await page.waitForURL('**/products');
      assert.equal(await page.locator('[data-catalogue-section]').first().getAttribute('data-catalogue-section'), 'installation-service');
      assert.equal(await page.locator('[data-installation-listing] a').first().getAttribute('href'), '/products/smart-lock-installation-only-service');
      const footerPreference = page.getByRole('checkbox', { name: 'Reduce visual effects' });
      await footerPreference.check();
      await page.locator('[data-glass-highlight]').first().hover();
      assert.equal(await page.locator('[data-glass-highlight]').first().getAttribute('data-highlight-active'), null);
      assert.equal(await page.locator('[data-glass-highlight]').first().evaluate(n => getComputedStyle(n, '::before').display), 'none');
      assert.ok(await page.locator('[data-reveal-group] > *').evaluateAll(nodes => nodes.every(n => getComputedStyle(n).opacity === '1')));
      assert.deepEqual(errors, []);
      results.push({ engine, quotePress: true, queryFilter: true, history: true, highlightCleanup: true, manualReduction: true, passed: true });
    } finally { await page.close(); await browser.close(); }
  }
  await fs.writeFile('output/content-motion-verification/navigation-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
