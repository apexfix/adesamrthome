const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');
process.env.NODE_ENV = 'production';
process.env.SMTP_USER = '';
process.env.SMTP_APP_PASSWORD = '';
const next = require('next');
const noJS = process.argv.includes('--nojs');
const out = `output/recovery-next${noJS ? '/nojs' : ''}`;

(async () => {
  const app = next({ dev: false, dir: path.resolve('tests/fixtures/recovery-next'), hostname: '127.0.0.1' });
  await app.prepare();
  const server = http.createServer(app.getRequestHandler());
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  await fs.mkdir(out, { recursive: true });
  try {
    for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
      const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
      try {
        for (const mode of ['page', 'root']) for (const width of [320, 1440]) {
          const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce', javaScriptEnabled: !noJS });
          const page = await context.newPage();
          page.setDefaultTimeout(15000);
          await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
          const errors = [];
          const pending = new Set();
          page.on('pageerror', error => errors.push(error.message));
          page.on('request', request => pending.add(request.url()));
          page.on('requestfinished', request => pending.delete(request.url()));
          page.on('requestfailed', request => pending.delete(request.url()));
          try {
            await context.addCookies([{ name: mode === 'page' ? 'fixture_failure' : 'fixture_root_failure', value: 'on', url: base }]);
            const response = await page.goto(base + (mode === 'page' ? '/fail' : '/'), { waitUntil: 'domcontentloaded' });
            await page.locator('[data-page-recovery]').waitFor();
            assert.notEqual(response.status(), 404);
            assert.ok(!(await page.locator('body').innerText()).includes('Synthetic Next'));
            assert.equal(await page.locator('h1').count(), 1);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            if (mode === 'page') {
              await page.waitForFunction(() => [...document.querySelectorAll('.site-header img')].every(image => image.complete && image.naturalWidth > 0));
              assert.ok(await page.locator('.site-header img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
              assert.equal(await page.locator('.header-brand').evaluate(node => getComputedStyle(node).display), 'flex');
            }
            await page.screenshot({ path: `${out}/${engine}-${mode}-${width}.png` });
            await context.clearCookies();
            await page.getByRole('link', { name: 'Reload page', exact: true }).click();
            await page.getByRole('heading', { name: mode === 'page' ? 'Recovered Next fixture page' : 'Healthy Next fixture home', exact: true }).waitFor();
            assert.equal(await page.locator('[data-page-recovery]').count(), 0);
            assert.deepEqual(errors, []);
            results.push({ engine, mode, width, noJS, errorStatus: response.status(), errors, nativeReloadRecovered: true });
            await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
          } catch (error) {
            console.error(JSON.stringify({ engine, mode, width, errors, pending: [...pending] }));
            throw error;
          } finally { await context.close(); }
        }
      } finally { await browser.close(); }
    }
    await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ passed: true, cases: results.length, noJS, scope: 'Production Next fixture imports actual root layout and error boundaries; injected failures are test-only' }));
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await app.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
