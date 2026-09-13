const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const paths = [
    '/products/security-camera-kits',
    '/products/dahua-5mp-2-camera-poe-security-kit',
    '/products/dahua-6mp-smart-dual-light-2-camera-poe-kit',
    '/blog/security-camera-kits-adelaide-buying-guide',
    '/contact?service=security-camera-kit',
    '/contact/thank-you?service=security-camera-kit',
  ];
  const removed = /Plan the views you actually need|Local product advice in Adelaide|discuss coverage|camera kit advice|Planning your camera setup|coverage requirements|areas you (?:want|would like) to monitor|help planning views/i;
  await fs.mkdir('output/camera-content-scope', { recursive: true });
  let count = 0;
  for (const [name, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(name === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 } });
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        try {
          for (const path of paths) {
            assert.equal((await page.goto('http://localhost:6650' + path)).status(), 200);
            await page.locator('main').waitFor();
            assert.doesNotMatch(await page.content(), removed, path);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path);
            if (path === paths[0]) {
              assert.equal(await page.locator('#camera-planning').count(), 0);
              const body = await page.locator('main').innerText();
              assert.match(body, /443/);
              assert.match(body, /590/);
              await page.screenshot({ path: `output/camera-content-scope/${name}-${width}.png`, fullPage: true });
            }
            if (path === paths[4]) {
              await page.getByPlaceholder('Enter the package name, quantity or a question about listed product specifications.').waitFor();
            }
            count++;
          }
          assert.deepEqual(errors, []);
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  assert.doesNotMatch(await fs.readFile('src/app/api/contact/route.ts', 'utf8'), removed);
  console.log(`PASS: ${count} camera page layouts, removed advice copy, metadata, contact placeholder and email source. No enquiry submitted.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
