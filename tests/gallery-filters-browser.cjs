(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const output = 'output/gallery-filter-verification';
  await fs.mkdir(output, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const javaScriptEnabled of [true, false]) {
        const page = await browser.newPage({ javaScriptEnabled, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        for (const [query, count, model] of [['', 6, ''], ['?model=X9', 1, 'X9'], ['?model=V5+Max', 1, 'V5 Max'], ['?model=OLA+Slim&suburb=Adelaide', 1, 'OLA Slim'], ['?suburb=Adelaide', 6, '']]) {
          const response = await page.goto(`${base}/gallery${query}`, { waitUntil: 'networkidle' });
          assert.equal(response.status(), 200);
          assert.equal(await page.getByRole('combobox', { name: 'Lock model' }).inputValue(), model);
          assert.equal(await page.locator('[data-gallery-project]').count(), count);
          assert.equal(await page.getByRole('button', { name: 'Apply', exact: true }).evaluate(node => getComputedStyle(node).color.replace(/\s/g, '')), 'rgb(255,255,255)', 'Apply text remains readable on dark glass');
          assert.match(await page.locator('[data-gallery-count]').innerText(), new RegExp(`^${count} installation`));
          const schema = await page.locator('main script[type="application/ld+json"]').evaluateAll(nodes => nodes.map(n => JSON.parse(n.textContent)).find(s => s['@type'] === 'ImageGallery'));
          assert.equal(schema.associatedMedia.length, count);
          assert.deepEqual(schema.associatedMedia.map(item => item.name), await page.locator('[data-gallery-project] h2').allTextContents());
          assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://www.adesmarthome.com.au/gallery');
          if (query) assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
          else assert.equal(await page.getByRole('combobox', { name: 'Area', exact: true }).count(), 0, 'No redundant one-option area control');
          for (const width of [320, 390, 768, 1440]) {
            await page.setViewportSize({ width, height: 1000 });
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${engine} ${query} ${width}`);
            assert.equal(await page.locator('form select, form button').evaluateAll(nodes => nodes.every(n => n.getBoundingClientRect().height >= 44)), true);
            results.push({ engine, javaScriptEnabled, query, width });
          }
        }
        await page.setViewportSize({ width: 390, height: 1000 });
        await page.goto(`${base}/gallery`, { waitUntil: 'networkidle' });
        const select = page.getByRole('combobox', { name: 'Lock model' });
        await select.selectOption('X9');
        await page.getByRole('button', { name: 'Apply', exact: true }).click();
        await page.waitForURL(url => url.searchParams.get('model') === 'X9');
        await page.waitForLoadState('networkidle');
        assert.equal(await page.locator('[data-gallery-project]').count(), 1);
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await select.inputValue(), 'X9');
        const savedUrl = page.url();
        await page.getByRole('link', { name: 'Clear filters', exact: true }).click();
        await page.waitForURL(`${base}/gallery`);
        await page.waitForFunction(() => document.querySelectorAll('[data-gallery-project]').length === 6);
        assert.equal(await select.inputValue(), '');
        await page.goBack({ waitUntil: 'networkidle' });
        await page.waitForURL(savedUrl);
        await page.waitForFunction(() => document.querySelectorAll('[data-gallery-project]').length === 1);
        assert.equal(await select.inputValue(), 'X9');
        const direct = await browser.newPage({ javaScriptEnabled });
        await direct.goto(savedUrl, { waitUntil: 'networkidle' });
        assert.equal(await direct.locator('[data-gallery-project]').count(), 1);
        await direct.close();
        const photo = page.getByRole('link', { name: 'View full photo: Lockin X9 Installation', exact: true });
        if (!javaScriptEnabled) {
          const src = await photo.getAttribute('href');
          await photo.click();
          await page.waitForURL(`${base}${src}`);
          await page.goBack({ waitUntil: 'networkidle' });
          assert.equal(await select.inputValue(), 'X9');
        }
        await page.getByRole('link', { name: 'View X9', exact: true }).click();
        await page.waitForURL(`${base}/products/lockin-x9-smart-lock`);
        await page.goBack({ waitUntil: 'networkidle' });
        await page.waitForFunction(() => document.querySelectorAll('[data-gallery-project]').length === 1);
        assert.equal(await select.inputValue(), 'X9');
        await page.screenshot({ path: `${output}/${engine}-${javaScriptEnabled}-mobile.png` });
        for (const query of ['?model=missing', '?model=X9&model=SV40', '?suburb=Melbourne']) {
          await page.goto(`${base}/gallery${query}`, { waitUntil: 'networkidle' });
          assert.equal(await page.locator('[data-gallery-project]').count(), 0);
          assert.match(await page.locator('meta[name=robots]').evaluateAll(ns => ns.map(n => n.content).join(',')), /noindex/);
        }
        assert.deepEqual(errors, []);
        await page.close();
      }
      const page = await browser.newPage({ javaScriptEnabled: false });
      for (const name of ['empty', 'absent']) {
        await page.goto(`${base}/gallery`);
        const html = await fs.readFile(`${output}/${name}.html`, 'utf8');
        await page.evaluate(html => { document.querySelector('main').outerHTML = html; }, html);
        for (const width of [320, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        }
        assert.equal(await page.locator('#gallery-empty').isVisible(), true);
      }
      await page.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${output}/browser-report.json`, JSON.stringify({ results }, null, 2));
  console.log(`PASS ${results.length} gallery filter layouts, URL/form/history/reset/no-JS flow and 16 empty-state fixture layouts.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
