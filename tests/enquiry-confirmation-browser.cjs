const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const services = ['supply-install', 'installation-only', 'security-camera-kit', 'portfolio-project', 'not-sure'];
  const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
  const results = [];
  await fs.mkdir('output/enquiry-confirmation', { recursive: true });
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) for (const service of services) {
        if (process.env.CONFIRMATION_CASE && process.env.CONFIRMATION_CASE !== `${engine}-${width}-${service}`) continue;
        const page = await browser.newPage({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
        let stage = 'initial form';
        const errors = []; page.on('pageerror', error => { errors.push(`${stage} ${page.url()}: ${error.message}`); if (process.env.RECEIPT_DEBUG) console.error(error.stack); });
        let posts = 0;
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        page.on('console', message => { if (process.env.RECEIPT_DEBUG && message.type() === 'error') console.error(stage, message.text()); });
        await page.route('**/api/contact', route => { posts++; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true, leadId: 'LOCAL-REFERENCE-123' }) }); });
        await page.addInitScript(() => {
          window.__events = [];
          Object.defineProperty(window, 'gtag', { configurable: true, get: () => (...args) => window.__events.push(args), set: () => {} });
        });
        try {
          await page.goto(`${base}/contact?service=${service}`, { waitUntil: 'networkidle' });
          await page.locator('[name=name]').fill('LOCAL CONFIRMATION TEST');
          await page.locator('[name=suburb]').fill('Adelaide');
          await page.locator('[name=email]').fill('private@example.invalid');
          stage = 'submit and receipt navigation';
          await page.locator('form button[type=submit]').click();
          await page.waitForURL('**/contact/thank-you?**');
          const panel = page.locator('[data-enquiry-thank-you]:visible');
          await panel.locator('[data-enquiry-reference]').waitFor();
          await page.waitForLoadState('networkidle');
          assert.equal(posts, 1);
          assert.equal(await panel.locator('[data-enquiry-reference]').innerText(), 'LOCAL-REFERENCE-123');
          assert.equal(await panel.locator('[data-process-step]').count(), 3);
          assert.equal(await page.locator('.mobile-contact-dock').isVisible(), false);
          assert.equal(await page.locator('.mobile-contact-spacer').isVisible(), false);
          const stored = await page.evaluate(() => JSON.parse(sessionStorage.getItem('ade-enquiry-receipt-v1')));
          assert.deepEqual(stored, { leadId: 'LOCAL-REFERENCE-123', service });
          assert.equal(await page.evaluate(() => window.__events.filter(event => event[1] === 'generate_lead').length), 1);
          if (service === 'security-camera-kit') assert.doesNotMatch(await panel.innerText(), /door photos|installation scope/i);
          if (service === 'installation-only') assert.match(await panel.innerText(), /customer-supplied|installation-only price/i);
          if (service === 'portfolio-project') assert.match(await panel.innerText(), /whether we can help/);
          for (const font of ['100%', '200%']) {
            await page.evaluate(font => document.documentElement.style.fontSize = font, font);
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
            for (const link of await panel.locator('a').all()) assert.ok(await link.evaluate(node => node.getBoundingClientRect().height >= 48));
          }
          await page.evaluate(() => document.documentElement.style.fontSize = '100%');
          await page.screenshot({ path: `output/enquiry-confirmation/${engine}-${width}-${service}.png` });
          stage = 'receipt reload';
          const reloaded = await page.reload({ waitUntil: 'networkidle' });
          if (process.env.RECEIPT_DEBUG) await fs.writeFile('output/enquiry-confirmation/reload-response.html', await reloaded.text());
          await panel.locator('[data-enquiry-reference]').waitFor();
          assert.equal(await page.evaluate(() => window.__events.filter(event => event[1] === 'generate_lead').length), 0);
          for (let repeat = 1; repeat < Number(process.env.RECEIPT_RELOADS || 1); repeat++) {
            const response = await page.reload({ waitUntil: 'networkidle' });
            if (process.env.RECEIPT_DEBUG && errors.length) await fs.writeFile('output/enquiry-confirmation/reload-response.html', await response.text());
            await panel.locator('[data-enquiry-reference]').waitFor();
            assert.deepEqual(errors, []);
          }
          stage = 'changed query';
          await page.goto(`${base}/contact/thank-you?service=made-up&leadId=FORGED`, { waitUntil: 'networkidle' });
          assert.equal(await panel.locator('[data-enquiry-reference]').innerText(), 'LOCAL-REFERENCE-123', 'URL must not override accepted context');
          assert.deepEqual(errors, []);
          results.push({ engine, width, service, accepted: true, persistedReference: true, reloadNoConversion: true, textResize: true });
        } catch (error) {
          try {
            await fs.writeFile(`output/enquiry-confirmation/failure-${engine}-${width}-${service}.html`, await page.content());
          } catch { /* Preserve the original failure if navigation prevents capture. */ }
          throw error;
        } finally { await page.close(); }
      }
      for (const javaScriptEnabled of [true, false]) for (const fixture of ['absent', 'malformed', 'invalid', 'blocked']) {
        const page = await browser.newPage({ viewport: { width: 320, height: 900 }, javaScriptEnabled });
        const errors = []; page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
        await page.addInitScript(fixture => {
          if (fixture === 'malformed') sessionStorage.setItem('ade-enquiry-receipt-v1', '{bad');
          if (fixture === 'invalid') sessionStorage.setItem('ade-enquiry-receipt-v1', JSON.stringify({ leadId: 'invalid@example.com', service: 'installation-only' }));
          if (fixture === 'blocked') Object.defineProperty(window, 'sessionStorage', { get: () => { throw Error('Blocked storage'); } });
        }, fixture);
        try {
          const response = await page.goto(`${base}/contact/thank-you?service=security-camera-kit&leadId=FORGED`, { waitUntil: 'networkidle' });
          assert.equal(response.status(), 200);
          const panel = page.locator('[data-enquiry-thank-you]:visible');
          assert.equal(await panel.locator('[data-enquiry-reference]').count(), 0);
          assert.equal(await panel.locator('[data-process-step]').count(), 0);
          assert.equal(await page.locator('.mobile-contact-dock').isVisible(), false);
          assert.doesNotMatch(await panel.innerText(), /We Have Your Details|Enquiry received|FORGED/);
          assert.match(await page.locator('meta[name=robots]').getAttribute('content'), /noindex/);
          assert.equal(await panel.locator('a[href^="sms:"]').count(), 1);
          assert.equal(await panel.locator('a[href^="mailto:"]').count(), 1);
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          assert.deepEqual(errors, []);
          results.push({ engine, javaScriptEnabled, fixture, noFalseConfirmation: true, nativeContactLinks: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/enquiry-confirmation/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, requests: 'mocked locally' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
