(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [360,390,430]) {
        console.log(JSON.stringify({ engine, width, stage: 'start' }));
        const page = await browser.newPage({ viewport: { width, height: 844 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
        const dock = page.getByRole('navigation', { name: 'Quick contact' });
        await dock.waitFor({ state: 'hidden' });
        await page.getByRole('link', { name: 'Browse Smart Locks', exact: true }).click();
        await dock.waitFor({ state: 'visible' });
        await dock.getByRole('link').first().focus();
        await page.evaluate(() => scrollTo(0,0));
        await page.waitForFunction(() => document.querySelector('.hero-primary-cta').getBoundingClientRect().top > 0);
        assert.ok(await dock.isVisible());
        assert.ok(await dock.getByRole('link').first().evaluate(n => n === document.activeElement));
        await page.locator('.site-header a').first().focus();
        await dock.waitFor({ state: 'hidden' });
        await page.locator('.site-footer').scrollIntoViewIfNeeded();
        await dock.waitFor({ state: 'visible' });
        await page.locator('form input[name=name]').focus();
        await dock.waitFor({ state: 'hidden' });
        await page.locator('.site-footer').getByRole('link', { name: 'Request a Quote', exact: true }).click();
        try { await page.waitForURL('**/contact#quote'); }
        catch (error) {
          console.log(JSON.stringify({ engine, width, url: page.url(), errors, text: (await page.locator('body').innerText()).slice(0, 700) }));
          await page.screenshot({ path: `output/hero-verification/${engine}-dock-failure.png` });
          throw error;
        }
        await page.waitForLoadState('networkidle');
        assert.equal(await dock.count(), 0);
        assert.deepEqual(errors, []);
        results.push({ engine, width, passed: true });
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/hero-verification/mobile-dock-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, combinations: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
