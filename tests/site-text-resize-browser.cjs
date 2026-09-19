const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const results = [], issues = [];
  await fs.mkdir('output/site-text-resize', { recursive: true });
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      const context = await browser.newContext({ reducedMotion: 'reduce' });
      await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      const page = await context.newPage();
      const sitemap = await context.request.get(`${base}/sitemap.xml`);
      const paths = await page.evaluate(xml => [...new DOMParser().parseFromString(xml, 'application/xml').getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(node => new URL(node.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent).pathname), await sitemap.text());
      paths.push('/contact/thank-you');
      let errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const width of [320, 1440]) for (const path of paths) {
        errors = [];
        await page.setViewportSize({ width, height: 1000 });
        const response = await page.goto(base + path, { waitUntil: 'networkidle' });
        for (const font of ['100%', '200%']) {
        await page.evaluate(async font => {
          await document.fonts.ready;
          document.documentElement.style.fontSize = font;
          await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        }, font);
        const geometry = await page.evaluate(() => {
          const root = document.documentElement;
          const h1 = [...document.querySelectorAll('h1')].filter(node => node.getBoundingClientRect().height > 0);
          const escaped = [...document.querySelectorAll('#site-content h1, #site-content h2, #site-content p, #site-content label, #site-content button')].filter(node => {
            const r = node.getBoundingClientRect();
            if (!r.width || !r.height || node.closest('[aria-hidden="true"], [hidden], dialog:not([open])')) return false;
            // A native scrolling rail intentionally contains off-screen items.
            for (let parent = node.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
              if (['auto', 'scroll', 'hidden', 'clip'].includes(getComputedStyle(parent).overflowX)) return false;
            }
            return r.left < -1 || r.right > innerWidth + 1;
          }).map(node => ({ tag: node.tagName, text: node.textContent.trim().slice(0, 90) }));
          return { overflow: root.scrollWidth > innerWidth + 1, scrollWidth: root.scrollWidth, h1: h1.length, escaped };
        });
        const result = { engine, width, font, path, status: response.status(), ...geometry, errors: [...errors] };
        results.push(result);
        if (result.status !== 200 || geometry.overflow || geometry.h1 !== 1 || geometry.escaped.length || errors.length) {
          issues.push(result);
          console.log(JSON.stringify(result));
          await fs.writeFile('output/site-text-resize/progress.json', JSON.stringify({ results, issues }, null, 2));
          await page.screenshot({ path: `output/site-text-resize/${engine}-${width}-${font}-${path.replace(/[^a-z0-9]+/gi, '-') || 'home'}.png` });
        } else if (['/', '/about', '/products/lockin-v5-max-smart-lock', '/gallery'].includes(path)) {
          await page.screenshot({ path: `output/site-text-resize/verified-${engine}-${width}-${font}-${path.replace(/[^a-z0-9]+/gi, '-') || 'home'}.png` });
        }
        }
      }
      await context.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/site-text-resize/results.json', JSON.stringify({ results, issues }, null, 2));
  console.log(JSON.stringify({ cases: results.length, issues }, null, 2));
  assert.equal(issues.length, 0);
})().catch(error => { console.error(error); process.exitCode = 1; });
