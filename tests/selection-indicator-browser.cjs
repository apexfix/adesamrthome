(async () => {
  const assert = require('node:assert/strict');
  const fs = require('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const results = [];
  await fs.mkdir('output/selection-verification', { recursive: true });
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['normal', 'reduced', 'no-observer', 'no-js', 'forced-colors']) {
        if (process.env.SELECTION_MODE && process.env.SELECTION_MODE !== mode) continue;
        for (const width of [320, 1440]) {
          for (const font of [100, 200]) {
            const context = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled: mode !== 'no-js', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference', forcedColors: mode === 'forced-colors' ? 'active' : 'none' });
            await context.route('**/*', route => {
              const url = new URL(route.request().url());
              return url.origin === new URL(base).origin && route.request().method() === 'GET' ? route.continue() : route.abort();
            });
            if (mode === 'no-observer') await context.addInitScript(() => { window.ResizeObserver = undefined; });
            const page = await context.newPage();
            page.setDefaultTimeout(10000);
            page.setDefaultNavigationTimeout(15000);
            const errors = [];
            page.on('pageerror', error => errors.push(error.message));
            const open = async path => {
              console.log(JSON.stringify({ checking: { engine, mode, width, font, path } }));
              await page.goto(base + path, { waitUntil: 'networkidle' });
              await page.evaluate(font => document.documentElement.style.setProperty('font-size', `${font}%`, 'important'), font);
            };
            const check = async selector => {
              const group = page.locator(selector);
              const selected = group.locator(':scope > [aria-current="page"], :scope > [aria-pressed="true"]');
              assert.equal(await selected.count(), 1);
              if (['normal', 'reduced'].includes(mode)) {
                await page.waitForFunction(selector => {
                  const group = document.querySelector(selector);
                  const indicator = group.querySelector('.selection-indicator');
                  const selected = group.querySelector(':scope > [aria-current="page"], :scope > [aria-pressed="true"]');
                  const a = indicator.getBoundingClientRect(), b = selected.getBoundingClientRect();
                  return indicator.dataset.ready === 'true' && ['x', 'y', 'width', 'height'].every(key => Math.abs(a[key] - b[key]) < 1.5);
                }, selector);
                if (mode === 'reduced') assert.equal(await group.locator('.selection-indicator').evaluate(node => getComputedStyle(node).transitionDuration), '0s');
              } else {
                assert.equal(await group.locator('.selection-indicator').isVisible(), false);
              }
              assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), true);
              if (selector === '.enquiry-services') {
                if (mode !== 'forced-colors') assert.notEqual(
                  await selected.evaluate(node => getComputedStyle(node).backgroundColor),
                  await group.locator('button[aria-pressed="false"]').first().evaluate(node => getComputedStyle(node).backgroundColor),
                  'Static selection must remain visible even before hydration or with disabled controls',
                );
                assert.equal(await group.evaluate(node => {
                  const width = node.clientWidth;
                  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
                  if (width >= rem * 20 + 1) return true;
                  return [...node.querySelectorAll(':scope > button')].every(button => button.getBoundingClientRect().width >= width - 2);
                }), true, 'Narrow service groups must use readable full-width rows');
              }
            };
            await open('/products');
            await check('nav[aria-label="Product categories"]');
            const categoryLinks = await page.locator('nav[aria-label="Product categories"] a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
            for (const href of categoryLinks.slice(1)) {
              await page.locator('nav[aria-label="Product categories"]').locator(`a[href="${href}"]`).click();
              await page.waitForURL(base + href);
              await page.evaluate(font => document.documentElement.style.setProperty('font-size', `${font}%`, 'important'), font);
              await check('nav[aria-label="Product categories"]');
            }
            await open('/contact');
            await check('.enquiry-services');
            if (mode !== 'no-js') {
              const buttons = page.locator('.enquiry-services > button');
              for (let index = 0; index < await buttons.count(); index++) {
                await buttons.nth(index).click();
                await check('.enquiry-services');
              }
              await buttons.nth(0).evaluate(node => { node.textContent = 'Supply and installation of a customer-selected smart lock'; });
              await buttons.nth(0).click();
              await check('.enquiry-services');
              await page.setViewportSize({ width: width === 320 ? 390 : 1024, height: 1000 });
              await check('.enquiry-services');
            }
            if (engine === 'chromium' && mode === 'normal' && width === 320 && font === 200) {
              await page.addStyleTag({ content: '.site-header, .mobile-contact-dock { visibility: hidden !important; }' });
              await page.locator('.enquiry-services').screenshot({ path: 'output/selection-verification/enlarged-services.png' });
            }
            assert.deepEqual(errors, []);
            results.push({ engine, mode, width, font, passed: true });
            console.log(JSON.stringify(results.at(-1)));
            await context.close();
          }
        }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/selection-verification/report.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length }));
})().catch(error => { console.error(error); process.exitCode = 1; });
