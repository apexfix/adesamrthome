const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const sharp = require('sharp');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = `output/photo-preview/${process.argv.includes('--before') ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const chunks = await fs.readdir('.next/static/chunks');
  const parserChunks = [];
  for (const name of chunks.filter(name => name.endsWith('.js'))) if ((await fs.readFile(`.next/static/chunks/${name}`, 'utf8')).includes('["imageDimensionsFromData",')) parserChunks.push(name);
  assert.equal(parserChunks.length, 1, 'Identify the built lazy metadata parser for loading verification');
  const parserChunk = parserChunks[0];
  const parserBytes = (await fs.stat(`.next/static/chunks/${parserChunk}`)).size;
  const actualPhoto = await fs.readFile('public/img/products/lockin-x9/real-install-01.jpg');
  const portrait = await sharp({ create: { width: 40, height: 80, channels: 3, background: '#406090' } }).withMetadata({ orientation: 6 }).jpeg().toBuffer();
  const large = await sharp({ create: { width: 3200, height: 2000, channels: 4, background: {r:0,g:0,b:0,alpha:0} } }).png().toBuffer();
  const huge = await sharp({ create: { width: 5001, height: 5000, channels: 3, background: '#406090' } }).png().toBuffer();
  assert.ok(huge.length < 850000);
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        page.setDefaultTimeout(10000);
        const errors = [];
        const requestedChunks = new Set();
        page.on('request', request => requestedChunks.add(new URL(request.url()).pathname.split('/').pop()));
        page.on('pageerror', error => errors.push(error.message));
        await page.addInitScript(() => {
          window.__previewSession = Math.random(); window.__previewURLs = new Set(); window.__previewCreated = 0;
          const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
          URL.createObjectURL = file => { if(window.__failPreviewCreation) throw new Error('Synthetic local URL failure'); const url = create(file); window.__previewURLs.add(url); window.__previewCreated++; return url; };
          URL.revokeObjectURL = url => { window.__previewURLs.delete(url); revoke(url); };
        });
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' && new URL(route.request().url()).pathname !== '/api/contact' ? route.continue() : route.abort());
        try {
          await page.goto('http://localhost:6650/contact', { waitUntil: 'networkidle' });
          assert.equal(requestedChunks.has(parserChunk), false, 'Metadata parser should not load before file selection');
          const input = page.locator('input[type=file]');
          await input.setInputFiles({ name: 'rotated.jpg', mimeType: 'image/jpeg', buffer: portrait });
          await page.getByRole('button', { name: 'Remove rotated.jpg', exact: true }).waitFor();
          assert.equal(await page.locator('.enquiry-photo-preview img').count(), 1, 'Selected photos should have a local preview');
          await page.locator('.enquiry-photo-preview[data-state=ready]').waitFor();
          assert.equal(requestedChunks.has(parserChunk), true);
          const dimensions = await page.locator('.enquiry-photo-preview img').evaluate(img => ({ width: img.naturalWidth, height: img.naturalHeight, fit: getComputedStyle(img).objectFit, url: img.src }));
          assert.equal(dimensions.width, 80); assert.equal(dimensions.height, 40); assert.equal(dimensions.fit, 'contain'); assert.ok(dimensions.url.startsWith('blob:http://localhost:6650/'));
          const created = await page.evaluate(() => window.__previewCreated);
          await input.setInputFiles({ name: 'too-many-pixels.png', mimeType: 'image/png', buffer: huge });
          await page.getByText(/This photo exceeds 25 megapixels/).waitFor();
          assert.equal(await page.evaluate(() => window.__previewCreated), created, 'Oversized pixel input must not reach image decoding');
          await input.setInputFiles({ name: 'large-small-file.png', mimeType: 'image/png', buffer: large });
          await page.getByRole('button', { name: 'Remove large-small-file.jpg', exact: true }).waitFor();
          await page.waitForFunction(() => document.querySelectorAll('.enquiry-photo-preview[data-state=ready]').length === 2);
          assert.deepEqual(await page.locator('.enquiry-photo-preview img').last().evaluate(img => [img.naturalWidth, img.naturalHeight]), [1600, 1000]);
          assert.ok(await page.locator('.enquiry-photo-preview img').last().evaluate(img => {
            const canvas=document.createElement('canvas');canvas.width=1;canvas.height=1;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,1,1);
            return [...ctx.getImageData(0,0,1,1).data].every(value=>value>250);
          }), 'Transparency should flatten to white when resized to JPEG');
          await input.setInputFiles([{ name: 'third.jpg', mimeType: 'image/jpeg', buffer: portrait }, { name: 'fourth.jpg', mimeType: 'image/jpeg', buffer: portrait }]);
          await page.waitForFunction(() => document.querySelectorAll('.enquiry-photo-preview[data-state=ready]').length === 4);
          assert.equal(await page.evaluate(() => window.__previewURLs.size), 4);
          for (const font of ['100%', '200%']) {
            await page.evaluate(font => document.documentElement.style.fontSize = font, font);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            assert.ok(await page.locator('.enquiry-photo-row .enquiry-remove').evaluateAll(buttons => buttons.every(button => button.getBoundingClientRect().width >= 48 && button.getBoundingClientRect().height >= 48)));
            await page.locator('.enquiry-photos').screenshot({ path: `${out}/${engine}-${width}-${font.replace('%','')}.png` });
          }
          await page.evaluate(() => document.documentElement.style.fontSize = '100%');
          await page.getByRole('button', { name: 'Remove rotated.jpg', exact: true }).click();
          await page.waitForFunction(() => window.__previewURLs.size === 3);
          await input.setInputFiles({ name: 'rotated.jpg', mimeType: 'image/jpeg', buffer: portrait });
          await page.waitForFunction(() => document.querySelectorAll('.enquiry-photo-preview[data-state=ready]').length === 4);
          await page.getByRole('button', { name: 'Security camera kit', exact: true }).click();
          await page.waitForFunction(() => window.__previewURLs.size === 0);
          await page.getByRole('button', { name: 'Installation only', exact: true }).click();
          await page.evaluate(() => window.__failPreviewCreation = true);
          await input.setInputFiles({ name: 'unavailable.jpg', mimeType: 'image/jpeg', buffer: portrait });
          await page.locator('.enquiry-photo-preview[data-state=failed]').waitFor();
          await page.getByRole('button', { name: 'Remove unavailable.jpg', exact: true }).click();
          await page.evaluate(() => window.__failPreviewCreation = false);
          await input.setInputFiles({ name: 'installation-example.jpg', mimeType: 'image/jpeg', buffer: actualPhoto });
          await page.locator('.enquiry-photo-preview[data-state=ready]').waitFor();
          await page.locator('.enquiry-photos').screenshot({ path: `${out}/${engine}-${width}-actual-photo.png` });
          const session = await page.evaluate(() => window.__previewSession);
          await page.locator('.enquiry-panel a[href="/privacy-policy"]').click();
          await page.waitForURL('**/privacy-policy');
          assert.equal(await page.evaluate(() => window.__previewSession), session, 'Exercise client navigation unmount, not full-document reset');
          await page.waitForFunction(() => window.__previewURLs.size === 0);
          assert.deepEqual(errors, []);
          results.push({ engine, width, orientation: dimensions, pixelGuardBeforeURL: true, boundedThumbnail: true, fourPreviews: true, removeReselect: true, serviceAndUnmountCleanup: true, lazyParser: true, parserBytes });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
