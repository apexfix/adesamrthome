const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const http = require('node:http');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, ...args);
};
for (const ext of ['.ts', '.tsx']) Module._extensions[ext] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020,
  } }).outputText, filename);
};
const ErrorPage = require('@/app/error').default;
const GlobalError = require('@/app/global-error').default;
const out = 'output/recovery';

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  fs.mkdirSync(out, { recursive: true });
  const sourceHtml = await (await fetch('http://localhost:6650/this-page-does-not-exist')).text();
  const parserBrowser = await chromium.launch({ channel: 'chrome' });
  let shell;
  try {
    const parser = await parserBrowser.newPage();
    shell = await parser.evaluate(({ html, recovery }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      doc.querySelectorAll('script').forEach(node => node.remove());
      doc.querySelector('#site-content').innerHTML = recovery;
      for (const link of doc.querySelectorAll('link[href]')) {
        if (link.getAttribute('href').startsWith('/')) link.href = 'http://localhost:6650' + link.getAttribute('href');
      }
      return '<!doctype html>' + doc.documentElement.outerHTML;
    }, { html: sourceHtml, recovery: renderToStaticMarkup(React.createElement(ErrorPage)) });
  } finally { await parserBrowser.close(); }
  let requests = 0;
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://fixture.local');
    if (url.pathname === '/fixture.js') { res.setHeader('Content-Type', 'text/javascript'); res.end(fs.readFileSync(`${out}/client.bundle.js`)); return; }
    if (url.pathname.startsWith('/img/') || url.pathname.startsWith('/_next/')) {
      const image = await fetch(`http://localhost:6650${req.url}`);
      res.writeHead(image.status, { 'Content-Type': image.headers.get('content-type') || 'application/octet-stream' });
      res.end(Buffer.from(await image.arrayBuffer())); return;
    }
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('X-Fixture-Revision', String(++requests));
    if (url.pathname === '/products') { res.end('<h1>Fixture catalogue destination</h1>'); return; }
    const mode = url.searchParams.get('mode');
    if (mode === 'global') { res.end('<!doctype html>' + renderToStaticMarkup(React.createElement(GlobalError))); return; }
    if (mode === 'shell') { res.end(shell); return; }
    if (mode === 'client') { res.end('<!doctype html><html><head></head><body style="margin:0"><div id="fixture-root"></div><script src="/fixture.js"></script></body></html>'); return; }
    res.end('<h1>Fixture home destination</h1>');
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const results = [];
  try {
    for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
      const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
      try {
        for (const mode of ['global', 'shell', 'client']) for (const width of [320, 390, 768, 1440]) for (const option of (mode === 'client' ? ['normal'] : ['normal', 'large', 'nojs'])) {
          const page = await browser.newPage({ viewport: { width, height: 900 }, javaScriptEnabled: option !== 'nojs', reducedMotion: 'reduce' });
          page.setDefaultTimeout(10000);
          const errors = [];
          page.on('pageerror', error => errors.push(error.message));
          await page.route('**/*', route => [base, 'http://localhost:6650'].includes(new URL(route.request().url()).origin) ? route.continue() : route.abort());
          try {
            await page.goto(`${base}/?mode=${mode}&width=${width}`, { waitUntil: 'networkidle' });
            if (mode === 'client') await page.getByRole('button', { name: 'Trigger test error', exact: true }).click();
            const main = page.locator('[data-page-recovery]');
            await main.waitFor();
            if (option === 'large') await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
            assert.equal(await page.locator('h1').count(), 1);
            assert.ok(!(await page.locator('body').innerText()).includes('Synthetic recovery fixture failure'));
            assert.deepEqual(await main.locator('a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), ['', '/', '/products', 'sms:+61431060390', 'mailto:info@adesmarthome.com.au']);
            const geometry = await main.evaluate(node => ({ background: getComputedStyle(node).backgroundColor, overflow: document.documentElement.scrollWidth > innerWidth + 1, links: [...node.querySelectorAll('a')].map(n => { const r = n.getBoundingClientRect(); return { left: r.left, right: r.right, height: r.height }; }) }));
            assert.equal(geometry.background, 'rgb(17, 18, 20)');
            assert.equal(geometry.overflow, false, JSON.stringify({ engine, mode, width, option, geometry }));
            assert.ok(geometry.links.every(link => link.left >= 0 && link.right <= width + 1 && link.height >= 48));
            if (mode === 'shell') {
              assert.equal(await page.locator('.mobile-contact-dock').isVisible(), false);
              const clearance = await page.evaluate(() => ({ heading: document.querySelector('h1').getBoundingClientRect().top, header: document.querySelector('.site-header').getBoundingClientRect().bottom }));
              assert.ok(clearance.heading > clearance.header, JSON.stringify({ engine, mode, width, option, clearance }));
              assert.ok(await page.locator('.site-header img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0)));
            }
            if (width === 320 && option !== 'nojs') await page.screenshot({ path: `${out}/${engine}-${mode}-${option}-viewport.png` });
            if (option !== 'nojs') {
              await page.keyboard.press('Tab');
              await main.getByRole('link', { name: 'Reload page', exact: true }).focus();
              assert.equal(await main.getByRole('link', { name: 'Reload page', exact: true }).evaluate(node => getComputedStyle(node).outlineStyle), 'solid');
            }
            if (width === 320 && option !== 'nojs' && mode !== 'shell') await main.screenshot({ path: `${out}/${engine}-${mode}-${option}.png` });
            if (width === 320 && option !== 'large') {
              const nextResponse = page.waitForResponse(response => response.request().isNavigationRequest() && response.url() === page.url());
              await main.getByRole('link', { name: 'Reload page', exact: true }).click();
              assert.ok(Number((await nextResponse).headers()['x-fixture-revision']) > 0);
              await page.waitForLoadState('networkidle');
              if (mode === 'client') await page.getByRole('button', { name: 'Trigger test error', exact: true }).click();
              await main.getByRole('link', { name: 'Browse products', exact: true }).click();
              await page.getByRole('heading', { name: 'Fixture catalogue destination', exact: true }).waitFor();
              await page.goto(`${base}/?mode=${mode}`, { waitUntil: 'networkidle' });
              if (mode === 'client') await page.getByRole('button', { name: 'Trigger test error', exact: true }).click();
              await main.getByRole('link', { name: 'Back to home', exact: true }).click();
              await page.getByRole('heading', { name: 'Fixture home destination', exact: true }).waitFor();
            }
            assert.deepEqual(errors, []);
            results.push({ engine, mode, width, option, geometry, passed: true });
          } finally { await page.close(); }
        }
      } finally { await browser.close(); }
    }
    fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
    console.log(JSON.stringify({ passed: true, cases: results.length, scope: 'Actual recovery templates in isolated server/React fixtures, not injected production Next errors' }));
  } finally { await new Promise(resolve => server.close(resolve)); }
})().catch(error => { console.error(error); process.exitCode = 1; });
