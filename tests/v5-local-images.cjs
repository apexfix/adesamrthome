(async () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs/promises');
  const crypto = require('node:crypto');
  const vm = require('node:vm');
  const ts = require('typescript');
  const sharp = require('sharp');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/v5-local-images';
  await fs.mkdir(out, { recursive: true });
  const manifest = JSON.parse(await fs.readFile('docs/assets/v5-max-gallery-provenance.json', 'utf8'));
  const exports = {};
  vm.runInNewContext(ts.transpileModule(await fs.readFile('src/lib/localProducts.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports });
  const product = exports.localProducts.find(p => p.slug === 'lockin-v5-max-smart-lock');
  assert.equal(product.images.length, 18);
  assert.equal(new Set(product.images.map(image => image.alt)).size, 18);
  assert.equal(product.prices.price, '135000');
  assert.equal(manifest.images.length, 18);
  for (const [index, image] of manifest.images.entries()) {
    assert.equal(product.images[index].src, image.localUrl);
    assert.equal(product.images[index].id, 900001 + index);
    const bytes = await fs.readFile(`public${image.localUrl}`);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), image.sha256);
    assert.equal(bytes.length, image.bytes);
    const metadata = await sharp(bytes).metadata();
    assert.equal(metadata.width, image.width); assert.equal(metadata.height, image.height);
    const served = await fetch(`${base}${image.localUrl}`);
    assert.equal(served.status, 200);
    assert.ok(bytes.equals(Buffer.from(await served.arrayBuffer())));
    const optimized = await fetch(`${base}/_next/image?url=${encodeURIComponent(image.localUrl)}&w=750&q=75`, { headers: { Accept: 'image/webp' } });
    assert.equal(optimized.status, 200);
    await sharp(Buffer.from(await optimized.arrayBuffer()), { failOn: 'error' }).raw().toBuffer();
  }
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const errors = [], externalImages = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => {
          const url = new URL(route.request().url());
          if (route.request().resourceType() === 'image' && (url.origin !== new URL(base).origin || /^https?:/.test(url.searchParams.get('url') || ''))) {
            externalImages.push(url.href); return route.abort();
          }
          return route.continue();
        });
        const response = await page.goto(`${base}/products/${product.slug}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        const html = await response.text();
        assert.ok(!html.includes('cdn.shopify.com'));
        assert.match(await page.locator('.product-pricing').innerText(), /\$1350/);
        assert.equal(await page.locator('.product-thumbnails button').count(), 18);
        const main = page.locator('.product-gallery-main');
        for (const [index, image] of manifest.images.entries()) {
          await page.locator('.product-thumbnails button').nth(index).click();
          await page.waitForFunction(src => { const img = document.querySelector('.product-gallery-main img'); return img && new URL(img.currentSrc || img.src).searchParams.get('url') === src && img.complete && img.naturalWidth; }, image.localUrl);
          await main.locator('img').evaluate(img => img.decode());
          assert.equal(await main.locator('img').getAttribute('alt'), product.images[index].alt);
          assert.equal(await main.locator('img').evaluate(img => getComputedStyle(img).objectFit), 'contain');
          await main.click();
          const dialog = page.getByRole('dialog', { name: 'Product image preview' });
          await dialog.locator('img').evaluate(img => img.decode());
          assert.equal(await dialog.locator('.image-lightbox-toolbar > span').innerText(), `${index + 1} / 18`);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'detached' });
          results.push({ engine, width, image: index + 1, passed: true });
        }
        await page.locator('.product-thumbnails button').first().click();
        await main.locator('img').evaluate(img => img.decode());
        await page.evaluate(() => scrollTo(0, 0));
        await page.screenshot({ path: `${out}/${engine}-${width}.png` });
        assert.deepEqual(errors, []); assert.deepEqual(externalImages, []);
        await page.close();
      }
      for (const scenario of ['no-js', 'local-images-failed']) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: scenario !== 'no-js' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        if (scenario === 'local-images-failed') await page.route('**/_next/image?*', route => new URL(route.request().url()).searchParams.get('url')?.includes('/lockin-v5-max/gallery/') ? route.fulfill({ status: 503, body: 'Synthetic local asset failure' }) : route.continue());
        await page.goto(`${base}/products/${product.slug}`, { waitUntil: 'networkidle' });
        if (scenario === 'no-js') await page.locator('.product-gallery-main img').evaluate(img => img.decode());
        else await page.locator('.product-gallery-main .gallery-image-fallback').waitFor();
        assert.ok((await page.locator('meta[property="og:image"]').first().getAttribute('content')).includes(manifest.images[0].localUrl));
        const quote = page.locator('a[href^="/contact?service=supply-install&product="]').first();
        await quote.evaluate(link => link.scrollIntoView({ block: 'center', behavior: 'instant' }));
        await quote.click();
        await page.waitForURL(url => url.pathname === '/contact' && url.searchParams.get('product') === product.name);
        assert.deepEqual(errors, []);
        results.push({ engine, scenario, passed: true });
        await page.close();
      }
      if (engine === 'chromium') {
        const sheet = await browser.newPage({ viewport: { width: 1200, height: 800 } });
        for (let start = 0; start < manifest.images.length; start += 6) {
          let html = '<style>body{margin:12px;font:16px Arial;display:grid;grid-template-columns:repeat(3,1fr);gap:12px}figure{margin:0}img{width:380px;height:345px;object-fit:contain;background:white}figcaption{padding:8px}</style>';
          for (const image of manifest.images.slice(start, start + 6)) {
            const data = (await fs.readFile(`public${image.localUrl}`)).toString('base64');
            html += `<figure><img src="data:image/${image.format};base64,${data}"><figcaption>${image.position}: ${image.width} x ${image.height}</figcaption></figure>`;
          }
          await sheet.setContent(html);
          await sheet.locator('img').evaluateAll(imgs => Promise.all(imgs.map(img => img.decode())));
          await sheet.screenshot({ path: `${out}/source-review-${start + 1}.png` });
        }
        await sheet.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify({ files: manifest.images.length, galleryChecks: results }, null, 2));
  console.log(JSON.stringify({ files: manifest.images.length, galleryChecks: results.length, passed: true }));
})().catch(error => { console.error(error); process.exitCode = 1; });
