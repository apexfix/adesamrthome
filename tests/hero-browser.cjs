(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/hero-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const [width, height] of [[320,740],[360,740],[390,844],[430,932],[768,1024],[1024,768],[1440,900],[1920,1080],[844,390]]) {
        const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
        await page.getByRole('button', { name: 'Next slide', exact: true }).waitFor();
        const hero = page.locator('.hero-carousel');
        const fixed = await page.locator('.hero-intro').boundingBox();
        for (let index = 0; index < 3; index++) {
          await page.getByRole('button', { name: new RegExp(`^Show slide ${index + 1}:`) }).click();
          await page.waitForFunction(i => document.querySelector('.hero-carousel').dataset.index === String(i), index);
          await page.evaluate(() => scrollTo(0,0));
          const visibleImage = page.locator('.hero-slide[data-active="true"] img');
          await visibleImage.evaluate(img => img.decode());
          assert.equal(await visibleImage.evaluate(img => getComputedStyle(img).objectFit), 'contain');
          assert.deepEqual(await page.locator('.hero-intro').boundingBox(), fixed);
          assert.equal(await page.locator('h1').count(), 1);
          assert.equal(await page.locator('.hero-primary-cta').getAttribute('href'), '/contact?service=supply-install#quote');
          assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), ['/products/lockin-v5-max-smart-lock', '/products/lockin-x9-smart-lock', '/products/smart-lock-installation-only-service'][index]);
          assert.equal(await page.locator('.hero-slide-link').innerText(), ['Lockin V5 MAX', 'Lockin X9', 'Smart lock installation only'][index]);
          assert.equal(await page.locator('.hero-caption p').innerText(), ['A$1,350 with standard installation.', 'A$699 with standard installation.', '6068 locks A$350; compact locks A$200.'][index]);
          assert.equal(await page.locator('.hero-media img').evaluateAll(images => images.some(image => /kaadas|cctv/i.test(image.src))), false);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
          for (const button of await hero.locator('button').all()) {
            const box = await button.boundingBox();
            assert.ok(box.width >= 44 && box.height >= 44);
            assert.ok(await button.evaluate(n => n.scrollWidth <= n.clientWidth));
          }
          assert.equal(await hero.getAttribute('data-playing'), 'false');
          assert.ok(await page.getByRole('button', { name: 'Play slideshow' }).isDisabled());
          await page.evaluate(() => scrollTo(0,0));
          await page.screenshot({ path: `${out}/${engine}-${width}x${height}-slide-${index+1}.png` });
          const heroBottom = (await hero.boundingBox()).y + (await hero.boundingBox()).height;
          assert.ok(heroBottom < height - 12, `Next section hidden at ${width}x${height}: ${heroBottom}`);
          results.push({ engine, width, height, index, heroBottom, nextSectionVisible: heroBottom < height - 12, passed: true });
        }
        assert.deepEqual(errors, []);
        await page.close();
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/layout-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ layouts: results.length, nextSectionMissing: results.filter(r => !r.nextSectionVisible), evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
