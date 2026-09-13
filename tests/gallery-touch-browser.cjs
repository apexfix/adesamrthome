(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const cdp = await page.context().newCDPSession(page);
    const swipe = async (x, y, dx, dy) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let step = 1; step <= 12; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 12, y: y + dy * step / 12 }] });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    await page.goto('http://localhost:6650/products/lockin-x9-smart-lock', { waitUntil: 'networkidle' });
    const strip = page.locator('.installation-photo-scroller');
    await strip.scrollIntoViewIfNeeded();
    let bounds = await strip.boundingBox();
    const beforeY = await page.evaluate(() => scrollY);
    await swipe(180, bounds.y + 180, 0, -140);
    await page.waitForFunction(y => scrollY > y + 50, beforeY);
    assert.equal(await page.locator('dialog').count(), 0);
    await strip.scrollIntoViewIfNeeded();
    bounds = await strip.boundingBox();
    await swipe(300, bounds.y + 120, -230, 0);
    await page.waitForFunction(() => document.querySelector('.installation-photo-scroller').scrollLeft > 100);
    assert.equal(await page.locator('dialog').count(), 0);
    const result = { passed: true, engine: 'chromium', emulatedTouch: true, verticalPageScroll: true, horizontalPhotoScroll: true, dragDidNotOpenPhoto: true, physicalDeviceVerified: false };
    await fs.writeFile('output/gallery-verification/touch-results.json', JSON.stringify(result, null, 2));
    console.log(JSON.stringify(result));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
