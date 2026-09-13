// Compression output sizes are mocked; submission is captured locally, never delivered.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const sharp = require('sharp');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const tiny = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#334455' } }).jpeg().toBuffer();
  const inputBytes = Buffer.concat([tiny, Buffer.alloc(900000 - tiny.length)]);
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const sizes of [[900000, 900000, 900000, 900000], [1000000, 1000000, 750000, 750000], [1000000, 1000000, 750000, 750001]]) {
        const page = await browser.newPage({ viewport: { width: 320, height: 900 } });
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
        await page.addInitScript(sizes => {
          const queue = [...sizes];
          HTMLCanvasElement.prototype.toBlob = function(callback) { callback(new Blob([new Uint8Array(queue.shift())], { type: 'image/jpeg' })); };
          window.__totalPosts = [];
          const original = window.fetch.bind(window);
          window.fetch = async (input, init) => {
            if (new URL(input instanceof Request ? input.url : input, location.href).pathname === '/api/contact') {
              window.__totalPosts.push(init.body.getAll('photos').map(photo => photo.size));
              return new Response(JSON.stringify({ message: 'Local size test' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
            return original(input, init);
          };
        }, sizes);
        try {
          await page.goto('http://localhost:6650/contact?service=installation-only', { waitUntil: 'networkidle' });
          await page.locator('[name=name]').fill('LOCAL TOTAL TEST');
          await page.locator('[name=suburb]').fill('Adelaide');
          await page.locator('[name=email]').fill('test@example.invalid');
          await page.locator('input[type=file]').setInputFiles(sizes.map((_, index) => ({ name: `door-${index}.jpg`, mimeType: 'image/jpeg', buffer: inputBytes })));
          await page.getByRole('button', { name: 'Four photos added', exact: true }).waitFor();
          const total = sizes.reduce((a, b) => a + b, 0);
          const tooLarge = total > 3500000;
          const submit = page.locator('form button[type=submit]');
          assert.equal(await submit.isDisabled(), tooLarge, `Prepared total ${total} must be checked before sending`);
          if (tooLarge) {
            assert.match(await page.locator('form [role=alert]').innerText(), /3.5 MB/);
            // The event guard must also reject direct submission, not only disabled-button clicks.
            await page.locator('form').evaluate(form => form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
            assert.equal(await page.evaluate(() => window.__totalPosts.length), 0);
            await page.getByRole('button', { name: 'Remove door-0.jpg', exact: true }).click();
            assert.equal(await submit.isDisabled(), false);
            assert.equal(await page.locator('form [role=alert]').count(), 0);
          }
          await submit.click();
          await page.waitForFunction(() => window.__totalPosts.length === 1);
          assert.deepEqual(await page.evaluate(() => window.__totalPosts[0]), tooLarge ? sizes.slice(1) : sizes);
          assert.deepEqual(errors, []);
          results.push({ engine, total, blocked: tooLarge, removalRecovered: tooLarge, capturedPayload: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/photo-total', { recursive: true });
  await fs.writeFile('output/photo-total/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, results }));
})().catch(error => { console.error(error); process.exitCode = 1; });
