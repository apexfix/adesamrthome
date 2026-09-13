(async () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const out = 'output/header-text-resize';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const [width, height] of [[320,740],[390,844],[640,390],[768,1024],[1099,900],[1100,900],[1440,1000]]) for (const scale of [100,200]) for (const js of [true,false]) {
        const page = await browser.newPage({ viewport: { width, height }, javaScriptEnabled: js, reducedMotion: 'reduce' });
        page.setDefaultTimeout(10000);
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(base, { waitUntil: 'networkidle' });
        await page.evaluate(value => document.documentElement.style.setProperty('font-size', `${value}%`, 'important'), scale);
        const id = `${engine}-${width}x${height}-${scale}-${js ? 'js' : 'no-js'}`;
        try {
          const metrics = await page.locator('.header-surface').evaluate(surface => {
            const bounds = surface.getBoundingClientRect();
            const children = [...surface.children].filter(n => n.getBoundingClientRect().width > 0);
            return { height: bounds.height, bottom: bounds.bottom, overflow: surface.scrollWidth > surface.clientWidth + 1, children: children.map(n => { const r = n.getBoundingClientRect(); return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, clipped: r.left < bounds.left - 1 || r.right > bounds.right + 1 }; }), brandOverflow: [...surface.querySelectorAll('.header-brand-copy span')].some(n => n.scrollWidth > n.clientWidth + 1) };
          });
          assert.ok(!metrics.overflow && !metrics.brandOverflow && metrics.children.every(n => !n.clipped), `${id}: ${JSON.stringify(metrics)}`);
          for (let index = 1; index < metrics.children.length; index++) assert.ok(metrics.children[index].left >= metrics.children[index - 1].right - 1, `${id}: overlapping header controls`);
          assert.equal(await page.locator('.header-brand-copy > span').first().innerText(), 'ADE SMART HOME');
          const h1 = await page.locator('h1').boundingBox();
          assert.ok(h1.y >= metrics.bottom, `${id}: header ${metrics.bottom} overlaps heading ${h1.y}`);
          await page.screenshot({ path: `${out}/${id}.png` });
          if (width < 1100) {
            const button = page.getByRole('button', { name: 'Open navigation menu', exact: true });
            const box = await button.boundingBox();
            assert.ok(box.width >= 44 && box.width <= 49 && box.height >= 44 && box.height <= 49);
            if (js) {
              await button.click();
              const menu = page.locator('#mobile-navigation');
              const rect = await menu.boundingBox();
              assert.ok(rect.y >= metrics.bottom && rect.y + rect.height <= height + 1, `${id}: menu outside viewport`);
              assert.ok(await menu.evaluate(n => n.scrollWidth <= n.clientWidth + 1), `${id}: menu horizontal overflow`);
              const last = menu.getByRole('link').last();
              await last.focus();
              // WebKit can update the scroll compositing hit-test after focus returns.
              await page.waitForFunction(() => {
                const n = [...document.querySelectorAll('#mobile-navigation a')].at(-1);
                if (!n || document.activeElement !== n) return false;
                const r = n.getBoundingClientRect();
                const m = n.closest('nav').getBoundingClientRect();
                return r.top >= m.top && r.bottom <= m.bottom && n.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
              }, null, { timeout: 1500 });
              await page.keyboard.press('Escape');
              await menu.waitFor({ state: 'detached' });
              assert.ok(await button.evaluate(n => document.activeElement === n));
            }
          }
          if (js) {
            const padding = await page.locator('.hero-carousel').evaluate(n => getComputedStyle(n).paddingTop);
            await page.evaluate(() => window.scrollTo(0, 400));
            await page.waitForFunction(() => document.querySelector('.site-header').dataset.scrolled === 'true');
            await page.waitForFunction(() => getComputedStyle(document.querySelector('.header-surface')).paddingTop === '7px');
            await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
            assert.equal(await page.locator('.hero-carousel').evaluate(n => getComputedStyle(n).paddingTop), padding, `${id}: header contraction moved hero content`);
          }
          assert.deepEqual(errors, []);
          results.push({ engine, width, height, scale, js, passed: true });
        } catch (error) { await page.screenshot({ path: `${out}/failure-${id}.png` }); throw error; }
        finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, layouts: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
