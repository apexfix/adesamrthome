(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/story-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['standard', 'reduced', 'no-js', 'broken-images', 'no-resize-observer']) {
        console.log(`${engine}: ${mode}`);
        const page = await browser.newPage({ javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', viewport: { width: 390, height: 1000 } });
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        if (mode === 'broken-images') await page.route('**/_next/image?**', route => route.fulfill({ status: 404, body: 'Synthetic unavailable image' }));
        if (mode === 'no-resize-observer') await page.addInitScript(() => { window.ResizeObserver = undefined; });
        for (const path of ['/', '/products/lockin-v5-max-smart-lock', '/blog']) {
          await page.goto(`${base}${path}`, { waitUntil: 'networkidle' });
          const cards = page.locator(path === '/blog' ? '.article-card' : '.story-card');
          assert.ok(await cards.count());
          if (path === '/blog') assert.equal(await cards.first().getAttribute('href'), '/blog/smart-lock-door-compatibility-check');
          for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            await cards.first().scrollIntoViewIfNeeded();
            const bounds = await cards.first().evaluate(card => {
              const title = card.querySelector('h2,h3'); const media = card.firstElementChild;
              return { title: title.getBoundingClientRect().toJSON(), media: media.getBoundingClientRect().toJSON(), card: card.getBoundingClientRect().toJSON(), clamp: getComputedStyle(title).webkitLineClamp };
            });
            assert.ok(bounds.title.top >= bounds.media.bottom - 1, `${engine} ${mode} ${path} ${width}: title over photo`);
            assert.ok(bounds.title.left >= bounds.card.left && bounds.title.right <= bounds.card.right);
            assert.equal(bounds.clamp, 'none');
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            assert.equal(await cards.locator('button,a').count(), 0, 'No interactive controls nested in story links');
            results.push({ engine, mode, path, width });
          }
          if (mode === 'broken-images') {
            await cards.first().locator('.gallery-image-fallback').waitFor();
            assert.ok(await cards.first().getAttribute('href'));
          } else if (mode !== 'no-js') {
            await cards.first().locator('img').evaluate(img => img.complete && img.naturalWidth > 0 || new Promise((resolve, reject) => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', reject, { once: true }); }));
          }
          if (path === '/blog') continue;
          const scroller = page.locator('.story-scroller');
          await page.setViewportSize({ width: 390, height: 1000 });
          await scroller.scrollIntoViewIfNeeded();
          if (mode !== 'no-js') {
            await page.getByRole('button', { name: 'Next stories', exact: true }).click();
            await page.waitForFunction(() => document.querySelector('.story-scroller').scrollLeft > 100);
            await page.locator('button[aria-label="Previous stories"]:enabled').waitFor();
            assert.equal(await page.getByRole('button', { name: 'Previous stories', exact: true }).isEnabled(), true);
            await page.getByRole('button', { name: 'Previous stories', exact: true }).click();
            await page.waitForFunction(() => document.querySelector('.story-scroller').scrollLeft < 2);
            if (mode === 'standard') {
              const before = page.url();
              const box = await cards.first().boundingBox();
              await page.mouse.move(box.x + box.width - 35, box.y + 80);
              await page.mouse.down(); await page.mouse.move(box.x + 30, box.y + 80, { steps: 12 }); await page.mouse.up();
              assert.equal(page.url(), before, 'Drag must not open article');
              assert.ok(await scroller.evaluate(node => node.scrollLeft > 50));
            }
          }
          await scroller.focus(); await page.keyboard.press('ArrowRight');
          assert.ok(await scroller.evaluate(node => node.scrollWidth > node.clientWidth));
          if (mode === 'standard' && path === '/') {
            const destination = await cards.first().getAttribute('href');
            await cards.first().focus(); await page.keyboard.press('Enter');
            await page.waitForURL(`${base}${destination}`);
            await page.goBack({ waitUntil: 'networkidle' });
            await page.locator('.story-scroller').waitFor();
          }
        }
        assert.deepEqual(errors, [], `${engine} ${mode}`);
        await page.close();
      }
      const page = await browser.newPage({ viewport: { width: 390, height: 1000 } });
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.locator('.story-rail').scrollIntoViewIfNeeded();
      await page.locator('.story-card').first().locator('img').evaluate(img => img.complete && img.naturalWidth > 0 || new Promise(resolve => img.addEventListener('load', resolve, { once: true })));
      await page.locator('.story-rail').screenshot({ path: `${out}/${engine}-390.png` });
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.locator('.story-rail').screenshot({ path: `${out}/${engine}-1440.png` });
      await page.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/report.json`, JSON.stringify({ results }, null, 2));
  console.log(`PASS ${results.length} story/guide layouts and manual rail navigation checks.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
