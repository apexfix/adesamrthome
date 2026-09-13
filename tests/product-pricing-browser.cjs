(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const output = 'output/product-pricing-verification';
  const { fixtures } = JSON.parse(await fs.readFile(`${output}/report.json`, 'utf8'));
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      const page = await browser.newPage();
      for (const name of fixtures) {
        await page.goto(`${base}/products/lockin-ola-slim-smart-lock`, { waitUntil: 'networkidle' });
        const html = await fs.readFile(`${output}/${name}.html`, 'utf8');
        // Real server-rendered fixture markup with the built site's CSS, not a screenshot mockup.
        await page.evaluate(html => { document.querySelector('main').outerHTML = html; }, html);
        for (const width of [360, 390, 768, 1440]) {
          await page.setViewportSize({ width, height: 1000 });
          const overflow = await page.locator('.product-pricing').evaluate(root => {
            const violations = [];
            const bounds = root.getBoundingClientRect();
            const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
            for (let node = walker.nextNode(); node; node = walker.nextNode()) {
              if (!node.textContent.trim()) continue;
              const range = document.createRange(); range.selectNodeContents(node);
              for (const rect of range.getClientRects()) {
                if (rect.left < bounds.left - 1 || rect.right > bounds.right + 1) violations.push(node.textContent);
              }
            }
            return violations;
          });
          assert.deepEqual(overflow, [], `${engine} ${name} ${width}: price text outside panel`);
          assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${engine} ${name} ${width}: page overflow`);
          results.push({ engine, name, width });
          if (width === 390 && ['fraction', 'service-unknown', 'installed-only-price'].includes(name)) {
            await page.locator('.product-purchase').screenshot({ path: `${output}/${engine}-${name}.png` });
          }
        }
        const card = await fs.readFile(`${output}/${name}-card.html`, 'utf8');
        await page.evaluate(card => {
          const main = document.querySelector('main'); main.innerHTML = card;
          main.style.cssText = 'width:300px;margin:20px auto';
        }, card);
        assert.equal(await page.locator('main').evaluate(n => n.scrollWidth > n.clientWidth), false, `${engine} ${name}: card overflow`);
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${output}/browser-report.json`, JSON.stringify({ results }, null, 2));
  console.log(`PASS ${results.length} price layouts and ${fixtures.length * 2} 300px cards.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
