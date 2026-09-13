const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const [name, body, expected] of [
        ['direct', null, 0], ['missing-reference', { service: 'installation-only' }, 0],
        ['malformed', '{broken', 0],
        ['accepted', { leadId: 'LOCAL-ACCEPTED-123', service: 'installation-only', product: 'Lockin X9', photoCount: 4, preferredTiming: 'within-one-week' }, 1],
      ]) {
        const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' ? route.continue() : route.abort());
        await page.addInitScript(body => {
          window.__leadEvents = [];
          for (const name of ['gtag', 'fbq']) Object.defineProperty(window, name, {
            configurable: true, get: () => (...args) => window.__leadEvents.push([name, ...args]), set: () => {},
          });
          if (!sessionStorage.getItem('local-test-seeded')) {
            sessionStorage.setItem('local-test-seeded', '1');
            if (body !== null) sessionStorage.setItem('ade_completed_lead', typeof body === 'string' ? body : JSON.stringify(body));
          }
        }, body);
        try {
          await page.goto('http://localhost:6650/contact/thank-you', { waitUntil: 'networkidle' });
          const count = async () => page.evaluate(() => ({
            ga: window.__leadEvents.filter(event => event[0] === 'gtag' && event[2] === 'generate_lead').length,
            meta: window.__leadEvents.filter(event => event[0] === 'fbq' && event[2] === 'Lead').length,
          }));
          if (expected) await page.waitForFunction(() => window.__leadEvents.some(event => event[2] === 'generate_lead'));
          assert.deepEqual(await count(), { ga: expected, meta: expected });
          assert.equal(await page.evaluate(() => sessionStorage.getItem('ade_completed_lead')), null);
          await page.reload({ waitUntil: 'networkidle' });
          assert.deepEqual(await count(), { ga: 0, meta: 0 }, 'Refresh must not count another lead');
          assert.deepEqual(errors, []);
          results.push({ engine, name, expected, refreshNoDuplicate: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.mkdir('output/lead-conversion', { recursive: true });
  await fs.writeFile('output/lead-conversion/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, externalAnalytics: 'blocked; calls intercepted locally' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
