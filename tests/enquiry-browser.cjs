// Run against the isolated local preview. All enquiry POSTs and analytics are intercepted.
(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.ENQUIRY_PREVIEW_URL || 'http://localhost:6650';
  assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'Local preview only');
  const results = [];
  await fs.mkdir('output/enquiry-verification', { recursive: true });
  for (const [engine, browserType] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await browserType.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await context.addInitScript(() => {
        window.dataLayer = [];
        window.gtag = (...args) => window.dataLayer.push(args);
      });
      let responseMode = 'success';
      const posts = [];
      await context.exposeBinding('__mockEnquiry', async (_source, body) => {
          posts.push(body);
          return { status: responseMode === 'fail' ? 500 : 200,
            body: JSON.stringify(responseMode === 'fail'
              ? { message: 'Simulated delivery failure' }
              : responseMode === 'malformed' ? {} : { success: true, leadId: 'LOCAL-TEST' }) };
      });
      await context.addInitScript(() => {
        const originalFetch = window.fetch.bind(window);
        window.fetch = async (input, init) => {
          const url = new URL(input instanceof Request ? input.url : input, location.href);
          if (url.pathname === '/api/contact') {
            const result = await window.__mockEnquiry(await new Response(init.body).text());
            return new Response(result.body, { status: result.status, headers: { 'Content-Type': 'application/json' } });
          }
          if (url.origin !== location.origin) throw new Error('External fetch blocked in local test');
          return originalFetch(input, init);
        };
      });
      const page = await context.newPage();
      const pageErrors = [];
      page.on('pageerror', e => pageErrors.push(`${page.url()}: ${e.message}`));
      const open = async suffix => {
        await page.waitForLoadState('networkidle');
        await page.goto(base + suffix, { waitUntil: 'networkidle' });
        await page.waitForFunction(() => typeof window.gtag === 'function');
      };
      await open('/contact?product=Lockin%20X9');
      assert.deepEqual(await page.locator('form [required]').evaluateAll(nodes => nodes.map(n => n.name).sort()), ['name', 'suburb']);
      await page.locator('input[type=file]').setInputFiles({ name: 'door-test.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aP1cAAAAASUVORK5CYII=', 'base64') });
      await page.getByRole('button', { name: 'Remove door-test.png' }).waitFor();
      await page.getByRole('button', { name: 'Security camera kit', exact: true }).click();
      assert.equal(await page.locator('input[name=product]').inputValue(), '');
      assert.equal(await page.locator('input[type=file]').count(), 0);
      assert.equal(await page.locator('datalist option').count(), 2);
      await page.locator('[name=name]').fill('Local test only');
      await page.locator('[name=suburb]').fill('Adelaide 5000');
      const submit = page.locator('form button[type=submit]');
      await submit.click();
      await page.locator('form [role=alert]').waitFor();
      assert.equal(posts.length, 0);
      await page.locator('[name=email]').fill('local-test@example.invalid');
      await page.locator('[name=product]').fill('private-sentinel@example.invalid');
      responseMode = 'fail';
      await submit.click();
      await page.waitForFunction(() => document.querySelector('form [role=alert]')?.textContent.includes('Delivery is unconfirmed'));
      assert.equal(await page.locator('[name=email]').inputValue(), 'local-test@example.invalid');
      assert.equal(await submit.isEnabled(), true);
      assert.ok(!posts[0].includes('name="photos"'));
      responseMode = 'malformed';
      await submit.click();
      await page.waitForFunction(() => document.querySelector('form [role=alert]')?.textContent.includes('Delivery is unconfirmed'));
      assert.ok(!page.url().includes('thank-you'));
      responseMode = 'success';
      await submit.click();
      await page.waitForURL('**/contact/thank-you?service=security-camera-kit');
      await page.waitForFunction(() => window.dataLayer?.some(item => item[1] === 'generate_lead'));
      const events = await page.evaluate(() => window.dataLayer.map(item => Array.from(item)));
      assert.equal(events.filter(e => e[1] === 'generate_lead').length, 1);
      assert.ok(!JSON.stringify(events).includes('private-sentinel'));
      assert.ok(!/door photos|24 hours|48 hours/i.test(await page.locator('main').innerText()));
      await page.screenshot({ path: `output/enquiry-verification/${engine}-camera-receipt-390.png` });
      await page.reload();
      await page.waitForTimeout(500);
      assert.equal(await page.evaluate(() => (window.dataLayer || []).filter(e => e[1] === 'generate_lead').length), 0);
      await open('/contact?service=installation-only&product=private-query@example.invalid');
      const configs = await page.evaluate(() => window.dataLayer.filter(e => e[0] === 'config').map(e => e[2]));
      assert.ok(!JSON.stringify(configs).includes('private-query'));
      await page.locator('[name=name]').fill('Phone only test');
      await page.locator('[name=suburb]').fill('5000');
      await page.locator('[name=phone]').fill('0400000000');
      await submit.click();
      await page.waitForURL('**/contact/thank-you?service=installation-only');
      await page.waitForLoadState('networkidle');
      for (const width of [360, 390, 430, 768, 1440]) {
        for (const service of ['supply-install', 'security-camera-kit']) {
          const layoutPage = await context.newPage();
          layoutPage.on('pageerror', e => pageErrors.push(`${layoutPage.url()}: ${e.message}`));
          await layoutPage.setViewportSize({ width, height: 900 });
          await layoutPage.goto(`${base}/contact?service=${service}`, { waitUntil: 'networkidle' });
          const metrics = await layoutPage.evaluate(() => ({
            overflow: document.documentElement.scrollWidth > innerWidth,
            inputSize: getComputedStyle(document.querySelector('input[name=name]')).fontSize,
            buttons: [...document.querySelectorAll('form fieldset button')].map(b => ({ clipped: b.scrollWidth > b.clientWidth, height: b.getBoundingClientRect().height }))
          }));
          assert.equal(metrics.overflow, false, `${engine} ${width} ${service} overflow`);
          assert.equal(metrics.inputSize, '16px');
          assert.ok(metrics.buttons.every(b => !b.clipped && b.height >= 44));
          results.push({ engine, width, service, ...metrics });
          if ([390, 1440].includes(width)) {
            await layoutPage.screenshot({ path: `output/enquiry-verification/${engine}-${service}-${width}.png` });
          }
          await layoutPage.close();
        }
      }
      await open('/');
      assert.equal(await page.locator('a[href="#camera-kits"]').count(), 0);
      assert.ok(await page.locator('a[href="/products/security-camera-kits"]').count() > 0);
      assert.equal(pageErrors.length, 0, pageErrors.join('\n'));
      results.push({ engine, flows: 'switch, email-only, phone-only, validation, retry, malformed response, receipt, refresh, mocked analytics', googleConfigsPresent: configs.length, posts: posts.length, pageErrors });
      await context.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile('output/enquiry-verification/results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, checks: results.length, results: 'output/enquiry-verification/results.json' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
