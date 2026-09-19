const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = 'http://localhost:6650';
  const routes = ['/airbnb-smart-lock-installation-adelaide', '/service-areas', '/smart-lock-installation-only-adelaide', '/smart-lock-supply-installation-adelaide', '/smart-lock-installation/adelaide-cbd', '/apartment-smart-lock-installation-adelaide', '/zh'];
  const results = [];
  const out = 'output/service-theme';
  await fs.mkdir(out, { recursive: true });
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        const page = await context.newPage();
        try {
          for (const route of routes) {
            await page.goto(base + route, { waitUntil: 'networkidle' });
            for (const font of ['100%', '200%']) {
              await page.evaluate(async value => {
                document.documentElement.style.fontSize = value;
                await document.fonts.ready;
                await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
                window.scrollTo(0, 0);
              }, font);
              const state = await page.evaluate(() => {
                const main = document.querySelector('main');
                const rgb = value => (value.match(/[\d.]+/g) || []).map(Number);
                const dark = value => { const v = rgb(value); return v[3] === 0 || Math.max(...v.slice(0, 3)) <= 40; };
                const heading = document.querySelector('h1').getBoundingClientRect();
                const header = document.querySelector('.header-surface').getBoundingClientRect();
                return {
                  darkMain: dark(getComputedStyle(main).backgroundColor),
                  lightSections: [...main.querySelectorAll(':scope > section')].filter(node => !dark(getComputedStyle(node).backgroundColor)).map(node => node.className),
                  overflow: document.documentElement.scrollWidth > innerWidth + 1,
                  headingClear: heading.top >= header.bottom,
                  links: [...main.querySelectorAll('a[href]')].length,
                };
              });
              assert.equal(state.darkMain, true, route);
              assert.deepEqual(state.lightSections, [], route);
              assert.equal(state.overflow, false, `${route} ${font}`);
              assert.equal(state.headingClear, true, `${route} heading/header ${font}`);
              assert.ok(state.links > 0);
              results.push({ engine, width, route, font, ...state });
              if (font === '100%' && ['/service-areas', '/zh', '/smart-lock-installation-only-adelaide'].includes(route)) {
                await page.screenshot({ path: `${out}/${engine}-${width}-${route.slice(1)}.png` });
                await page.locator('main > section').nth(1).scrollIntoViewIfNeeded();
                await page.screenshot({ path: `${out}/${engine}-${width}-${route.slice(1)}-body.png` });
              }
            }
          }
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ cases: results.length, passed: true }));
})().catch(error => { console.error(error); process.exitCode = 1; });
