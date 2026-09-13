(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/gallery-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const scenario of ['broken', 'slow', 'no-js', 'pointer']) {
        console.log(JSON.stringify({ engine, scenario }));
        const page = await browser.newPage({ viewport: { width: 390, height: 844 }, javaScriptEnabled: scenario !== 'no-js', reducedMotion: 'reduce' });
        let release;
        let delayImages = false;
        let heldRequests = 0;
        const held = new Promise(resolve => { release = resolve; });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        try {
          if (scenario === 'broken') await page.route('**/_next/image?*', route => {
            const src = new URL(route.request().url()).searchParams.get('url') || '';
            return src.includes('ola-slim-single-side') ? route.fulfill({ status: 404, body: 'Synthetic broken image' }) : route.continue();
          });
          if (scenario === 'slow') await page.route('**/_next/image?*', async route => {
            const url = new URL(route.request().url());
            if (delayImages && (url.searchParams.get('url') || '').includes('ola-slim-single-side')) { heldRequests++; await held; }
            await route.continue();
          });
          if (scenario === 'pointer') {
            await page.goto('http://localhost:6650/products', { waitUntil: 'networkidle' });
            await page.locator('main a[href="/products/lockin-x9-smart-lock"]').first().click();
            await page.waitForURL('**/products/lockin-x9-smart-lock');
          } else await page.goto('http://localhost:6650/products/lockin-ola-slim-smart-lock', { waitUntil: 'networkidle' });
          const main = page.locator('.product-gallery-main');
          if (scenario === 'broken') {
            await main.getByText('Image unavailable').waitFor();
            const before = await main.boundingBox();
            await main.click();
            const dialog = page.getByRole('dialog', { name: 'Product image preview' });
            await dialog.getByText('Image unavailable').waitFor();
            assert.ok(await dialog.getByRole('button', { name: 'Close photo preview' }).isEnabled());
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'detached' });
            assert.equal((await main.boundingBox()).height, before.height);
          } else if (scenario === 'slow') {
            await main.locator('img').evaluate(i => i.decode());
            delayImages = true;
            await main.click();
            const dialog = page.getByRole('dialog', { name: 'Product image preview' });
            await dialog.waitFor();
            await dialog.getByRole('status').waitFor();
            assert.ok(heldRequests > 0);
            // A pending high-resolution request must not prevent closing or focus recovery.
            assert.equal(await dialog.locator('img').evaluate(i => i.complete), false);
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'detached' });
            assert.ok(await main.evaluate(n => n === document.activeElement));
            release();
          } else if (scenario === 'no-js') {
            await main.locator('img').evaluate(i => i.decode());
            assert.equal(await page.locator('dialog').count(), 0);
            assert.ok(await page.locator('[data-product-enquiry]').isVisible());
          } else {
            const strip = page.locator('.installation-photo-scroller');
            await strip.scrollIntoViewIfNeeded();
            await page.waitForFunction(() => document.querySelector('.installation-photo-scroller button img')?.complete);
            const bounds = await strip.boundingBox();
            await page.mouse.move(bounds.x + 220, bounds.y + 120);
            await page.mouse.down();
            await page.mouse.move(bounds.x + 60, bounds.y + 120, { steps: 10 });
            await page.mouse.up();
            assert.equal(await page.locator('dialog').count(), 0, 'Dragging must not open a photo');
            assert.ok(await strip.evaluate(n => n.scrollLeft > 0));
            const photo = strip.getByRole('button').nth(1);
            await photo.focus();
            await page.keyboard.press('Enter');
            const dialog = page.getByRole('dialog', { name: 'Installation photo preview' });
            await dialog.waitFor();
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'detached' });
            assert.ok(await photo.evaluate(n => n === document.activeElement));
            await photo.click();
            await dialog.waitFor();
            await dialog.click({ position: { x: 2, y: 2 } });
            await dialog.waitFor({ state: 'detached' });
            await photo.click();
            await dialog.waitFor();
            // Browser history can remove the gallery while a modal is open.
            await page.goBack({ waitUntil: 'networkidle' });
            await page.waitForURL('**/products');
            assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
            assert.equal(await page.locator('dialog').count(), 0);
          }
          assert.deepEqual(errors, []);
          results.push({ engine, scenario, passed: true });
        } finally { release(); await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/edge-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
