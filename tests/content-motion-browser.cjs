(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/content-motion-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        for (const mode of ['standard', 'reduced', 'no-js', 'animation-failure']) {
          console.log(JSON.stringify({ engine, width, mode }));
          const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          try {
            await page.addInitScript(({ fail }) => {
              window.__reveals = [];
              const original = Element.prototype.animate;
              Element.prototype.animate = function(frames, options) {
                if (Array.isArray(frames) && frames[0]?.transform === 'translateY(16px)') {
                  window.__reveals.push({ duration: options.duration, delay: options.delay, href: this.getAttribute('href') });
                  if (fail) throw new Error('Synthetic reveal API failure');
                }
                return original.call(this, frames, options);
              };
            }, { fail: mode === 'animation-failure' });
            await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
            const cards = page.locator('#products .motion-card');
            assert.equal(await cards.count(), 4);
            assert.ok(await cards.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1')));
            assert.equal(await page.locator('h1').count(), 1);
            await cards.last().scrollIntoViewIfNeeded();
            if (mode === 'standard' || mode === 'animation-failure') await page.waitForFunction(() => window.__reveals.length > 0);
            if (mode === 'standard') {
              assert.ok(await page.evaluate(() => window.__reveals.every(record => record.duration === 480 && record.delay >= 0 && record.delay <= 210 && record.delay % 70 === 0)));
              await cards.last().focus();
              assert.equal(await cards.last().evaluate(node => getComputedStyle(node).opacity), '1');
              await page.emulateMedia({ reducedMotion: 'reduce' });
              await page.waitForFunction(() => [...document.querySelectorAll('[data-reveal-group] > *')].every(node => node.getAnimations().length === 0));
            }
            await cards.evaluateAll(nodes => Promise.all(nodes.flatMap(node => node.getAnimations().map(animation => animation.finished.catch(() => {})))));
            assert.ok(await cards.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).opacity === '1' && getComputedStyle(node).transform === 'none')));
            assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
            assert.equal(await cards.first().getAttribute('href'), '/products/smart-lock-installation-only-service');
            await page.screenshot({ path: `${out}/${engine}-${width}-${mode}.png` });
            assert.deepEqual(errors, []);
            results.push({ engine, width, mode, passed: true });
          } finally { await page.close(); }
        }
      }
      for (const touch of [false, true]) {
        const page = await browser.newPage({ viewport: { width: touch ? 390 : 1440, height: 900 }, hasTouch: touch, isMobile: touch });
        try {
          await page.goto('http://localhost:6650/products', { waitUntil: 'networkidle' });
          const card = page.locator('.motion-card').first();
          const panel = card.locator('[data-glass-highlight]');
          await panel.scrollIntoViewIfNeeded();
          await card.evaluate(node => Promise.all(node.getAnimations().map(animation => animation.finished.catch(() => {}))));
          const dimensions = await card.evaluate(node => [node.offsetWidth, node.offsetHeight]);
          let bounds = await panel.boundingBox();
          await page.mouse.move(bounds.x + 20, bounds.y + 35);
          if (touch) {
            assert.equal(await panel.getAttribute('data-highlight-active'), null);
            assert.equal(await card.evaluate(node => getComputedStyle(node).translate), 'none');
          } else {
            await page.waitForFunction(() => document.querySelector('[data-highlight-active="true"]'));
            await page.waitForFunction(() => getComputedStyle(document.querySelector('.motion-card')).translate === '0px -4px');
            const before = await panel.evaluate(node => parseFloat(node.style.getPropertyValue('--shine-x')));
            bounds = await panel.boundingBox();
            await page.mouse.move(bounds.x + bounds.width - 20, bounds.y + 35);
            await page.waitForFunction(before => parseFloat(document.querySelector('[data-highlight-active="true"]').style.getPropertyValue('--shine-x')) > before + 30, before);
            assert.match(await panel.evaluate(node => getComputedStyle(node, '::before').transitionDuration), /0.16s/);
            await page.screenshot({ path: `${out}/${engine}-desktop-glass.png` });
          }
          await page.mouse.down();
          await page.waitForFunction(() => getComputedStyle(document.querySelector('.motion-card')).scale === '0.98');
          assert.deepEqual(await card.evaluate(node => [node.offsetWidth, node.offsetHeight]), dimensions);
          await page.mouse.move(1, 1);
          await page.mouse.up();
          await page.waitForFunction(() => !document.querySelector('[data-highlight-active="true"]'));
          await page.emulateMedia({ reducedMotion: 'reduce' });
          await panel.hover();
          assert.equal(await card.evaluate(node => getComputedStyle(node).translate), 'none');
          assert.equal(await card.evaluate(node => getComputedStyle(node).scale), 'none');
          assert.equal(await panel.evaluate(node => getComputedStyle(node, '::before').display), 'none');
          results.push({ engine, touch, cardFeedback: true, passed: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
