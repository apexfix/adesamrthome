const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await context.addInitScript(() => {
      const listeners = [];
      const add = EventTarget.prototype.addEventListener, remove = EventTarget.prototype.removeEventListener;
      const capture = options => typeof options === 'boolean' ? options : Boolean(options?.capture);
      const watched = target => target === window || target === document || target instanceof MediaQueryList;
      EventTarget.prototype.addEventListener = function (type, callback, options) {
        if (watched(this) && !options?.once && !options?.signal && !listeners.some(item => item.target === this && item.type === type && item.callback === callback && item.capture === capture(options))) listeners.push({ target: this, type, callback, capture: capture(options) });
        return add.call(this, type, callback, options);
      };
      EventTarget.prototype.removeEventListener = function (type, callback, options) {
        const index = listeners.findIndex(item => item.target === this && item.type === type && item.callback === callback && item.capture === capture(options));
        if (index >= 0) listeners.splice(index, 1);
        return remove.call(this, type, callback, options);
      };
      const observers = [];
      for (const name of ['IntersectionObserver', 'ResizeObserver']) {
        const Native = window[name];
        window[name] = class extends Native {
          constructor(...args) { super(...args); this.targets = new Set(); observers.push(this); }
          observe(target, ...args) { this.targets.add(target); return super.observe(target, ...args); }
          unobserve(target) { this.targets.delete(target); return super.unobserve(target); }
          disconnect() { this.targets.clear(); return super.disconnect(); }
        };
      }
      const timers = [];
      const timeout = window.setTimeout, clear = window.clearTimeout;
      window.setTimeout = function (callback, delay, ...args) {
        const entry = { delay, cleared: false, fired: false };
        // Hold one-second validation timers so route cleanup, not timing, decides this assertion.
        entry.id = timeout(() => { entry.fired = true; callback(...args); }, delay === 1000 ? 60000 : delay);
        timers.push(entry); return entry.id;
      };
      window.clearTimeout = function (id) { const entry = timers.find(item => item.id === id); if (entry) entry.cleared = true; clear(id); };
      window.lifecycleProbe = {
        timers,
        snapshot() {
          const counts = {};
          for (const item of listeners) {
            const key = `${item.target === window ? 'window' : item.target === document ? 'document' : 'media'}:${item.type}`;
            counts[key] = (counts[key] || 0) + 1;
          }
          return { listeners: counts, observed: observers.reduce((sum, item) => sum + item.targets.size, 0), detached: observers.flatMap(item => [...item.targets]).filter(item => !item.isConnected).length };
        },
      };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
    try {
      await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
      await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
      const cycles = [];
      for (let cycle = 0; cycle < 6; cycle++) {
        await page.locator('.hero-primary-cta').click();
        await page.waitForURL('**/contact?service=supply-install#quote');
        await page.waitForFunction(() => !document.querySelector('form fieldset').disabled);
        const before = await page.evaluate(() => window.lifecycleProbe.timers.length);
        await page.locator('form button[type="submit"]').click();
        const ids = await page.evaluate(before => window.lifecycleProbe.timers.slice(before).filter(timer => timer.delay === 1000).map(timer => timer.id), before);
        assert.equal(ids.length, 1, 'One native-validation debounce timer');
        await page.locator('.header-brand').click();
        await page.waitForURL('http://localhost:6650/');
        await page.waitForFunction(() => document.querySelector('.hero-carousel'));
        await page.waitForFunction(ids => ids.every(id => window.lifecycleProbe.timers.find(timer => timer.id === id).cleared), ids);
        await page.evaluate(() => scrollTo(0, 0));
        await page.waitForTimeout(400);
        const snapshot = await page.evaluate(() => window.lifecycleProbe.snapshot());
        assert.equal(snapshot.detached, 0);
        if (cycle > 0) assert.deepEqual(snapshot.listeners, cycles[0].listeners, 'Global/media listeners must not accumulate on repeat routes');
        cycles.push(snapshot);
      }
      assert.deepEqual(errors, []);
      results.push({ engine, cycles, validationTimersCleared: true, errors, scope: 'Observed route loop/global-media listeners and observer targets; not a heap profiler or all third-party scripts' });
    } finally { await context.close(); await browser.close(); }
  }
  await fs.mkdir('output/lifecycle', { recursive: true });
  await fs.writeFile('output/lifecycle/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, engines: results.length, routeLoops: 12 }));
})().catch(error => { console.error(error); process.exitCode = 1; });
