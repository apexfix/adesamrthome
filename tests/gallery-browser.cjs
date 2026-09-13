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
      for (const [width, height] of [[320,740], [390,844], [844,390], [1440,900]]) {
        console.log(JSON.stringify({ engine, width, height }));
        const page = await browser.newPage({ viewport: { width, height } });
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        try {
          await page.goto('http://localhost:6650/products/lockin-x9-smart-lock', { waitUntil: 'networkidle' });
          const main = page.locator('.product-gallery-main');
          await main.locator('img').evaluate(i => i.decode());
          await page.evaluate(() => { document.body.style.overflow = 'auto'; document.body.style.paddingRight = '3px'; });
          await main.focus();
          const before = await page.evaluate(() => ({ y: scrollY, overflow: document.body.style.overflow, padding: document.body.style.paddingRight }));
          await page.keyboard.press('Enter');
          const dialog = page.getByRole('dialog', { name: 'Product image preview' });
          await dialog.waitFor();
          assert.ok(await dialog.evaluate(n => n.matches(':modal')));
          const close = dialog.getByRole('button', { name: 'Close photo preview', exact: true });
          assert.ok(await close.evaluate(n => n === document.activeElement));
          await dialog.locator('img').evaluate(i => i.decode());
          assert.equal(await page.evaluate(() => document.body.style.overflow), 'hidden');
          assert.equal(await page.getByRole('navigation', { name: 'Quick contact' }).isVisible(), false);
          await page.getByRole('link', { name: 'ADE Smart Home home' }).evaluate(n => n.focus());
          assert.ok(await dialog.evaluate(n => n.contains(document.activeElement)), 'Native modal must keep background focus inert');
          for (let i = 0; i < 8; i++) {
            await page.keyboard.press('Tab');
            assert.ok(await dialog.evaluate(n => n.contains(document.activeElement)), 'Tab must stay inside the modal');
          }
          const firstAlt = await dialog.locator('img').getAttribute('alt');
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(() => document.querySelector('.image-lightbox-toolbar > span').textContent.startsWith('2 /'));
          assert.equal(await page.getByRole('group', { name: 'Product images', exact: true }).getByRole('button').nth(1).getAttribute('aria-pressed'), 'true');
          await page.keyboard.press('ArrowLeft');
          assert.equal(await dialog.locator('img').getAttribute('alt'), firstAlt);
          await dialog.getByRole('button', { name: 'Previous image' }).click();
          const count = await page.getByRole('group', { name: 'Product images', exact: true }).getByRole('button').count();
          await page.waitForFunction(count => document.querySelector('.image-lightbox-toolbar > span').textContent === `${count} / ${count}`, count);
          await dialog.getByRole('button', { name: 'Next image' }).click();
          await page.waitForFunction(() => document.querySelector('.image-lightbox-toolbar > span').textContent.startsWith('1 /'));
          await dialog.locator('img').evaluate(i => i.decode());
          const geometry = await dialog.evaluate(n => {
            const frame = n.getBoundingClientRect();
            const image = n.querySelector('.image-lightbox-stage').getBoundingClientRect();
            const toolbar = n.querySelector('.image-lightbox-toolbar').getBoundingClientRect();
            return { frame: { x: frame.x, y: frame.y, width: frame.width, height: frame.height }, imageTop: image.top, imageBottom: image.bottom, toolbarBottom: toolbar.bottom, overflow: document.documentElement.scrollWidth > innerWidth };
          });
          assert.equal(geometry.overflow, false);
          assert.ok(geometry.imageTop >= geometry.toolbarBottom && geometry.imageBottom <= height);
          for (const button of await dialog.getByRole('button').all()) assert.ok((await button.boundingBox()).height >= 47.99);
          await page.screenshot({ path: `${out}/${engine}-${width}x${height}-product.png` });
          await page.mouse.move(width / 2, height / 2);
          await page.mouse.wheel(0, 600);
          assert.equal(await page.evaluate(() => scrollY), before.y);
          await page.keyboard.press('Escape');
          await dialog.waitFor({ state: 'detached' });
          assert.ok(await main.evaluate(n => n === document.activeElement));
          assert.deepEqual(await page.evaluate(() => ({ y: scrollY, overflow: document.body.style.overflow, padding: document.body.style.paddingRight })), before);

          const strip = page.locator('.installation-photo-scroller');
          const photo = strip.getByRole('button').first();
          await photo.focus();
          const stripY = await page.evaluate(() => scrollY);
          await page.keyboard.press('Enter');
          const installationDialog = page.getByRole('dialog', { name: 'Installation photo preview' });
          await installationDialog.waitFor();
          await installationDialog.locator('img').evaluate(i => i.decode());
          await page.keyboard.press('ArrowRight');
          await page.waitForFunction(() => document.querySelector('.image-lightbox-toolbar > span').textContent.startsWith('2 /'));
          await page.screenshot({ path: `${out}/${engine}-${width}x${height}-installation.png` });
          await installationDialog.getByRole('button', { name: 'Close photo preview', exact: true }).click();
          await installationDialog.waitFor({ state: 'detached' });
          await page.waitForFunction(() => document.activeElement === document.querySelector('.installation-photo-scroller button'));
          assert.ok(await photo.evaluate(n => n === document.activeElement));
          assert.equal(await page.evaluate(() => scrollY), stripY);
          assert.match(await strip.evaluate(n => getComputedStyle(n).touchAction), /pan-y|manipulation/);
          assert.match(await strip.evaluate(n => getComputedStyle(n).scrollSnapType), /x mandatory/);
          const right = page.getByRole('button', { name: 'Scroll installation photos right' });
          await right.click();
          await page.waitForFunction(() => document.querySelector('.installation-photo-scroller').scrollLeft > 0);
          await page.waitForFunction(() => !document.querySelector('button[aria-label="Scroll installation photos left"]').disabled);
          assert.ok(await page.getByRole('button', { name: 'Scroll installation photos left' }).isEnabled());
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await photo.focus();
          await page.keyboard.press('Enter');
          await installationDialog.waitFor();
          assert.equal(await installationDialog.evaluate(n => getComputedStyle(n).animationName), 'none');
          await page.keyboard.press('Escape');
          await installationDialog.waitFor({ state: 'detached' });
          assert.deepEqual(errors, []);
          results.push({ engine, width, height, passed: true });
        } catch (error) {
          await page.screenshot({ path: `${out}/${engine}-${width}-failure.png` });
          throw error;
        } finally { await page.close(); }
      }
      const single = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await single.goto('http://localhost:6650/products/lockin-ola-slim-smart-lock', { waitUntil: 'networkidle' });
      await single.locator('.product-gallery-main').click();
      const dialog = single.getByRole('dialog', { name: 'Product image preview' });
      await dialog.waitFor();
      assert.equal(await dialog.getByRole('button', { name: 'Next image' }).count(), 0);
      assert.equal(await single.getByRole('group', { name: 'Product images', exact: true }).count(), 0);
      await single.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' });
      results.push({ engine, singleImage: true, passed: true });
      await single.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
