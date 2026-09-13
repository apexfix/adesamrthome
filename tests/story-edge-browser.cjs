(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = 'http://localhost:6650';
  const out = 'output/story-verification';
  const html = await (await fetch(base)).text();
  const styles = [...html.matchAll(/href="([^"]+\.css[^\"]*)"/g)].map(match => `<link rel="stylesheet" href="${base}${match[1]}">`).join('');
  let cases = 0;
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      const page = await browser.newPage({ viewport: { width: 320, height: 1000 } });
      for (const count of [0, 1, 2, 6]) {
        const fixture = await fs.readFile(`${out}/fixture-${count}.html`, 'utf8');
        await page.setContent(`<html><head>${styles}</head><body style="margin:0;background:#09090b;color:white"><main style="padding:20px">${fixture}</main></body></html>`);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        assert.equal(await page.locator('.story-card').count(), count);
        if (count) {
          assert.ok(await page.locator('.story-card').first().evaluate(card => {
            const title = card.querySelector('h3'), range = document.createRange(); range.selectNodeContents(title);
            const box = card.getBoundingClientRect();
            return [...range.getClientRects()].every(rect => rect.right <= box.right && rect.left >= box.left && rect.bottom <= box.bottom);
          }));
          assert.equal(await page.locator('.gallery-image-fallback').count(), count);
        }
        cases++;
      }
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.getByRole('checkbox', { name: 'Reduce visual effects' }).check();
      const card = page.locator('.story-card').first();
      await card.hover();
      assert.equal(await card.evaluate(n => getComputedStyle(n).translate), 'none');
      assert.equal(await card.locator('[data-glass-highlight]').evaluate(n => getComputedStyle(n, '::before').display), 'none');
      await page.close();
      cases++;
      if (engine === 'chrome') {
        const touch = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
        const cdp = await touch.context().newCDPSession(touch);
        const swipe = async (x, y, dx, dy) => {
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
          for (let i = 1; i <= 12; i++) {
            await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * i / 12, y: y + dy * i / 12 }] });
            await touch.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
          }
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        };
        await touch.goto(base, { waitUntil: 'networkidle' });
        const rail = touch.locator('.story-scroller');
        await rail.scrollIntoViewIfNeeded();
        let bounds = await rail.boundingBox();
        const y = await touch.evaluate(() => scrollY);
        await swipe(180, bounds.y + 180, 0, -140);
        await touch.waitForFunction(before => scrollY > before + 50, y);
        assert.equal(new URL(touch.url()).pathname, '/');
        await rail.scrollIntoViewIfNeeded(); bounds = await rail.boundingBox();
        await swipe(300, bounds.y + 120, -230, 0);
        await touch.waitForFunction(() => document.querySelector('.story-scroller').scrollLeft > 100);
        assert.equal(new URL(touch.url()).pathname, '/');
        await touch.close(); cases++;
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/edge-report.json`, JSON.stringify({ passed: true, cases, physicalDeviceTested: false }, null, 2));
  console.log(`PASS ${cases} story fixture, manual reduction and touch-emulation cases.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
