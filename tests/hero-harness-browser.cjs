(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const http = await import('node:http');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = 'output/hero-verification';
  const productionHtml = await (await fetch('http://localhost:6650/')).text();
  const cssPaths = [...productionHtml.matchAll(/href="([^"]+\.css[^\"]*)"/g)].map(m => m[1]);
  const script = await fs.readFile(`${out}/harness.bundle`);
  const server = http.createServer(async (req, res) => {
    try {
      if (req.url === '/harness.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(script); return; }
      if (req.url.startsWith('/?') || req.url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.end(`<!doctype html><html><head>${cssPaths.map(p => `<link rel="stylesheet" href="http://localhost:6650${p}">`).join('')}</head><body style="background:#09090b;color:white"><div id="root"></div><script src="/harness.js"></script></body></html>`); return;
      }
      const response = await fetch(`http://localhost:6650${req.url}`, { headers: { Accept: req.headers.accept ?? '*/*' } });
      res.writeHead(response.status, { 'Content-Type': response.headers.get('content-type') ?? 'text/plain' });
      res.end(Buffer.from(await response.arrayBuffer()));
    } catch { res.writeHead(500); res.end('Harness error'); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  try {
    for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
      const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
      try {
        for (const count of [0,1,2,3]) {
          console.log(JSON.stringify({ engine, count, stage: 'start' }));
          const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
          const errors = [];
          page.on('pageerror', e => errors.push(e.message));
          await page.clock.install();
          await page.goto(`${base}/?count=${count}`, { waitUntil: 'networkidle' });
          assert.equal(await page.getByRole('group', { name: 'Slideshow controls', exact: true }).count(), count > 1 ? 1 : 0);
          assert.equal(await page.locator('h1').innerText(), 'Fixed service title');
          await page.waitForFunction(() => document.querySelector('.hero-slide[data-active="true"] img')?.complete || document.querySelector('.hero-image-unavailable'));
          assert.equal(await page.locator('.hero-image-unavailable').count(), 0, await page.locator('.hero-media').innerHTML());
          assert.ok(await page.locator('.hero-slide[data-active="true"] img').evaluate(i => i.complete && i.naturalWidth > 0));
          if (count > 1) {
            await page.getByRole('button', { name: 'Next slide', exact: true }).click();
            await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '1');
            await page.getByRole('button', { name: 'Play slideshow', exact: true }).click();
            await page.clock.fastForward(7100);
            await page.waitForFunction(i => Number(document.querySelector('.hero-carousel').dataset.index) === i, 2 % count);
          } else {
            await page.clock.fastForward(15000);
            assert.equal(await page.locator('.hero-carousel').getAttribute('data-index'), '0');
          }
          for (const n of [0,3,1,3]) await page.getByLabel('Slide count').selectOption(String(n));
          await page.waitForFunction(() => document.querySelectorAll('.hero-slide img').length === 3 && [...document.querySelectorAll('.hero-slide img')].every(i => i.complete));
          await page.mouse.move(2,2);
          if (await page.locator('.hero-carousel').getAttribute('data-playing') !== 'true') await page.getByRole('button', { name: 'Play slideshow', exact: true }).click();
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.playing === 'true');
          await page.clock.runFor(1);
          await page.clock.fastForward(7100);
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '1');
          assert.deepEqual(errors, []);
          results.push({ engine, count, strictModeRemount: true, passed: true });
          await page.close();
        }
        for (const scenario of ['slow', 'broken', 'fallback-broken']) {
          const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
          let release;
          const held = new Promise(resolve => { release = resolve; });
          await page.route('**/_next/image?*', async route => {
            const src = new URL(route.request().url()).searchParams.get('url') ?? '';
            if (scenario === 'slow' && src.includes('auslock-smart-lock-side-view.jpg')) await held;
            if (scenario === 'fallback-broken' && src.includes('hero1-optimized.avif')) await route.fulfill({ status: 404, body: 'Missing image' });
            else await route.continue();
          });
          await page.goto(`${base}/?count=3${scenario === 'slow' ? '' : '&broken=1'}`, { waitUntil: 'domcontentloaded' });
          await page.getByRole('button', { name: 'Next slide', exact: true }).waitFor();
          await page.getByRole('button', { name: 'Next slide', exact: true }).click();
          if (scenario === 'slow') {
            assert.equal(await page.locator('.hero-carousel').getAttribute('data-index'), '0');
            assert.equal(await page.locator('.hero-carousel').getAttribute('data-pending'), '1');
            assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), '/service-1');
            release();
          }
          await page.waitForFunction(() => document.querySelector('.hero-carousel').dataset.index === '1');
          assert.equal(await page.locator('.hero-slide-link').getAttribute('href'), '/service-2');
          if (scenario === 'broken') assert.match(await page.locator('.hero-slide[data-active="true"] img').getAttribute('src'), /hero1-optimized/);
          if (scenario === 'fallback-broken') assert.equal(await page.locator('.hero-slide[data-active="true"] .hero-image-unavailable').innerText(), 'Service 2');
          results.push({ engine, scenario, passed: true });
          await page.close();
        }
      } finally { await browser.close(); }
    }
  } finally { await new Promise(resolve => server.close(resolve)); }
  await fs.writeFile(`${out}/harness-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, isolatedNextAdapters: true }));
})().catch(error => { console.error(error); process.exitCode = 1; });
