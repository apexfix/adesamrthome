const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = `output/enquiry-forced-colors/${process.argv.includes('--before') ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const colorScheme of ['light', 'dark']) for (const width of [320, 390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, forcedColors: 'active', colorScheme, reducedMotion: 'reduce' });
        page.setDefaultTimeout(10000);
        await page.route('**/*', route => new URL(route.request().url()).origin === 'http://localhost:6650' && new URL(route.request().url()).pathname !== '/api/contact' ? route.continue() : route.abort());
        try {
          await page.goto('http://localhost:6650/contact', { waitUntil: 'networkidle' });
          const active = await page.evaluate(() => matchMedia('(forced-colors: active)').matches);
          if (!active) { results.push({ engine, colorScheme, width, unsupported: true }); continue; }
          const service = page.locator('.enquiry-service');
          const measure = () => service.evaluateAll(nodes => nodes.map(node => { const r = node.getBoundingClientRect(), parent = node.parentElement.getBoundingClientRect(), s = getComputedStyle(node); return { x: r.x - parent.x, y: r.y - parent.y, width: r.width, height: r.height, border: s.borderTopWidth, color: s.color, background: s.backgroundColor }; }));
          const baseline = await measure();
          const shifts = [];
          for (let index = 0; index < await service.count(); index++) {
            await service.nth(index).click();
            const next = await measure();
            shifts.push(Math.max(...next.flatMap((r, i) => ['x','y','width','height'].map(key => Math.abs(r[key] - baseline[i][key])))));
          }
          await page.locator('.enquiry-services').screenshot({ path: `${out}/${engine}-${colorScheme}-${width}.png` });
          assert.ok(Math.max(...shifts) <= 1, JSON.stringify({ engine, colorScheme, width, shifts, baseline, next: await measure() }));
          assert.ok(baseline.every(item => parseFloat(item.border) >= 1), 'Forced-color service controls need visible boundaries');
          assert.equal(await service.last().evaluate(node => getComputedStyle(node).borderTopStyle), 'double');
          await service.first().focus();
          await page.keyboard.press('Space');
          assert.equal(await service.first().getAttribute('aria-pressed'), 'true');
          assert.equal(await service.first().evaluate(node => getComputedStyle(node).outlineStyle), 'dashed');
          for (const selector of ['.enquiry-upload', '.enquiry-submit']) assert.ok(await page.locator(selector).evaluate(node => parseFloat(getComputedStyle(node).borderTopWidth) >= 1));
          await page.locator('[name=name]').focus();
          await page.keyboard.press('Tab');
          const focus = await page.locator('[name=phone]').evaluate(node => { const s = getComputedStyle(node); return { outline: s.outlineStyle, width: s.outlineWidth, color: s.outlineColor, background: s.backgroundColor }; });
          assert.equal(focus.outline, 'solid');
          assert.ok(parseFloat(focus.width) >= 2);
          assert.notEqual(focus.color, focus.background);
          const systemField = await page.evaluate(() => {
            const probe = document.createElement('span'); probe.style.backgroundColor = 'Field'; document.body.append(probe);
            const color = getComputedStyle(probe).backgroundColor; probe.remove(); return color;
          });
          const paletteApplied = focus.background === systemField;
          if (engine === 'chromium') assert.equal(paletteApplied, true);
          await page.evaluate(() => document.documentElement.style.fontSize = '200%');
          const enlarged = await measure();
          const enlargedShifts = [];
          for (let index = 0; index < await service.count(); index++) {
            await service.nth(index).click();
            const next = await measure();
            enlargedShifts.push(Math.max(...next.flatMap((r, i) => ['x','y','width','height'].map(key => Math.abs(r[key] - enlarged[i][key])))));
          }
          assert.ok(Math.max(...enlargedShifts) <= 1);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          results.push({ engine, colorScheme, width, shifts, enlargedShifts, focus, paletteApplied, scope: paletteApplied ? 'Forced palette and CSS emulation' : 'CSS media emulation only; native palette not applied', passed: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ cases: results.length, results }));
})().catch(error => { console.error(error); process.exitCode = 1; });
