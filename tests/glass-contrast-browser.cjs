const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const over = (a, b) => a.slice(0, 3).map((value, index) => value * a[3] + b[index] * (1 - a[3]));
const lum = rgb => rgb.map(n => n / 255).map(n => n <= .04045 ? n / 12.92 : ((n + .055) / 1.055) ** 2.4).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0);
const contrast = (a, b) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results = [];
  const out = 'output/glass-contrast';
  await fs.mkdir(out, { recursive: true });
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 1000 } });
        try {
          await page.goto('http://localhost:6650/', { waitUntil: 'networkidle' });
          await page.waitForFunction(() => document.documentElement.dataset.visualEffects === 'standard');
          for (const state of ['rest', 'scrolled', 'reduced']) {
            if (state === 'scrolled') { await page.evaluate(() => scrollTo(0, 900)); await page.waitForFunction(() => document.querySelector('.site-header').dataset.scrolled === 'true'); }
            if (state === 'reduced') await page.emulateMedia({ reducedMotion: 'reduce' });
            const styles = await page.evaluate(() => {
              const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
              const context = canvas.getContext('2d');
              const rgba = value => { context.clearRect(0, 0, 1, 1); context.fillStyle = value; context.fillRect(0, 0, 1, 1); const values = [...context.getImageData(0, 0, 1, 1).data]; values[3] /= 255; return values; };
              const surface = getComputedStyle(document.querySelector('.header-surface'), '::before');
              const colors = surface.backgroundImage.match(/rgba?\([^)]+\)/g) || [];
              return {
                background: rgba(surface.backgroundColor), highlights: colors.map(rgba), image: surface.backgroundImage,
                text: [...document.querySelectorAll('.header-brand-copy span')].map(node => ({ text: node.textContent, color: rgba(getComputedStyle(node).color) })),
              };
            });
            assert.ok(styles.text.length >= 2);
            assert.ok(styles.image === 'none' || styles.highlights.length, 'Do not silently skip an unrecognized gradient');
            const backgrounds = [[255,255,255], [0,0,0]].flatMap(underlay => {
              const base = over(styles.background, underlay);
              return [base, ...styles.highlights.map(color => over(color, base))];
            });
            const ratios = styles.text.map(item => ({ text: item.text, ratio: Math.min(...backgrounds.map(bg => contrast(over(item.color, bg), bg))) }));
            for (const item of ratios) assert.ok(item.ratio >= 4.5, JSON.stringify({ engine, width, state, ...item }));
            results.push({ engine, width, state, ratios });
          }
          await page.emulateMedia({ reducedMotion: 'no-preference' });
          const fallback = await page.evaluate(() => {
            const found = [];
            const visit = rules => { for (const rule of rules) {
              if (rule instanceof CSSSupportsRule && rule.conditionText.startsWith('not') && rule.conditionText.includes('backdrop-filter')) found.push(...[...rule.cssRules].map(child => child.cssText));
              else if (rule.cssRules) visit(rule.cssRules);
            } };
            for (const sheet of document.styleSheets) visit(sheet.cssRules);
            return found.join('\n');
          });
          assert.ok(fallback.includes('#202224') || fallback.includes('32, 34, 36'));
          await page.addStyleTag({ content: `${fallback}\n.liquid-glass,.header-surface::before { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }` });
          assert.equal(await page.locator('.header-surface').evaluate(node => getComputedStyle(node, '::before').backgroundColor), 'rgb(32, 34, 36)');
          await page.locator('.site-header').screenshot({ path: `${out}/${engine}-${width}-no-filter.png` });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, scope: 'Conservative compositing of header brand text over black/white bounds and authored no-filter CSS fallback; not a complete visual accessibility certification' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
