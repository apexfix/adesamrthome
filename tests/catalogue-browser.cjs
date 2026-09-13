(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/catalogue-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  const routes = [
    ['', 10, 3], ['?category=smart-lock', 7, 1], ['?brand=lockin', 6, 1],
    ['?category=security-camera-kits', 2, 1], ['?category=installation-service', 1, 1],
    ['?category=smart-lock&brand=kaadas', 1, 1], ['?category=security-camera-kits&brand=lockin', 0, 0],
  ];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]].filter(([name]) => !process.env.TEST_ENGINE || name === process.env.TEST_ENGINE)) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const javaScriptEnabled of [true, false]) {
        const page = await browser.newPage({ javaScriptEnabled, viewport: { width: 390, height: 1000 } });
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        const failures = []; page.on('requestfailed', request => failures.push({ url: request.url(), failure: request.failure() }));
        for (const [query, count, sections] of routes) {
          const response = await page.goto(`${base}/products${query}`, { waitUntil: 'networkidle' });
          assert.equal(response.status(), 200);
          assert.equal(await page.locator('[data-catalogue-count]').innerText(), `${count} ${count === 1 ? 'result' : 'results'}`);
          assert.equal(await page.locator('[data-catalogue-section]').count(), sections);
          assert.equal(await page.locator('h1').count(), 1);
          const selectStyle = await page.locator('#catalogue-brand').evaluate(node => {
            const style = getComputedStyle(node); return { appearance: style.appearance, colorScheme: style.colorScheme };
          });
          assert.deepEqual(selectStyle, { appearance: 'none', colorScheme: 'dark' });
          assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.adesmarthome.com.au/products');
          if (query) assert.match(await page.locator('meta[name=robots]').last().getAttribute('content'), /noindex/);
          if (!query) {
            assert.equal(await page.locator('[data-catalogue-section]').first().getAttribute('data-catalogue-section'), 'installation-service');
            assert.match(await page.locator('[data-installation-listing]').innerText(), /\$200[\s\S]*\$350/);
            const list = await page.locator('main script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent)).find(n => n['@type'] === 'CollectionPage').mainEntity);
            const visibleOrder = await page.locator('[data-catalogue-section] h3 a, [data-catalogue-section] a.motion-card').evaluateAll(nodes => nodes.map(n => new URL(n.href).pathname));
            assert.deepEqual(list.itemListElement.map(n => new URL(n.url).pathname), visibleOrder);
            assert.equal(list.numberOfItems, count);
          }
          if (count === 0) {
            await page.getByRole('heading', { name: 'No matching products' }).waitFor();
            assert.equal(await page.getByRole('link', { name: 'Clear all filters' }).getAttribute('href'), '/products');
          }
          for (const width of [360, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${engine} ${query} ${width} overflow`);
            assert.ok(await page.locator('main form select, main form button, nav[aria-label="Product categories"] a').evaluateAll(nodes => nodes.every(n => n.getBoundingClientRect().height >= 44)));
            results.push({ engine, javaScriptEnabled, query, width });
          }
          if (javaScriptEnabled && !query) {
            for (const width of [390, 1440]) {
              await page.setViewportSize({ width, height: 1000 });
              for (const img of await page.locator('main img').all()) {
                await img.scrollIntoViewIfNeeded();
                await img.evaluate(image => image.complete && image.naturalWidth > 0 || new Promise((resolve, reject) => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', reject, { once: true }); }));
              }
              await page.evaluate(() => scrollTo(0, 0));
              await page.waitForTimeout(800);
              await page.screenshot({ path: `${out}/${engine}-${width}.png`, fullPage: true });
              await page.screenshot({ path: `${out}/${engine}-${width}-viewport.png` });
            }
          }
        }
        await page.setViewportSize({ width: 390, height: 1000 });
        await page.goto(`${base}/products?category=smart-lock`, { waitUntil: 'networkidle' });
        await page.getByLabel('Brand', { exact: true }).selectOption('lockin');
        await page.getByRole('button', { name: 'Apply', exact: true }).click();
        await page.waitForURL('**/products?category=smart-lock&brand=lockin');
        await page.waitForLoadState('networkidle');
        assert.equal(await page.locator('[data-catalogue-count]').innerText(), '6 results');
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await page.getByLabel('Brand', { exact: true }).inputValue(), 'lockin');
        await page.getByRole('navigation', { name: 'Product categories' }).getByRole('link', { name: 'Security Camera Kits', exact: true }).click();
        await page.waitForURL('**/products?category=security-camera-kits&brand=lockin');
        await page.getByRole('heading', { name: 'No matching products' }).waitFor();
        await page.goBack({ waitUntil: 'networkidle' });
        await page.waitForURL('**/products?category=smart-lock&brand=lockin');
        await page.waitForFunction(() => document.querySelector('[data-catalogue-count]')?.textContent === '6 results');
        assert.equal(await page.getByLabel('Brand', { exact: true }).inputValue(), 'lockin');
        assert.equal(await page.locator('[data-catalogue-count]').innerText(), '6 results');
        await page.getByRole('link', { name: 'Clear filters', exact: true }).click();
        await page.waitForURL('**/products');
        await page.locator('[data-installation-listing]').waitFor();
        assert.equal(await page.getByLabel('Brand', { exact: true }).inputValue(), '');
        await page.locator('[data-installation-listing] h3 a').click();
        await page.waitForURL('**/products/smart-lock-installation-only-service');
        assert.match(await page.locator('.product-pricing').innerText(), /\$200[\s\S]*\$350/);
        await page.goBack({ waitUntil: 'networkidle' });
        await page.locator('[data-installation-listing]').waitFor();
        for (const query of ['?brand=in', '?category=missing', '?category=smart-lock&category=security-camera-kits']) {
          await page.goto(`${base}/products${query}`, { waitUntil: 'networkidle' });
          assert.match((await page.locator('meta[name=robots]').allTextContents()).join('') + await page.locator('meta[name=robots]').evaluateAll(ns => ns.map(n => n.content).join(',')), /noindex/);
          assert.equal(await page.locator('[data-catalogue-section]').count(), 0);
        }
        await fs.writeFile(`${out}/${engine}-${javaScriptEnabled}-events.json`, JSON.stringify({ errors, failures }, null, 2));
        assert.deepEqual(errors, []);
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ results }, null, 2));
  console.log(`PASS ${results.length} catalogue layouts; both engines with/without JavaScript, filter navigation/history/reset and invalid URLs.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
