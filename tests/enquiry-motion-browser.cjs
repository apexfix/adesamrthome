const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const results = [];
  await fs.mkdir('output/enquiry-motion', { recursive: true });
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) for (const mode of engine === 'chromium' ? ['normal', 'system', 'manual', 'forced'] : ['normal', 'system', 'manual']) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: mode === 'system' ? 'reduce' : 'no-preference', forcedColors: mode === 'forced' ? 'active' : 'none' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        let posts = 0;
        await page.route('**/api/contact', route => {
          posts++;
          return route.fulfill({ status: posts === 1 ? 500 : 200, contentType: 'application/json', body: JSON.stringify(posts === 1 ? { error: 'LOCAL DELIVERY FAILURE' } : { success: true, leadId: 'LOCAL-MOTION-123' }) });
        });
        try {
          await page.goto(`${base}/contact`, { waitUntil: 'networkidle' });
          if (mode === 'manual') await page.evaluate(() => document.documentElement.dataset.visualEffects = 'reduced');
          await page.locator('[name=name]').fill('LOCAL MOTION TEST');
          await page.locator('[name=suburb]').fill('Adelaide');
          await page.locator('[name=email]').fill('test@example.invalid');
          await page.locator('[name=message]').fill('Keep my enquiry text');
          const fields = page.locator('[data-enquiry-service-fields]');
          const services = page.locator('.enquiry-service');
          for (const index of [2, 1, 3, 4, 0, 2, 0]) {
            await services.nth(index).focus();
            await services.nth(index).press('Enter');
            assert.equal(await services.nth(index).getAttribute('aria-pressed'), 'true');
            assert.equal(await services.nth(index).evaluate(node => node === document.activeElement), true);
            assert.equal(await fields.evaluate(node => getComputedStyle(node).animationDuration), mode === 'normal' ? '0.18s' : '0s');
            assert.equal(await page.locator('[name=name]').inputValue(), 'LOCAL MOTION TEST');
            assert.equal(await page.locator('[name=message]').inputValue(), 'Keep my enquiry text');
            assert.equal(await page.locator('.enquiry-received-icon').count(), 0);
          }
          await fields.evaluate(node => { window.__serviceField = node; });
          await page.locator('[name=product]').fill('Lockin X9');
          assert.equal(await fields.evaluate(node => window.__serviceField === node), true, 'Typing must not remount fields');
          await page.locator('form button[type=submit]').click();
          await page.locator('form [role=alert]').waitFor();
          assert.equal(await page.locator('.enquiry-received-icon').count(), 0);
          assert.equal(await page.locator('[name=product]').inputValue(), 'Lockin X9');
          assert.equal(await page.locator('[name=message]').inputValue(), 'Keep my enquiry text');
          assert.equal(await page.locator('[name=email]').inputValue(), 'test@example.invalid');
          await page.locator('form button[type=submit]').click();
          const icon = page.locator('.enquiry-received-icon');
          await icon.waitFor();
          assert.equal(posts, 2);
          // Manual preference is still active during this same-document navigation.
          assert.equal(await icon.evaluate(node => getComputedStyle(node).animationDuration), mode === 'normal' ? '0.3s' : '0s');
          assert.match(await page.locator('[data-enquiry-reference]').innerText(), /LOCAL-MOTION-123/);
          if (mode === 'normal') {
            await page.emulateMedia({ reducedMotion: 'reduce' });
            assert.equal(await icon.evaluate(node => getComputedStyle(node).animationName), 'none');
          }
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          assert.deepEqual(errors, []);
          await page.screenshot({ path: `output/enquiry-motion/${engine}-${width}-${mode}.png` });
          results.push({ engine, width, mode, serviceFocus: true, failedInputPreserved: true, confirmedSuccessOnly: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/enquiry-motion/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, delivery: 'mocked locally' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
