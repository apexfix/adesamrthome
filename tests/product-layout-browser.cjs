(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/product-layout-verification';
  await fs.mkdir(out, { recursive: true });
  const products = [
    ['lockin-x9-smart-lock', 699], ['lockin-s6-max-smart-lock', 1199],
    ['lockin-v5-max-smart-lock', 1350], ['lockin-sv40-smart-lock', 799],
    ['lockin-s50m-pro-smart-lock', 950], ['lockin-ola-slim-smart-lock', 559, 899],
    ['kaadas-k70-se-smart-lock', 1149, 1499],
    ['dahua-5mp-2-camera-poe-security-kit', 443],
    ['dahua-6mp-smart-dual-light-2-camera-poe-kit', 590],
    ['smart-lock-installation-only-service', 200, 350],
  ];
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const [slug, price, otherPrice] of products) {
        const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        const response = await page.goto(`${base}/products/${slug}`, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200);
        assert.equal(await page.locator('h1').count(), 1);
        const isService = slug.includes('only-service');
        const isCamera = slug.startsWith('dahua');
        const service = isService ? 'installation-only' : isCamera ? 'security-camera-kit' : 'supply-install';
        const collectionPath = isService ? '/smart-lock-installation-only-adelaide' : isCamera ? '/products/security-camera-kits' : '/products';
        const pricing = await page.locator('.product-pricing').innerText();
        assert.ok(pricing.includes(`$${price}`), pricing);
        if (otherPrice) assert.ok(pricing.includes(`$${otherPrice}`), pricing);
        if (!isService && !isCamera) assert.match(pricing, /Lock \+ standard Adelaide installation/);
        if (isService) assert.match(await page.locator('.product-scope').innerText(), /customer supplies/);
        if (isCamera) assert.match(pricing, /equipment package/i);
        const schema = await page.locator('main script[type="application/ld+json"]').evaluateAll(ns => ns.map(n => JSON.parse(n.textContent)));
        const item = schema.find(s => s['@type'] === (isService ? 'Service' : 'Product'));
        assert.ok(item);
        if (isService) assert.deepEqual(item.hasOfferCatalog.itemListElement.map(o => Number(o.price)), [200, 350]);
        else assert.equal(Number(item.offers.price), price);
        const crumbs = schema.find(s => s['@type'] === 'BreadcrumbList');
        assert.equal(new URL(crumbs.itemListElement[1].item).pathname, collectionPath);
        assert.equal(await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).locator('a').nth(1).getAttribute('href'), collectionPath);
        const link = page.locator('[data-product-enquiry]');
        const href = new URL(await link.getAttribute('href'), base);
        assert.equal(href.searchParams.get('service'), service);
        assert.equal(href.searchParams.get('product'), await page.locator('h1').innerText());
        for (const width of [360, 390, 768, 1024, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.waitForFunction(() => {
            const image = document.querySelector('.product-gallery-main img');
            return image.complete && image.naturalWidth > 0;
          });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${slug} at ${width}`);
          const boxes = await page.locator('.product-heading, .product-media, .product-purchase').evaluateAll(ns => ns.map(n => {
            const b = n.getBoundingClientRect(); return { x: b.x, y: b.y, right: b.right, bottom: b.bottom };
          }));
          for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
            const a = boxes[i], b = boxes[j];
            assert.ok(a.right <= b.x + 1 || b.right <= a.x + 1 || a.bottom <= b.y + 1 || b.bottom <= a.y + 1, `${slug}: overlapping sections`);
          }
          assert.ok((await link.boundingBox()).height >= 44);
          const mediaWidth = (await page.locator('.product-media').boundingBox()).width;
          assert.ok(Math.abs((await page.locator('.product-gallery-main').boundingBox()).width - mediaWidth) < 2, 'Gallery frame must fill its column in both engines');
          assert.ok(await link.evaluate(n => n.scrollWidth <= n.clientWidth));
          if (slug === 'lockin-x9-smart-lock' && width === 390) assert.ok((await link.boundingBox()).y < 850, 'Mobile enquiry should precede the long copy');
          if (['lockin-x9-smart-lock', 'kaadas-k70-se-smart-lock', 'smart-lock-installation-only-service', 'dahua-6mp-smart-dual-light-2-camera-poe-kit'].includes(slug) && [390, 1440].includes(width)) {
            await page.screenshot({ path: `${out}/${engine}-${slug}-${width}.png` });
          }
          results.push({ engine, slug, width, passed: true });
        }
        const thumbs = page.getByRole('group', { name: 'Product images', exact: true }).getByRole('button');
        if (await thumbs.count() > 1) {
          await thumbs.nth(1).focus();
          await page.keyboard.press('Enter');
          assert.equal(await thumbs.nth(1).getAttribute('aria-pressed'), 'true');
          assert.equal(await thumbs.first().getAttribute('aria-pressed'), 'false');
          const secondSource = await thumbs.nth(1).locator('img').getAttribute('src');
          const selectedSource = await page.locator('.product-gallery-main img').getAttribute('src');
          assert.equal(new URL(selectedSource, base).searchParams.get('url'), new URL(secondSource, base).searchParams.get('url'));
          await page.waitForFunction(() => { const n = document.querySelector('.product-gallery-main img'); return n.complete && n.naturalWidth > 0; });
        }
        await link.click();
        await page.waitForURL('**/contact?**');
        const serviceLabel = isService ? 'Installation only' : isCamera ? 'Security camera kit' : 'Supply & install';
        assert.equal(await page.getByRole('button', { name: serviceLabel, exact: true }).getAttribute('aria-pressed'), 'true');
        assert.deepEqual(errors, [], slug);
        await page.close();
      }
      const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
      await page.goto(base, { waitUntil: 'networkidle' });
      const footer = page.locator('footer');
      const baseline = JSON.parse(await fs.readFile('tests/fixtures/footer-links.json', 'utf8'));
      const current = await footer.locator('a').evaluateAll(ns => ns.map(n => n.getAttribute('href')));
      assert.deepEqual([...new Set(current)].sort(), [...new Set(baseline)].sort(), 'Preserve every existing footer destination');
      assert.ok((await footer.boundingBox()).height < 1806);
      for (const summary of await footer.locator('summary').all()) {
        assert.ok((await summary.boundingBox()).height >= 44);
        await summary.focus();
        await page.keyboard.press('Enter');
        assert.equal(await summary.evaluate(n => n.parentElement.open), true);
      }
      for (const a of await footer.locator('a').all()) assert.ok(await a.isVisible());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      await page.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, responsiveChecks: results.length, products: products.length, engines: 2, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
