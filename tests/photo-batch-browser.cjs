// Local browser flows; every submission is intercepted and no mail is sent.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const sharp = require('sharp');
const { randomBytes } = require('node:crypto');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = `output/photo-batch/${process.argv.includes('--before') ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const small = await sharp({ create: { width: 30, height: 30, channels: 3, background: '#334455' } }).png().toBuffer();
  const large = await sharp(randomBytes(1200 * 1200 * 3), { raw: { width: 1200, height: 1200, channels: 3 } }).jpeg({ quality: 100 }).toBuffer();
  assert.ok(large.length > 850000);
  const file = name => ({ name, mimeType: 'image/png', buffer: small });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        await context.addInitScript(() => {
          window.__photoPosts = [];
          window.__photoURLs = new Set();
          const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
          URL.createObjectURL = value => { const url = create(value); window.__photoURLs.add(url); return url; };
          URL.revokeObjectURL = url => { window.__photoURLs.delete(url); revoke(url); };
          const original = window.fetch.bind(window);
          window.fetch = async (input, init) => {
            if (new URL(input instanceof Request ? input.url : input, location.href).pathname === '/api/contact') {
              window.__photoPosts.push(init.body.getAll('photos').map(photo => ({ name: photo.name, size: photo.size })));
              return new Response(JSON.stringify({ message: 'Local batch test response' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
            }
            return original(input, init);
          };
        });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.setDefaultTimeout(10000);
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
        try {
          await page.goto('http://localhost:6650/contact?service=installation-only', { waitUntil: 'networkidle' });
          await page.locator('[name=name]').fill('LOCAL BATCH TEST');
          await page.locator('[name=suburb]').fill('Adelaide 5000');
          await page.locator('[name=email]').fill('test@example.invalid');
          const input = page.locator('input[type=file]');
          const remove = name => page.getByRole('button', { name: `Remove ${name}`, exact: true });
          await input.setInputFiles(file('existing.png'));
          await remove('existing.png').waitFor();
          const badName = 'private-address-' + 'long-name-'.repeat(12) + '.heic';
          await input.setInputFiles([file('good.png'), { name: badName, mimeType: 'image/heic', buffer: small }]);
          await page.locator('form [role=alert]').waitFor();
          assert.equal(await remove('good.png').count(), 1, 'Valid photo in a mixed batch must be retained');
          assert.equal(await remove('existing.png').count(), 1);
          assert.match(await page.locator('form [role=alert]').innerText(), /heic/);
          await page.evaluate(() => document.documentElement.style.fontSize = '200%');
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), 'Long failure names must wrap');
          await page.locator('form [role=alert]').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${out}/${engine}-${width}-mixed-large.png` });
          await page.evaluate(() => document.documentElement.style.fontSize = '100%');
          await page.locator('form [role=alert]').scrollIntoViewIfNeeded();
          await page.screenshot({ path: `${out}/${engine}-${width}-mixed-normal.png` });
          await page.locator('form button[type=submit]').click();
          await page.waitForFunction(() => window.__photoPosts.length === 1);
          assert.deepEqual(await page.evaluate(() => window.__photoPosts[0].map(photo => photo.name)), ['existing.png', 'good.png']);
          await input.setInputFiles({ name: 'broken-large.png', mimeType: 'image/png', buffer: Buffer.alloc(900000, 7) });
          await page.getByRole('button', { name: 'Add another photo', exact: true }).waitFor();
          assert.match(await page.locator('form [role=alert]').first().innerText(), /broken-large.png/);
          assert.equal(await page.evaluate(() => window.__photoURLs.size), 0);
          await remove('good.png').click();
          await input.setInputFiles(file('good.png'));
          await remove('good.png').waitFor();
          await input.setInputFiles([file('third.png'), file('fourth.png'), file('fifth.png')]);
          assert.match(await page.locator('form [role=alert]').first().innerText(), /no more than 4/);
          assert.equal(await page.getByRole('button', { name: /^Remove / }).count(), 2);

          // Pause compression before switching service; stale results must not add hidden photos.
          await page.evaluate(() => {
            const original = HTMLCanvasElement.prototype.toBlob;
            HTMLCanvasElement.prototype.toBlob = function(callback, ...args) {
              window.__releasePhoto = () => original.call(this, callback, ...args);
            };
          });
          await input.setInputFiles([{ name: 'large.jpg', mimeType: 'image/jpeg', buffer: large }, { name: 'unsupported.heic', mimeType: 'image/heic', buffer: small }]);
          await page.waitForFunction(() => typeof window.__releasePhoto === 'function');
          assert.equal(await page.locator('form button[type=submit]').isDisabled(), true);
          assert.equal(await remove('existing.png').isDisabled(), true);
          await page.getByRole('button', { name: 'Security camera kit', exact: true }).click();
          await page.evaluate(() => window.__releasePhoto());
          await page.waitForFunction(() => window.__photoURLs.size === 0);
          await page.getByRole('button', { name: 'Installation only', exact: true }).click();
          assert.equal(await page.getByRole('button', { name: /^Remove / }).count(), 0);
          assert.deepEqual(errors, []);
          results.push({ engine, width, mixedRetained: true, sentOnlyAccepted: true, invalidLargeReleased: true, retrySameFile: true, excessCountPreserved: true, staleServiceIgnored: true, enlargedErrorFits: true });
          await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
        } catch (error) {
          console.error(JSON.stringify({ engine, width, errors, alerts: await page.locator('form [role=alert]').allTextContents(), state: await page.evaluate(() => ({ release: typeof window.__releasePhoto, urls: [...window.__photoURLs] })) }));
          await page.screenshot({ path: `${out}/${engine}-${width}-failure.png` });
          throw error;
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
  console.log(JSON.stringify({ passed: true, cases: results.length, results }));
})().catch(error => { console.error(error); process.exitCode = 1; });
