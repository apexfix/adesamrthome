(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/visual-effects-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  const key = 'ade-reduce-visual-effects';
  async function expectMode(page, reduced) {
    await page.waitForFunction(expected => document.documentElement.dataset.visualEffects === expected, reduced ? 'reduced' : 'standard');
    const style = await page.locator('.header-surface').evaluate(node => {
      const s = getComputedStyle(node, '::before');
      return { blur: s.backdropFilter || s.webkitBackdropFilter, background: s.backgroundColor, image: s.backgroundImage };
    });
    if (reduced) {
      assert.equal(style.blur, 'none');
      assert.equal(style.background, 'rgb(24, 24, 27)');
      assert.equal(style.image, 'none');
    } else assert.match(style.blur, /blur/);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    if (await page.locator('.mobile-contact-spacer').count()) {
      assert.equal(await page.locator('.mobile-contact-spacer').evaluate(n => getComputedStyle(n).backgroundColor), await page.locator('.site-footer').evaluate(n => getComputedStyle(n).backgroundColor));
    }
  }
  async function expectPhotoScroll(page, behavior) {
    if (!await page.getByRole('button', { name: 'Scroll installation photos right', exact: true }).count()) {
      await page.goto('http://localhost:6650/products/lockin-x9-smart-lock', { waitUntil: 'networkidle' });
    }
    await page.evaluate(() => {
      window.photoScrolls = [];
      const original = Element.prototype.scrollBy;
      Element.prototype.scrollBy = function(options) {
        window.photoScrolls.push(options.behavior);
        return original.call(this, options);
      };
    });
    await page.getByRole('button', { name: 'Scroll installation photos right', exact: true }).click();
    assert.equal(await page.evaluate(() => window.photoScrolls.at(-1)), behavior);
  }
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        for (const scenario of ['normal', 'blocked', 'write-blocked', 'invalid', 'system', 'no-js']) {
          const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: ['system', 'no-js'].includes(scenario) ? 'reduce' : 'no-preference', javaScriptEnabled: scenario !== 'no-js' });
          if (['blocked', 'write-blocked', 'invalid'].includes(scenario)) {
            await context.addInitScript(({ scenario, key }) => {
              if (scenario === 'invalid') localStorage.setItem(key, 'unexpected-value');
              else {
                if (scenario === 'blocked') Object.defineProperty(Storage.prototype, 'getItem', { value() { throw new DOMException('Blocked', 'SecurityError'); } });
                Object.defineProperty(Storage.prototype, 'setItem', { value() { throw new DOMException('Blocked', 'QuotaExceededError'); } });
              }
            }, { scenario, key });
          }
          const page = await context.newPage();
          const errors = [];
          page.on('pageerror', e => errors.push(e.message));
          await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
          const checkbox = page.getByRole('checkbox', { name: 'Reduce visual effects', exact: true });
          if (scenario === 'no-js') {
            assert.equal(await checkbox.count(), 0);
            assert.equal(await page.locator('.header-surface').evaluate(n => getComputedStyle(n, '::before').backgroundColor), 'rgb(24, 24, 27)');
            assert.equal(await page.locator('.header-surface').evaluate(n => getComputedStyle(n, '::before').backdropFilter || getComputedStyle(n, '::before').webkitBackdropFilter), 'none');
            assert.equal(await page.getByRole('region', { name: 'Smart security services' }).getByRole('link', { name: 'Get a Quote', exact: true }).getAttribute('href'), '/contact?service=supply-install#quote');
          } else if (scenario === 'system') {
            await expectMode(page, true);
            assert.ok(await checkbox.isChecked());
            assert.ok(await checkbox.isDisabled());
            await expectPhotoScroll(page, 'instant');
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await expectMode(page, false);
            assert.equal(await checkbox.isChecked(), false);
            assert.equal(await checkbox.isDisabled(), false);
            await checkbox.check();
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await expectMode(page, true);
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            await expectMode(page, true);
            assert.ok(await checkbox.isChecked());
          } else {
            await expectMode(page, false);
            assert.equal(await checkbox.isChecked(), false);
            await checkbox.focus();
            await page.keyboard.press('Space');
            await expectMode(page, true);
            assert.ok(await checkbox.isChecked());
            assert.ok((await checkbox.locator('..').boundingBox()).height >= 44);
            assert.ok(await checkbox.locator('..').evaluate(n => n.scrollWidth <= n.clientWidth));
            if (scenario === 'normal') {
              assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'true');
              await checkbox.scrollIntoViewIfNeeded();
              await page.screenshot({ path: `${out}/${engine}-footer-${width}.png` });
              await page.evaluate(() => scrollTo(0, 0));
              await page.screenshot({ path: `${out}/${engine}-reduced-${width}.png` });
              await page.reload({ waitUntil: 'networkidle' });
              await expectMode(page, true);
              await expectPhotoScroll(page, 'instant');
              await page.getByRole('button', { name: /^Open photo:/ }).first().click();
              const dialog = page.getByRole('dialog', { name: 'Installation photo preview' });
              assert.equal(await dialog.evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(9, 9, 11)');
              assert.equal(await dialog.evaluate(n => getComputedStyle(n).backdropFilter || getComputedStyle(n).webkitBackdropFilter), 'none');
              await page.getByRole('button', { name: 'Close photo preview', exact: true }).first().click();
              const otherTab = await context.newPage();
              await otherTab.goto('http://localhost:6650/contact', { waitUntil: 'networkidle' });
              await expectMode(otherTab, true);
              await otherTab.getByRole('checkbox', { name: 'Reduce visual effects', exact: true }).uncheck();
              await expectMode(page, false);
              await otherTab.close();
              await expectPhotoScroll(page, 'smooth');
              await checkbox.check();
              await page.locator('.site-footer').getByRole('link', { name: 'All Products', exact: true }).click();
              await page.waitForURL('**/products');
              await expectMode(page, true);
              assert.ok(await checkbox.isChecked());
            }
            await checkbox.uncheck();
            await expectMode(page, false);
          }
          assert.deepEqual(errors, []);
          results.push({ engine, width, scenario, passed: true });
          await context.close();
        }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, combinations: results.length, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
