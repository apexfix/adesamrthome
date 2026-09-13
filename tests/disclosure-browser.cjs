(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/disclosure-verification';
  await fs.mkdir(out, { recursive: true });
  const routes = ['/', '/brands/lockin', '/brands/kaadas', '/products/security-camera-kits', '/smart-lock-installation-only-adelaide', '/smart-lock-supply-installation-adelaide', '/service-areas', '/airbnb-smart-lock-installation-adelaide', '/apartment-smart-lock-installation-adelaide', '/smart-lock-installation/glenelg'];
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          for (const route of routes) {
            console.log(JSON.stringify({ engine, width, route }));
            await page.goto('http://localhost:6650' + route, { waitUntil: 'networkidle' });
            const items = page.locator('details[data-faq]');
            assert.ok(await items.count());
            const schemaMatch = await page.evaluate(() => {
              const faq = [...document.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)).find(data => data['@type'] === 'FAQPage');
              return !!faq && faq.mainEntity.every(item => [...document.querySelectorAll('details[data-faq]')].some(node => node.textContent.includes(item.name) && node.textContent.includes(item.acceptedAnswer.text)));
            });
            assert.equal(schemaMatch, true);
            const item = items.last();
            const summary = item.locator('summary');
            await summary.scrollIntoViewIfNeeded();
            const collapsed = (await item.boundingBox()).height;
            const duration = await summary.evaluate(node => {
              node.click();
              return node.parentElement.getAnimations()[0]?.effect.getTiming().duration;
            });
            assert.equal(duration, 220);
            assert.ok(await item.evaluate(node => node.open));
            assert.equal(await item.locator('[hidden]').count(), 0, 'Answer must not wait for an animation callback to enter the document');
            await item.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))));
            assert.ok((await item.boundingBox()).height > collapsed);
            assert.equal(await item.evaluate(node => node.style.overflow), '');
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            await summary.focus();
            await page.keyboard.press('Enter');
            await page.waitForFunction(node => !node.open, await item.elementHandle());
            assert.ok(await summary.evaluate(node => node === document.activeElement));
            assert.ok(Math.abs((await item.boundingBox()).height - collapsed) < 1);
            await summary.evaluate(node => { node.click(); node.click(); node.click(); });
            assert.ok(await item.evaluate(node => node.getAnimations().length <= 1));
            await item.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))));
            assert.equal(await item.evaluate(node => node.open), true);
            assert.equal(await item.evaluate(node => node.style.overflow), '');
            if (route === '/' || route === '/products/security-camera-kits') await page.screenshot({ path: `${out}/${engine}-${width}-${route === '/' ? 'home' : 'cctv'}.png` });
            results.push({ engine, width, route, passed: true });
          }
          assert.deepEqual(errors, []);
        } finally { await page.close(); }
      }
      for (const scenario of ['no-js', 'reduced', 'live-reduction', 'animation-failure']) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: scenario !== 'no-js', reducedMotion: scenario === 'reduced' ? 'reduce' : 'no-preference' });
        try {
          await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
          const item = page.locator('details[data-faq]').last();
          const summary = item.locator('summary');
          await summary.scrollIntoViewIfNeeded();
          if (scenario === 'animation-failure') await page.evaluate(() => { Element.prototype.animate = () => { throw new Error('Synthetic unavailable animation'); }; });
          await summary.click();
          if (scenario === 'live-reduction') await page.emulateMedia({ reducedMotion: 'reduce' });
          await page.waitForFunction(node => node.open && node.getAnimations().length === 0 && node.style.overflow !== 'hidden', await item.elementHandle());
          assert.ok((await item.boundingBox()).height > (await summary.boundingBox()).height);
          await summary.focus();
          await page.keyboard.press('Space');
          await page.waitForFunction(node => !node.open, await item.elementHandle());
          results.push({ engine, scenario, passed: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
