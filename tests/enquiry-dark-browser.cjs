const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const services = ['supply-install', 'installation-only', 'security-camera-kit', 'portfolio-project', 'not-sure'];
const luminance = color => color.match(/[\d.]+/g).slice(0, 3).map(Number).map(n => {
  const v = n / 255;
  return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
}).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(luminance(a), luminance(b)) + .05) / (Math.min(luminance(a), luminance(b)) + .05);

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/enquiry-dark';
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const mode of ['normal', 'no-js', 'reduced', 'large-text']) {
        for (const width of mode === 'normal' ? [320, 390, 768, 1440] : [390]) {
          for (const service of services) {
            const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: mode !== 'no-js', colorScheme: 'light', reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
            page.setDefaultTimeout(10000);
            const errors = [];
            page.on('pageerror', e => errors.push(e.message));
            try {
              await page.goto(`${base}/contact?service=${service}`, { waitUntil: 'networkidle' });
              if (mode === 'large-text') await page.evaluate(() => document.documentElement.style.fontSize = '200%');
              const metrics = await page.locator('.enquiry-panel').evaluate(n => {
                const panel = getComputedStyle(n), input = n.querySelector('.enquiry-input'), style = getComputedStyle(input);
                const selected = n.querySelector('[aria-pressed="true"]'), selectedStyle = getComputedStyle(selected);
                const primary = getComputedStyle(n.querySelector('[type="submit"]'));
                return {
                  overflow: document.documentElement.scrollWidth > innerWidth + 1,
                  panelBg: panel.backgroundColor, bodyBg: getComputedStyle(document.body).backgroundColor,
                  fieldBg: style.backgroundColor, fieldText: style.color, border: style.borderTopColor,
                  placeholder: getComputedStyle(input, '::placeholder').color,
                  label: getComputedStyle(n.querySelector('label')).color,
                  muted: getComputedStyle(n.querySelector('.enquiry-muted')).color,
                  selectedBg: selectedStyle.backgroundColor, selectedText: selectedStyle.color,
                  primaryBg: primary.backgroundColor, primaryText: primary.color,
                  controls: [...n.querySelectorAll('.enquiry-service')].map(b => ({ clipped: b.scrollWidth > b.clientWidth + 1, height: b.getBoundingClientRect().height })),
                };
              });
              assert.equal(metrics.overflow, false, JSON.stringify({engine, width, mode, service}));
              assert.equal(metrics.panelBg, 'rgb(24, 24, 27)');
              assert.equal(metrics.bodyBg, 'rgb(0, 0, 0)');
              for (const [fg, bg] of [['fieldText', 'fieldBg'], ['placeholder', 'fieldBg'], ['label', 'panelBg'], ['muted', 'panelBg'], ['selectedText', 'selectedBg'], ['primaryText', 'primaryBg']]) {
                assert.ok(contrast(metrics[fg], metrics[bg]) >= 4.5, `${fg}: ${JSON.stringify(metrics)}`);
              }
              assert.ok(contrast(metrics.border, metrics.fieldBg) >= 3);
              assert.equal(metrics.controls.length, 5);
              assert.ok(metrics.controls.every(c => !c.clipped && c.height >= 48));
              assert.equal(await page.locator('.enquiry-service[aria-pressed=true]').count(), 1);
              if (mode !== 'no-js') {
                await page.locator('[name=name]').focus();
                await page.keyboard.press('Tab');
                assert.equal(await page.locator('[name=phone]').evaluate(n => getComputedStyle(n).outlineStyle), 'solid');
              }
              if (mode === 'normal' && [320, 1440].includes(width) && service === 'supply-install') {
                await page.locator('.enquiry-panel').screenshot({ path: `${out}/${engine}-${width}.png` });
              }
              assert.deepEqual(errors, []);
              results.push({ engine, width, mode, service, passed: true });
            } finally { await page.close(); }
          }
        }
      }
      const page = await browser.newPage({ viewport: { width: 390, height: 900 }, reducedMotion: 'reduce' });
      try {
        let release;
        const gate = new Promise(resolve => { release = resolve; });
        let posts = 0;
        await page.route('**/api/contact', async route => {
          posts++;
          await gate;
          await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Local test: message was not sent.' }) });
        });
        await page.goto(`${base}/contact?service=installation-only`, { waitUntil: 'networkidle' });
        const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1cAAAAASUVORK5CYII=', 'base64');
        await page.locator('input[type=file]').setInputFiles([1,2,3,4].map(n => ({ name: `local-${n}.png`, mimeType: 'image/png', buffer })));
        await page.locator('.enquiry-success').waitFor();
        assert.equal(await page.locator('.enquiry-upload').isDisabled(), true);
        assert.ok(await page.locator('.enquiry-remove').first().evaluate(n => n.getBoundingClientRect().height >= 48));
        const success = await page.locator('.enquiry-success').evaluate(n => ({ fg: getComputedStyle(n).color, bg: getComputedStyle(n).backgroundColor }));
        assert.ok(contrast(success.fg, success.bg) >= 4.5);
        await page.locator('.enquiry-remove').first().click();
        await page.locator('input[type=file]').setInputFiles({ name: 'unsupported.heic', mimeType: 'image/heic', buffer: Buffer.from('not an image') });
        await page.locator('.enquiry-error').waitFor();
        assert.equal(await page.locator('.enquiry-remove').count(), 3);
        const error = await page.locator('.enquiry-error').evaluate(n => ({ fg: getComputedStyle(n).color, bg: getComputedStyle(n).backgroundColor }));
        assert.ok(contrast(error.fg, error.bg) >= 4.5);
        await page.locator('[name=name]').fill('Local test');
        await page.locator('[name=suburb]').fill('Adelaide 5000');
        await page.locator('[name=email]').fill('test@example.invalid');
        await page.locator('.enquiry-submit').click();
        await page.getByRole('button', { name: 'Sending…', exact: true }).waitFor();
        assert.equal(await page.locator('.enquiry-submit').isDisabled(), true);
        assert.equal(await page.locator('.enquiry-service').first().isDisabled(), true);
        release();
        await page.getByText('Delivery is unconfirmed.', { exact: false }).waitFor();
        assert.equal(await page.locator('[name=email]').inputValue(), 'test@example.invalid');
        assert.equal(posts, 1);
        await page.locator('.enquiry-panel').screenshot({ path: `${out}/${engine}-error.png` });
        if (engine === 'chromium') {
          const cdp = await page.context().newCDPSession(page);
          await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
          const { root } = await cdp.send('DOM.getDocument');
          const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[name=email]' });
          await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: ['autofill'] });
          const autofill = await page.locator('[name=email]').evaluate(n => ({ matched: n.matches(':autofill'), fill: getComputedStyle(n).webkitTextFillColor, shadow: getComputedStyle(n).boxShadow }));
          assert.equal(autofill.matched, true);
          assert.equal(autofill.fill, 'rgb(255, 255, 255)');
          assert.match(autofill.shadow, /rgb\(32, 32, 36\)/);
          await cdp.detach();
        }
        results.push({ engine, uploadAndMockFailure: true });
      } finally { await page.close(); }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, output: out, enquiries: 'intercepted locally' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
