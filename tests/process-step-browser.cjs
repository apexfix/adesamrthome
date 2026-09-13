(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/disclosure-verification';
  await fs.mkdir(out, { recursive: true });
  const routes = ['/about', '/smart-lock-installation-only-adelaide', '/airbnb-smart-lock-installation-adelaide', '/apartment-smart-lock-installation-adelaide', '/smart-lock-installation/glenelg', '/contact/thank-you'];
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        try {
          for (const route of routes) {
            await page.goto('http://localhost:6650' + route, { waitUntil: 'networkidle' });
            const steps = page.locator('[data-process-step]');
            const count = await steps.count();
            assert.ok(count >= 3);
            for (const step of await steps.all()) {
              const original = await step.evaluate(node => ({ height: node.getBoundingClientRect().height, text: node.textContent }));
              await step.scrollIntoViewIfNeeded();
              await page.waitForFunction(node => node.dataset.stepMotion === 'active', await step.elementHandle());
              assert.deepEqual(await step.evaluate(node => ({ height: node.getBoundingClientRect().height, text: node.textContent })), original);
              assert.equal(await step.locator('[data-step-number]').evaluate(node => getComputedStyle(node).transitionDuration), '0.22s, 0.22s');
              assert.equal(await step.locator('[aria-current="step"]').count(), 0);
            }
            await page.screenshot({ path: `${out}/${engine}-${width}-${route.replace(/\W/g, '-')}-steps.png` });
            await page.evaluate(() => scrollTo(0, 0));
            assert.equal(await steps.evaluateAll(nodes => nodes.every(node => node.dataset.stepMotion === 'active')), true);
            await page.emulateMedia({ reducedMotion: 'reduce' });
            await page.waitForFunction(() => [...document.querySelectorAll('[data-process-step]')].every(node => !node.hasAttribute('data-step-motion')));
            assert.equal(await steps.first().locator('[data-step-number]').evaluate(node => getComputedStyle(node).textShadow), 'none');
            await page.emulateMedia({ reducedMotion: 'no-preference' });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            results.push({ engine, width, route, count, passed: true });
          }
          await page.evaluate(() => { window.__oldSteps = [...document.querySelectorAll('[data-process-step]')]; });
          await page.getByRole('link', { name: 'ADE Smart Home home' }).click();
          await page.waitForURL('http://localhost:6650/');
          assert.ok(await page.evaluate(() => window.__oldSteps.every(node => !node.hasAttribute('data-step-motion'))));
        } finally { await page.close(); }
      }
      for (const javaScriptEnabled of [false, true]) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled, reducedMotion: 'reduce' });
        try {
          await page.goto('http://localhost:6650/about', { waitUntil: 'networkidle' });
          const steps = page.locator('[data-process-step]');
          assert.equal(await steps.evaluateAll(nodes => nodes.every(node => !node.hasAttribute('data-step-motion'))), true);
          assert.ok(await steps.first().isVisible());
          results.push({ engine, javaScriptEnabled, reduced: true, passed: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/step-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
