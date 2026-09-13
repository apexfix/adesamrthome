(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = 'http://localhost:6650';
  const out = 'output/seo-content-verification';
  await fs.mkdir(out, { recursive: true });
  const paths = ['/', '/about', '/zh', '/smart-lock-installer-adelaide', '/smart-lock-supply-installation-adelaide', '/products/lockin-x9-smart-lock', '/products/lockin-v5-max-smart-lock', '/products/dahua-5mp-2-camera-poe-security-kit', '/products/dahua-6mp-smart-dual-light-2-camera-poe-kit', '/products/smart-lock-installation-only-service'];
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const path of paths) {
        const page = await browser.newPage({ viewport: { width: 390, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        const response = await page.goto(base + path, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, path);
        const data = await page.evaluate(() => ({
          title: document.title,
          description: document.querySelector('meta[name=description]')?.content,
          canonical: document.querySelector('link[rel=canonical]')?.href,
          robots: document.querySelector('meta[name=robots]')?.content,
          h1: [...document.querySelectorAll('h1')].map(n => n.textContent),
          body: document.body.innerText,
          schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent)),
          og: document.querySelector('meta[property="og:description"]')?.content,
        }));
        assert.equal(data.h1.length, 1, path);
        assert.ok(data.description && data.title);
        assert.equal(data.canonical.replace(/\/$/, ''), ('https://www.adesmarthome.com.au' + path).replace(/\/$/, ''));
        assert.ok(!data.robots?.includes('noindex'));
        assert.ok(!/400\+|Over 400|LimitedAvailability/.test(JSON.stringify(data)), path);
        assert.ok(!/Searchers who ask|When to use this page|route and scope path/.test(data.body));
        const product = data.schema.find(s => s['@type'] === 'Product');
        if (product) {
          const prices = { '/products/lockin-x9-smart-lock': 699, '/products/lockin-v5-max-smart-lock': 1350, '/products/dahua-5mp-2-camera-poe-security-kit': 443, '/products/dahua-6mp-smart-dual-light-2-camera-poe-kit': 590 };
          assert.equal(Number(product.offers.price), prices[path]);
          assert.equal(product.offers.availability, path.includes('5mp-2-camera') ? 'https://schema.org/InStock' : undefined);
        }
        if (path.endsWith('installation-only-service')) {
          assert.ok(!product);
          assert.ok(data.schema.some(s => s['@type'] === 'Service'));
        }
        for (const width of [390, 1440]) {
          await page.setViewportSize({ width, height: 900 });
          try {
            await page.waitForFunction(() => [...document.querySelectorAll('main img')].filter(img => {
              const box = img.getBoundingClientRect();
              let left = Math.max(0, box.left), right = Math.min(innerWidth, box.right);
              let top = Math.max(0, box.top), bottom = Math.min(innerHeight, box.bottom);
              // Horizontally scrolled thumbnails may lie inside the viewport but outside their clipped parent.
              for (let parent = img.parentElement; parent; parent = parent.parentElement) {
                const style = getComputedStyle(parent), clip = parent.getBoundingClientRect();
                if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
                  left = Math.max(left, clip.left); right = Math.min(right, clip.right);
                }
                if (/(auto|scroll|hidden|clip)/.test(style.overflowY)) {
                  top = Math.max(top, clip.top); bottom = Math.min(bottom, clip.bottom);
                }
              }
              return right > left && bottom > top;
            }).every(img => img.complete && img.naturalWidth > 0));
          } catch (error) {
            console.error({ engine, path, width, images: await page.locator('main img').evaluateAll(ns => ns.filter(n => {
              const b = n.getBoundingClientRect(); return b.top < innerHeight && b.bottom > 0 && b.left < innerWidth && b.right > 0 && b.width > 0;
            }).map(n => ({ src: n.currentSrc, complete: n.complete, naturalWidth: n.naturalWidth, loading: n.loading }))) });
            throw error;
          }
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${path} ${width}`);
          if (['/about', '/smart-lock-installer-adelaide', '/zh'].includes(path)) {
            await page.screenshot({ path: `${out}/${engine}-${path.slice(1)}-${width}.png` });
          }
        }
        if (path === '/smart-lock-installer-adelaide') {
          const image = page.locator('main img').first();
          assert.ok(await image.evaluate(n => n.complete && n.naturalWidth > 0));
          await page.getByRole('link', { name: 'Request an Installation Quote', exact: true }).first().click();
          await page.locator('form input[name=name]').waitFor({ state: 'visible' });
        }
        assert.deepEqual(errors, [], path);
        delete data.body;
        results.push({ engine, path, ...data, errors });
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, pages: results.length, responsiveChecks: results.length * 2, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
