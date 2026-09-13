const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = 'http://localhost:6650';
const paths = ['/this-page-does-not-exist', '/products/not-a-real-product', '/brands/not-a-real-brand', '/blog/not-a-real-article', '/smart-lock-installation/not-a-real-suburb'];

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/not-found';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const path of paths) for (const config of [
        { width: 320 }, { width: 390 }, { width: 768 }, { width: 1440 },
        { width: 320, enlarged: true }, { width: 390, enlarged: true },
        { width: 320, noJS: true }, { width: 1440, noJS: true },
      ]) {
        const page = await browser.newPage({ viewport: { width: config.width, height: 900 }, javaScriptEnabled: !config.noJS, reducedMotion: 'reduce' });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        try {
          const response = await page.goto(base + path, { waitUntil: 'networkidle' });
          const main = page.locator('[data-not-found]');
          await main.waitFor();
          if (config.enlarged) {
            await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          }
          assert.equal(await page.locator('h1').count(), 1);
          assert.equal(await page.getByRole('heading', { level: 1 }).innerText(), "We couldn't find that page");
          assert.equal(response.status(), 404);
          assert.equal(await page.locator('.mobile-contact-dock').isVisible(), false);
          const robots = await page.locator('meta[name=robots]').evaluateAll(nodes => nodes.map(node => node.content));
          assert.ok(robots.some(value => value.split(',').map(x => x.trim()).includes('noindex')), JSON.stringify(robots));
          assert.deepEqual(await main.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href'))), ['/', '/products', 'sms:+61431060390']);
          const layout = await page.evaluate(() => {
            const main = document.querySelector('[data-not-found]');
            const heading = main.querySelector('h1').getBoundingClientRect();
            const header = document.querySelector('header').getBoundingClientRect();
            return { overflow: document.documentElement.scrollWidth > innerWidth + 1, headingTop: heading.top, headerBottom: header.bottom, links: [...main.querySelectorAll('a')].map(node => { const r = node.getBoundingClientRect(); return { height: r.height, left: r.left, right: r.right }; }) };
          });
          assert.equal(layout.overflow, false, JSON.stringify({ engine, path, config, layout }));
          assert.ok(layout.headingTop > layout.headerBottom);
          assert.ok(layout.links.every(link => link.height >= 48 && link.left >= 0 && link.right <= config.width + 1));
          assert.deepEqual(errors, []);
          results.push({ engine, path, config, status: response.status(), robots, layout });
          if (path === paths[0] && [320, 1440].includes(config.width) && !config.noJS) {
            await page.screenshot({ path: `${out}/${engine}-${config.width}${config.enlarged ? '-enlarged' : ''}.png` });
            if (config.enlarged) await main.locator('a').first().locator('..').screenshot({ path: `${out}/${engine}-${config.width}-enlarged-actions.png` });
          }
          if (path === paths[0] && config.width === 320 && !config.enlarged) {
            await main.getByRole('link', { name: 'Back to home', exact: true }).click();
            await page.waitForURL(base + '/');
            await page.getByRole('heading', { level: 1 }).waitFor();
            assert.equal(await page.locator('[data-not-found]').count(), 0);
          }
        } catch (error) {
          await fs.writeFile(`${out}/failure.html`, await page.content());
          console.error(JSON.stringify({ engine, path, config, errors }));
          throw error;
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, output: out }));
})().catch(error => { console.error(error); process.exitCode = 1; });
