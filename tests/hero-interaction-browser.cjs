(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/hero-verification';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: `${out}/recordings`, size: { width: 1280, height: 800 } } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.clock.install();
    async function playing(expected) { await page.waitForFunction(value => document.querySelector('.hero-carousel').dataset.playing === String(value), expected); }
    async function index() { return Number(await page.locator('.hero-carousel').getAttribute('data-index')); }
    async function start() {
      if (await page.locator('.hero-carousel').getAttribute('data-playing') !== 'true') await page.getByRole('button', { name: 'Play slideshow', exact: true }).click();
      await playing(true);
    }
    try {
      await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
      await page.evaluate(() => {
        window.heroEvents = [];
        const root = document.querySelector('.hero-carousel');
        for (const name of ['pointerenter', 'pointerdown', 'focusin', 'click']) root.addEventListener(name, event => window.heroEvents.push({ name, target: event.target.getAttribute('aria-label'), playing: root.dataset.playing, paused: root.dataset.userPaused }), true);
      });
      await page.waitForFunction(() => document.querySelectorAll('.hero-slide img').length === 3 && [...document.querySelectorAll('.hero-slide img')].every(i => i.complete && i.naturalWidth));
      await start();
      let before = await index();
      await page.clock.fastForward(7100);
      await page.waitForFunction(i => Number(document.querySelector('.hero-carousel').dataset.index) === (i + 1) % 3, before);
      assert.equal(await page.locator('.hero-caption').getAttribute('aria-live'), 'off');
      assert.equal(await page.locator('.hero-slide').first().evaluate(n => getComputedStyle(n).transitionDuration), '0.65s');
      await page.mouse.move(100,50);
      await page.locator('[data-playback-control]').hover();
      await playing(false);
      await start();
      await page.getByRole('button', { name: 'Pause slideshow', exact: true }).click();
      await playing(false);
      before = await index();
      await page.clock.fastForward(15000);
      assert.equal(await index(), before);
      await page.getByRole('button', { name: 'Next slide', exact: true }).click();
      assert.equal(await index(), (before + 1) % 3);
      assert.equal(await page.locator('.hero-caption').getAttribute('aria-live'), 'polite');
      await start();
      await page.mouse.move(100,50);
      await page.mouse.move(1000,250);
      await playing(false);
      await page.mouse.move(100,50);
      await page.clock.fastForward(15000);
      await playing(false);
      await start();
      await page.mouse.move(100,50);
      await page.locator('.site-header a').first().focus();
      await page.locator('.hero-primary-cta').focus();
      await playing(false);
      await page.getByRole('button', { name: 'Play slideshow', exact: true }).focus();
      await page.keyboard.press('Enter');
      await playing(true);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await playing(false);
      before = await index();
      await page.clock.fastForward(15000);
      assert.equal(await index(), before);
      assert.ok(await page.getByRole('button', { name: 'Play slideshow', exact: true }).isDisabled());
      await page.emulateMedia({ reducedMotion: 'no-preference' });
      await playing(true);
      await page.mouse.move(100,50);
      await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
      await playing(false);
      before = await index();
      await page.clock.fastForward(15000);
      assert.equal(await index(), before);
      await page.evaluate(() => scrollTo(0,0));
      await playing(true);
      await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, value: true }); document.dispatchEvent(new Event('visibilitychange')); });
      await playing(false);
      before = await index();
      await page.clock.fastForward(15000);
      assert.equal(await index(), before);
      await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
      await playing(true);
      for (let i = 0; i < 8; i++) await page.getByRole('button', { name: 'Next slide', exact: true }).click();
      await playing(false);
      assert.equal(await index(), (before + 8) % 3);
      const media = page.locator('.hero-media');
      async function swipe(start, end) {
        await media.evaluate((node, { start, end }) => {
          for (const [name, field, point] of [['touchstart', 'touches', start], ['touchend', 'changedTouches', end]]) {
            const event = new Event(name, { bubbles: true });
            Object.defineProperty(event, field, { value: [{ clientX: point[0], clientY: point[1] }] });
            node.dispatchEvent(event);
          }
        }, { start, end });
      }
      before = await index();
      await swipe([300,200], [100,205]);
      await page.waitForFunction(i => Number(document.querySelector('.hero-carousel').dataset.index) === (i+1)%3, before);
      before = await index();
      await swipe([300,200], [280,400]);
      assert.equal(await index(), before);
      assert.equal(await media.evaluate(n => getComputedStyle(n).touchAction), 'pan-y pinch-zoom');
      assert.deepEqual(errors, []);
      results.push({ engine, timer: true, pausePlay: true, hoverFocus: true, reducedMotion: true, offscreen: true, syntheticVisibility: true, rapidClick: true, syntheticTouch: true, pageErrors: errors });
    } catch (error) {
      console.log(JSON.stringify({ engine, diagnostic: await page.evaluate(() => ({ state: {...document.querySelector('.hero-carousel').dataset}, hidden: document.hidden, effects: document.documentElement.dataset.visualEffects, events: window.heroEvents })) }));
      await page.screenshot({ path: `${out}/${engine}-interaction-failure.png` });
      throw error;
    } finally { await context.close(); await browser.close(); }
  }
  await fs.writeFile(`${out}/interaction-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, engines: results.length, evidence: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
