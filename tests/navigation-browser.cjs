(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/navigation-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [360, 390, 430, 768, 1100, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
        await page.waitForFunction(() => [...document.querySelectorAll('main img')].filter(img => img.getBoundingClientRect().top < innerHeight).every(img => img.complete && img.naturalWidth));
        assert.match(await page.locator('h1').innerText(), /Smart Lock Supply/);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        const mainNav = page.getByRole('navigation', { name: width < 1100 ? 'Mobile navigation' : 'Main navigation', exact: true });
        if (width < 1100) {
          await page.getByRole('button', { name: 'Open navigation menu' }).click();
        }
        for (const name of ['Smart Locks', 'Installation Only', width < 1100 ? 'Security Camera Kits' : 'CCTV Kits']) {
          const link = mainNav.getByRole('link', { name, exact: true });
          assert.ok(await link.isVisible());
          assert.ok((await link.boundingBox()).height >= 44);
          assert.ok(await link.evaluate(n => n.scrollWidth <= n.clientWidth));
        }
        if (width >= 1100) {
          const more = mainNav.getByRole('button', { name: 'More' });
          await more.focus();
          await page.keyboard.press('Enter');
          await mainNav.getByRole('link', { name: 'All Products', exact: true }).waitFor();
          await page.keyboard.press('Escape');
          assert.equal(await more.getAttribute('aria-expanded'), 'false');
          assert.ok(await more.evaluate(n => n === document.activeElement));
          await more.click();
          await page.locator('h1').click();
          assert.equal(await more.getAttribute('aria-expanded'), 'false');
        } else {
          await page.keyboard.press('Escape');
          assert.ok(await page.getByRole('button', { name: 'Open navigation menu' }).evaluate(n => n === document.activeElement));
        }
        if ([390,1440].includes(width)) await page.screenshot({ path: `${out}/${engine}-after-${width}.png` });
        await page.getByRole('link', { name: 'Browse Smart Locks', exact: true }).click();
        await page.waitForURL('**/#smart-locks');
        assert.equal(new URL(page.url()).hash, '#smart-locks');
        assert.equal(await page.locator('#smart-locks').count(), 1);
        await page.waitForFunction(() => {
          const top = document.querySelector('#smart-locks').getBoundingClientRect().top;
          return top >= 0 && top < innerHeight;
        });
        if (width < 768) {
          const dock = page.getByRole('navigation', { name: 'Quick contact' });
          assert.ok(await dock.isVisible());
          await page.locator('form input[name=name]').focus();
          assert.equal(await dock.isVisible(), false);
          await page.locator('form input[name=name]').evaluate(n => n.blur());
          assert.ok(await dock.isVisible());
        }
        await page.getByRole('link', { name: 'Free Door Check', exact: true }).click();
        await page.waitForURL('**/contact?service=supply-install#quote');
        await page.locator('form').waitFor();
        assert.equal(await page.getByRole('button', { name: 'Supply & install', exact: true }).getAttribute('aria-pressed'), 'true');
        assert.deepEqual(errors, []);
        results.push({ engine, width, pageErrors: errors, passed: true });
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, combinations: results.length, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
