(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const slugs = (await fs.readdir('content/posts')).filter(f => f.endsWith('.md')).map(f => f.slice(0, -3));
  const output = 'output/article-layout-verification';
  await fs.mkdir(output, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['normal', 'failed-images', 'no-js']) {
        const context = await browser.newContext({ javaScriptEnabled: mode !== 'no-js', reducedMotion: 'reduce' });
        const page = await context.newPage();
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        if (mode === 'failed-images') await page.route('**/*', route => route.request().resourceType() === 'image' ? route.abort() : route.continue());
        for (const slug of slugs) {
          await page.goto(`${base}/blog/${slug}`, { waitUntil: 'networkidle' });
          assert.equal(await page.locator('h1').count(), 1);
          assert.ok((await page.locator('.article-content').innerText()).length > 100);
          if (mode === 'failed-images') {
            // Fallbacks remove image nodes. Preserve element identity instead of shifting nth locators.
            for (const img of await page.locator('.article-content img').elementHandles()) {
              if (!await img.evaluate(node => node.isConnected)) continue;
              await img.scrollIntoViewIfNeeded().catch(async error => {
                if (await img.evaluate(node => node.isConnected)) throw error;
              });
            }
            await page.waitForFunction(() => document.querySelectorAll('.article-content img').length === 0);
          }
          for (const card of await page.locator('.article-card').all()) {
            await card.scrollIntoViewIfNeeded();
            assert.ok((await card.getAttribute('href')).startsWith('/blog/'));
            assert.equal(await card.locator('button').count(), 0);
            if (mode === 'failed-images') await card.locator('.gallery-image-fallback').waitFor();
            else {
              await card.locator('img').evaluate(i => i.complete ? null : new Promise(resolve => { i.onload = resolve; i.onerror = resolve; }));
              assert.equal(await card.locator('img').evaluate(i => getComputedStyle(i).objectFit), 'contain');
            }
            assert.equal(await card.locator('h3').evaluate(n => getComputedStyle(n).webkitLineClamp), 'none');
          }
          for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${engine} ${mode} ${slug} ${width}`);
            const collisions = await page.locator('.article-card').evaluateAll(cards => cards.filter(card => {
              const photo = card.firstElementChild.getBoundingClientRect();
              return card.querySelector('h3').getBoundingClientRect().top < photo.bottom;
            }).length);
            assert.equal(collisions, 0);
            results.push({ engine, mode, slug, width });
          }
          if (slug === 'smart-lock-door-compatibility-check') {
            await page.setViewportSize({ width: 390, height: 1000 });
            await page.locator('h1').scrollIntoViewIfNeeded();
            await page.screenshot({ path: `${output}/${engine}-${mode}-reading.png` });
            await page.locator('section[aria-labelledby="continue-reading"]').screenshot({ path: `${output}/${engine}-${mode}-related.png` });
          }
        }
        assert.deepEqual(errors, [], `${engine} ${mode}: runtime exceptions`);
        console.log(`${engine} ${mode}: ${slugs.length} articles checked`);
        await context.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${output}/report.json`, JSON.stringify({ articles: slugs.length, results }, null, 2));
  console.log(`PASS ${results.length} article layouts across ${slugs.length} articles, two engines and normal/failed-image/no-JS states.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
