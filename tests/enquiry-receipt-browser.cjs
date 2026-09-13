const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) for (const service of ['installation-only', 'security-camera-kit']) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        page.setDefaultTimeout(7000);
        let posts = 0;
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
        await page.route('**/api/contact', route => { posts++; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, leadId: 'LOCAL-RECEIPT-123' }) }); });
        await page.addInitScript(() => {
          const set = Storage.prototype.setItem;
          Storage.prototype.setItem = function(key, value) { if (key === 'ade_completed_lead') throw new DOMException('Blocked', 'SecurityError'); return set.call(this, key, value); };
        });
        try {
          await page.goto(`http://localhost:6650/contact?service=${service}`, { waitUntil: 'networkidle' });
          await page.locator('[name=name]').fill('LOCAL RECEIPT TEST');
          await page.locator('[name=suburb]').fill('Adelaide');
          await page.locator('[name=email]').fill('test@example.invalid');
          await page.locator('form button[type=submit]').click();
          const receipt = page.locator('[data-enquiry-receipt]');
          await receipt.waitFor();
          assert.ok(!page.url().includes('/thank-you'), 'Storage failure needs an inline receipt');
          assert.match(await receipt.innerText(), /LOCAL-RECEIPT-123/);
          assert.match(await receipt.innerText(), /No need to send it again/);
          assert.equal(await page.locator('form button[type=submit]').count(), 0);
          assert.equal(await receipt.evaluate(node => node === document.activeElement), true);
          assert.equal(posts, 1);
          for (const font of ['100%', '200%']) {
            await page.evaluate(font => document.documentElement.style.fontSize = font, font);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            for (const link of await receipt.locator('a').all()) assert.ok(await link.evaluate(node => node.getBoundingClientRect().height >= 48));
          }
          assert.match(await receipt.locator('a[href^="sms:"]').getAttribute('href'), /LOCAL-RECEIPT-123/);
          assert.deepEqual(errors, []);
          results.push({ engine, width, service, inlineReceipt: true, duplicateActionRemoved: true, focus: true, textResize: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/enquiry-receipt', { recursive: true });
  await fs.writeFile('output/enquiry-receipt/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
