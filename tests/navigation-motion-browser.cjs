(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/navigation-motion-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  const origin = 'http://localhost:6650';
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    console.log(JSON.stringify({ engine, stage: 'desktop' }));
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
      await page.addInitScript(() => {
        window.headerEntries = [];
        document.addEventListener('animationstart', event => {
          if (event.animationName === 'header-enter') window.headerEntries.push(event.animationName);
        });
      });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const nav = page.getByRole('navigation', { name: 'Main navigation', exact: true });
      const more = nav.getByRole('button', { name: 'More', exact: true });
      const selected = nav.locator('[data-nav-active="true"]');
      async function expectActive(name) {
        await page.waitForFunction(expected => document.querySelector('.desktop-navigation [data-nav-active="true"]')?.textContent.trim() === expected, name);
        assert.equal(await selected.count(), 1);
        await page.waitForFunction(() => {
          const nav = document.querySelector('.desktop-navigation');
          const active = nav.querySelector('[data-nav-active="true"]').getBoundingClientRect();
          const pill = nav.querySelector('.header-active-indicator').getBoundingClientRect();
          return Math.abs(pill.x - active.x) < 1 && Math.abs(pill.width - active.width) < 1 && Math.abs(pill.y - active.y) < 1;
        });
      }
      await page.goto(`${origin}/products?category=smart-lock&brand=lockin`, { waitUntil: 'networkidle' });
      await expectActive('Smart Locks');
      assert.equal(await selected.getAttribute('aria-current'), 'page');
      assert.equal(new URL(page.url()).searchParams.get('brand'), 'lockin');
      const surface = page.locator('.header-surface');
      const header = page.locator('.site-header');
      await page.waitForFunction(() => document.querySelector('.site-header').dataset.entered === 'true');
      assert.deepEqual(await page.evaluate(() => window.headerEntries), ['header-enter']);
      const topHeight = (await surface.boundingBox()).height;
      assert.equal(topHeight, 72);
      const contentY = await page.locator('#site-content').evaluate(n => n.getBoundingClientRect().y + scrollY);
      await page.evaluate(() => scrollTo({ top: 33, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.header-surface').getBoundingClientRect().height === 64);
      assert.equal(await page.locator('#site-content').evaluate(n => n.getBoundingClientRect().y + scrollY), contentY);
      await page.evaluate(() => scrollTo({ top: 32, behavior: 'instant' }));
      await page.waitForFunction(() => document.querySelector('.header-surface').getBoundingClientRect().height === 72);
      assert.match(await surface.evaluate(n => getComputedStyle(n).transitionDuration), /0.22s/);
      await nav.getByRole('link', { name: 'CCTV Kits', exact: true }).click();
      await page.waitForURL('**/products/security-camera-kits');
      await expectActive('CCTV Kits');
      await more.click();
      await page.goBack({ waitUntil: 'networkidle' });
      await expectActive('Smart Locks');
      assert.equal(await more.getAttribute('aria-expanded'), 'false');
      assert.equal(new URL(page.url()).searchParams.get('brand'), 'lockin');
      await more.click();
      await page.goForward({ waitUntil: 'networkidle' });
      await expectActive('CCTV Kits');
      assert.equal(await more.getAttribute('aria-expanded'), 'false');
      // Same-path query changes must update independently of pathname.
      await page.goto(`${origin}/products?category=security-camera-kits`, { waitUntil: 'networkidle' });
      await expectActive('CCTV Kits');
      await nav.getByRole('link', { name: 'Smart Locks', exact: true }).click();
      await page.waitForURL('**/products?category=smart-lock');
      await expectActive('Smart Locks');
      await page.goBack({ waitUntil: 'networkidle' });
      await expectActive('CCTV Kits');
      for (const [path, expected] of [
        ['/products/kaadas-k70-se-smart-lock', 'Smart Locks'],
        ['/products/smart-lock-installation-only-service', 'Installation Only'],
        ['/products/dahua-6mp-smart-dual-light-2-camera-poe-kit', 'CCTV Kits'],
        ['/about', 'More'],
      ]) {
        await page.goto(origin + path, { waitUntil: 'networkidle' });
        await expectActive(expected);
      }
      await more.click();
      assert.equal(await nav.getByRole('link', { name: 'About', exact: true }).getAttribute('aria-current'), 'page');
      await page.keyboard.press('Escape');
      assert.ok(await more.evaluate(n => n === document.activeElement));
      await more.click();
      await page.locator('main').click({ position: { x: 10, y: 130 } });
      assert.equal(await more.getAttribute('aria-expanded'), 'false');
      for (const width of [1100, 1280, 1920]) {
        await page.setViewportSize({ width, height: 900 });
        await expectActive('More');
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
      }
      // Font metrics and resized labels must not leave the pill at stale coordinates.
      await more.evaluate(n => { n.style.fontSize = '18px'; });
      await expectActive('More');
      await more.evaluate(n => { n.style.fontSize = ''; });
      await page.setViewportSize({ width: 1440, height: 900 });
      await expectActive('More');
      await page.screenshot({ path: `${out}/${engine}-desktop.png` });
      await more.click();
      await page.emulateMedia({ reducedMotion: 'reduce' });
      assert.equal(await header.evaluate(n => getComputedStyle(n).animationName), 'none');
      assert.equal(await surface.evaluate(n => getComputedStyle(n).transitionDuration), '0s');
      assert.equal(await nav.locator('.header-active-indicator').evaluate(n => getComputedStyle(n).transitionDuration), '0s');
      assert.equal(await page.locator('#product-navigation').evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(24, 24, 27)');
      await page.keyboard.press('Escape');
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
      assert.equal(await header.evaluate(n => getComputedStyle(n).animationName), 'none');
      const reduceEffects = page.getByRole('checkbox', { name: 'Reduce visual effects', exact: true });
      await reduceEffects.check();
      await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'reduced');
      await more.click();
      assert.equal(await page.locator('#product-navigation').evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(24, 24, 27)');
      await page.keyboard.press('Escape');
      await reduceEffects.uncheck();
      await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
      results.push({ engine, group: 'desktop-active-motion-history', passed: true });
      for (const [width, height] of [[320,740], [390,844], [844,390], [1024,768]]) {
        console.log(JSON.stringify({ engine, width, height, stage: 'mobile' }));
        await page.setViewportSize({ width, height });
        await page.goto(`${origin}/products?category=smart-lock&brand=lockin`, { waitUntil: 'networkidle' });
        const button = page.getByRole('button', { name: 'Open navigation menu' });
        await button.click();
        const mobile = page.getByRole('navigation', { name: 'Mobile navigation', exact: true });
        const locks = mobile.getByRole('link', { name: 'Smart Locks', exact: true });
        assert.equal(await locks.getAttribute('aria-current'), 'page');
        assert.equal(await mobile.getAttribute('aria-modal'), null);
        assert.equal(await mobile.evaluate(n => getComputedStyle(n).backgroundColor), 'rgba(18, 20, 22, 0.96)');
        await page.emulateMedia({ reducedMotion: 'reduce' });
        assert.equal(await mobile.evaluate(n => getComputedStyle(n).backgroundColor), 'rgb(24, 24, 27)');
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
        for (const link of await mobile.getByRole('link').all()) {
          assert.equal(await link.evaluate(n => getComputedStyle(n).minHeight), '48px');
          assert.ok((await link.boundingBox()).height >= 47.99, `Short target: ${await link.innerText()}`);
        }
        const last = mobile.getByRole('link').last();
        await last.scrollIntoViewIfNeeded();
        const rect = await last.boundingBox();
        assert.ok(rect.y >= 0 && rect.y + rect.height <= height);
        assert.equal(await page.getByRole('navigation', { name: 'Quick contact' }).isVisible(), false);
        await page.screenshot({ path: `${out}/${engine}-${width}x${height}-menu.png` });
        await page.keyboard.press('Escape');
        assert.ok(await button.evaluate(n => n === document.activeElement));
        await button.click();
        await locks.click();
        await page.waitForURL('**/products?category=smart-lock');
        await mobile.waitFor({ state: 'detached' });
        assert.equal(await mobile.count(), 0);
        await button.click();
        await page.goBack({ waitUntil: 'networkidle' });
        await mobile.waitFor({ state: 'detached' });
        assert.equal(await mobile.count(), 0);
        assert.equal(new URL(page.url()).searchParams.get('brand'), 'lockin');
        await button.click();
        await mobile.getByRole('link', { name: 'Smart Locks', exact: true }).focus();
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.waitForFunction(() => document.activeElement?.closest('.desktop-navigation'));
        assert.equal(await mobile.count(), 0);
        await page.setViewportSize({ width, height });
        await page.waitForFunction(() => document.activeElement?.classList.contains('mobile-menu-button'));
        assert.equal(await mobile.count(), 0);
        results.push({ engine, width, height, group: 'mobile-menu', passed: true });
      }
      assert.deepEqual(errors, []);
      await page.close();
      const noJS = await browser.newPage({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
      await noJS.goto(origin, { waitUntil: 'networkidle' });
      assert.ok(await noJS.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Smart Locks', exact: true }).isVisible());
      assert.equal(await noJS.locator('h1').count(), 1);
      results.push({ engine, group: 'server-rendered-header', passed: true });
      await noJS.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, groups: results.length, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
