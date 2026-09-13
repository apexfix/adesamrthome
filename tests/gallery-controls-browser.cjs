(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          await page.goto('http://localhost:6650/gallery', { waitUntil: 'networkidle' });
          const filter = page.getByRole('combobox', { name: 'Lock model' });
          const categories = await filter.locator('option').evaluateAll(nodes => nodes.map(node => node.value));
          for (const category of categories) {
            await filter.selectOption(category);
            const photos = page.locator('button[aria-label^="View full photo:"]');
            const count = await photos.count();
            assert.ok(count > 0);
            const first = photos.first();
            await first.click();
            const dialog = page.getByRole('dialog', { name: 'Installation gallery preview' });
            await dialog.waitFor();
            await dialog.locator('img').evaluate(image => image.decode());
            assert.equal(await dialog.locator('.image-lightbox-toolbar > span').innerText(), `1 / ${count}`);
            await dialog.getByRole('button', { name: 'Zoom in', exact: true }).click();
            const stage = dialog.getByRole('region', { name: 'Enlarged photo' });
            await stage.waitFor();
            assert.ok(await stage.evaluate(node => node.scrollWidth >= node.clientWidth * 1.99 && node.scrollHeight >= node.clientHeight * 1.99));
            await stage.focus();
            await page.keyboard.press('ArrowRight');
            await page.waitForFunction(() => document.querySelector('.image-lightbox-stage').scrollLeft > 0);
            assert.equal(await dialog.locator('.image-lightbox-toolbar > span').innerText(), `1 / ${count}`);
            await page.keyboard.press('Tab');
            assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Reset zoom');
            await page.keyboard.press('Shift+Tab');
            assert.ok(await stage.evaluate(node => node === document.activeElement));
            await dialog.getByRole('button', { name: 'Reset zoom', exact: true }).click();
            assert.ok(await dialog.locator('.image-lightbox-stage').evaluate(node => node.scrollWidth === node.clientWidth));
            if (count > 1) {
              await dialog.getByRole('button', { name: 'Next image', exact: true }).click();
              await page.waitForFunction(() => document.querySelector('.image-lightbox-toolbar > span').textContent.startsWith('2 /'));
              const nextAlt = await photos.nth(1).locator('img').getAttribute('alt');
              assert.equal(await dialog.locator('img').getAttribute('alt'), nextAlt);
            } else assert.equal(await dialog.getByRole('button', { name: 'Next image', exact: true }).count(), 0);
            assert.ok(await dialog.evaluate(node => node.scrollWidth <= node.clientWidth));
            await dialog.locator('img').evaluate(image => image.decode());
            await page.screenshot({ path: `output/gallery-verification/${engine}-${width}-case-${category.replace(/[^a-z0-9]/gi, '-')}.png` });
            await page.keyboard.press('Escape');
            await dialog.waitFor({ state: 'detached' });
            await page.waitForFunction(() => document.activeElement === document.querySelector('button[aria-label^="View full photo:"]'));
            assert.notEqual(await page.evaluate(() => document.body.style.overflow), 'hidden');
            results.push({ engine, width, category, count, passed: true });
          }
          assert.deepEqual(errors, []);
        } finally { await page.close(); }
      }
      const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
      try {
        let fail = false;
        await page.route('**/_next/image?*', route => fail ? route.fulfill({ status: 503, body: 'Synthetic temporary image failure' }) : route.continue());
        await page.goto('http://localhost:6650/products/lockin-ola-slim-smart-lock', { waitUntil: 'networkidle' });
        fail = true;
        await page.locator('.product-gallery-main').click();
        const dialog = page.getByRole('dialog');
        await dialog.getByRole('button', { name: 'Retry image' }).waitFor();
        fail = false;
        await dialog.getByRole('button', { name: 'Retry image' }).click();
        await dialog.locator('img').evaluate(image => image.decode());
        assert.equal(await dialog.getByRole('button', { name: 'Retry image' }).count(), 0);
        await page.keyboard.press('Escape');
        await dialog.waitFor({ state: 'detached' });
        results.push({ engine, retryRecovered: true, passed: true });
      } finally { await page.close(); }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/gallery-verification/controls-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
