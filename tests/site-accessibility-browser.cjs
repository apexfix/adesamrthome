const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = 'http://localhost:6650';
  const axePath = process.env.AXE_PATH || path.resolve('output/a11y-tools/package/axe.min.js');
  const xml = await (await fetch(`${base}/sitemap.xml`)).text();
  const routes = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname).concat('/contact/thank-you');
  const out = process.env.A11Y_OUT || 'output/site-accessibility';
  const results = [];
  await fs.mkdir(out, { recursive: true });
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      for (const width of [390, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        try {
          for (const route of routes) {
            errors.length = 0;
            await page.goto(base + route, { waitUntil: 'networkidle' });
            await page.addScriptTag({ path: axePath });
            const scan = await page.evaluate(async () => {
              const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] } });
              const keep = items => items.map(item => ({ id: item.id, impact: item.impact, help: item.help, nodes: item.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary, checks: [...node.any, ...node.all].map(check => ({ id: check.id, data: check.data })) })) }));
              return { violations: keep(result.violations), incomplete: keep(result.incomplete), passes: result.passes.length };
            });
            results.push({ engine, width, route, ...scan, errors: [...errors] });
            await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
            if (scan.violations.length) console.log(JSON.stringify({ engine, width, route, violations: scan.violations.map(item => [item.id, item.nodes.length]) }));
          }
        } finally { await context.close(); }
      }
    } finally { await browser.close(); }
  }
  const failed = results.filter(result => result.violations.length || result.errors.length);
  console.log(JSON.stringify({ cases: results.length, failed: failed.length, incompleteCases: results.filter(result => result.incomplete.length).length, scope: 'Automated axe-core 4.10.3 checks; incomplete items and visual/assistive-technology checks require separate review' }));
  assert.equal(failed.length, 0, 'Inspect the saved accessibility results');
})().catch(error => { console.error(error); process.exitCode = 1; });
