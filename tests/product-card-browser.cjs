(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const output = 'output/product-card-verification';
  await fs.mkdir(output, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['normal', 'image-failure', 'no-js']) {
        const context = await browser.newContext({ javaScriptEnabled: mode !== 'no-js', reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        if (mode === 'image-failure') await page.route('**/*', route => route.request().resourceType() === 'image' ? route.abort() : route.continue());
        for (const width of [320, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          await page.goto(`${base}/products`, { waitUntil: 'networkidle' });
          assert.equal(await page.locator('.product-card').count(), 9);
          const cards = page.locator('.product-card');
          for (const card of await cards.all()) {
            await card.scrollIntoViewIfNeeded();
            if (mode === 'image-failure') await card.locator('.gallery-image-fallback').waitFor();
            else await card.locator('img').evaluate(img => img.complete ? null : new Promise(resolve => { img.onload = resolve; img.onerror = resolve; }));
            assert.equal(await card.locator('button').count(), 0, 'No interactive controls nested in card link');
            assert.ok(await card.locator('h3').innerText());
            assert.ok((await card.getAttribute('href')).startsWith('/products/'));
          }
          const service = page.locator('[data-installation-listing]');
          await service.scrollIntoViewIfNeeded();
          if (mode === 'image-failure') await service.locator('.gallery-image-fallback').waitFor();
          const violations = await page.locator('.product-card, [data-installation-listing]').evaluateAll(roots => roots.flatMap(root => {
            const issues = [];
            const bounds = root.getBoundingClientRect();
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              if (!node.textContent.trim()) continue;
              const range = document.createRange(); range.selectNodeContents(node);
              const parent = node.parentElement.closest('.gallery-image-fallback');
              const limit = parent ? parent.getBoundingClientRect() : bounds;
              for (const rect of range.getClientRects()) if (rect.left < limit.left - 1 || rect.right > limit.right + 1) issues.push(node.textContent);
            }
            const media = root.querySelector('.product-card-media');
            if (media) {
              const frame = media.getBoundingClientRect();
              if (Math.abs(frame.width - frame.height) > 1) issues.push('Image frame not square');
              for (const label of root.querySelectorAll('[data-product-badges], [data-product-scope], [data-product-stock]')) {
                if (label.getBoundingClientRect().top < frame.bottom) issues.push('Label overlaps image');
              }
            }
            return issues;
          }));
          assert.deepEqual(violations, [], `${engine} ${mode} ${width}`);
          assert.equal(await page.locator('[data-product-stock]').count(), 1, 'Only explicitly known catalogue stock is labelled');
          assert.equal(await page.locator('[data-product-stock]').innerText(), 'In stock');
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          if (width === 390 || width === 1440) await page.screenshot({ path: `${output}/${engine}-${mode}-${width}.png`, fullPage: true });
          results.push({ engine, mode, width });
        }
        if (mode === 'image-failure') {
          const card = page.locator('.product-card').first();
          const href = await card.getAttribute('href');
          await card.click();
          await page.waitForURL(`${base}${href}`);
          assert.equal(await page.locator('h1').count(), 1);
        }
        assert.deepEqual(errors, [], `${engine} ${mode}: runtime errors`);
        await context.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${output}/report.json`, JSON.stringify({ results }, null, 2));
  console.log(`PASS ${results.length} catalogue card layouts, including failed images and no JavaScript.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
