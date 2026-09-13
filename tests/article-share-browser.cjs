(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const slug = 'smart-lock-door-compatibility-check';
  const canonical = `https://www.adesmarthome.com.au/blog/${slug}`;
  const output = 'output/article-share-verification';
  await fs.mkdir(output, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chrome', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chrome' ? { channel: 'chrome' } : {});
    try {
      const context = await browser.newContext();
      // Mock only the external system interfaces; never open OS sharing or overwrite a user's clipboard.
      await context.addInitScript(() => {
        window.shareCalls = []; window.copyCalls = [];
        window.shareMode = 'success'; window.copyMode = 'success';
        window.mockShare = data => {
          window.shareCalls.push(data);
          if (window.shareMode === 'abort') return Promise.reject(new DOMException('Cancelled', 'AbortError'));
          if (window.shareMode === 'fail') return Promise.reject(new DOMException('Not allowed', 'NotAllowedError'));
          if (window.shareMode === 'pending') return new Promise((resolve, reject) => { window.finishShare = resolve; window.failShare = reject; });
          return Promise.resolve();
        };
        Object.defineProperty(navigator, 'share', { configurable: true, value: window.mockShare });
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: text => {
          window.copyCalls.push(text);
          if (window.copyMode === 'fail') return Promise.reject(new DOMException('Denied', 'NotAllowedError'));
          if (window.copyMode === 'pending') return new Promise(resolve => { window.finishCopy = resolve; });
          return Promise.resolve();
        } } });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`${base}/blog/${slug}?email=private-test&photo=private-upload#private-fragment`, { waitUntil: 'networkidle' });
      const panel = page.locator('[data-article-share]');
      const share = panel.getByRole('button', { name: 'Share article', exact: true });
      const copy = panel.getByRole('button', { name: 'Copy article link', exact: true });
      const status = panel.getByRole('status');
      await share.waitFor();
      assert.equal(await panel.getByRole('link').getAttribute('href'), canonical);
      await share.click();
      await page.waitForFunction(() => window.shareCalls.length === 1);
      assert.deepEqual(await page.evaluate(() => window.shareCalls[0]), { title: await page.locator('h1').innerText(), url: canonical });
      assert.equal(await status.innerText(), '', 'Native resolution is not a posting confirmation');
      assert.equal(await page.evaluate(() => window.copyCalls.length), 0);
      await page.evaluate(() => { window.shareMode = 'abort'; });
      await share.click();
      await page.waitForFunction(() => window.shareCalls.length === 2);
      assert.equal(await status.innerText(), '');
      assert.equal(await page.evaluate(() => window.copyCalls.length), 0, 'Cancellation never writes clipboard');
      await page.evaluate(() => { window.shareMode = 'fail'; });
      await share.click();
      await status.filter({ hasText: 'Link copied.' }).waitFor();
      assert.deepEqual(await page.evaluate(() => window.copyCalls), [canonical]);
      await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: undefined }); window.copyMode = 'pending'; });
      await share.click();
      assert.equal(await status.innerText(), '');
      assert.equal(await share.isDisabled(), true);
      assert.equal(await copy.isDisabled(), true);
      await panel.evaluate(node => { node.querySelector('button').click(); node.querySelectorAll('button')[1].click(); });
      assert.equal(await page.evaluate(() => window.copyCalls.length), 2, 'No concurrent duplicate writes');
      await page.evaluate(() => window.finishCopy());
      await status.filter({ hasText: 'Link copied.' }).waitFor();
      await page.evaluate(() => { window.copyMode = 'fail'; });
      await copy.click();
      await status.filter({ hasText: 'Copy unavailable.' }).waitFor();
      assert.doesNotMatch(await status.innerText(), /copied/i);
      await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: undefined }); });
      await copy.click();
      await status.filter({ hasText: 'Copy unavailable.' }).waitFor();
      for (const width of [320, 390, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
        for (const button of await panel.getByRole('button').all()) {
          const box = await button.boundingBox(); assert.ok(box.width >= 44 && box.height >= 44);
        }
        await panel.screenshot({ path: `${output}/${engine}-error-${width}.png` });
      }
      await page.evaluate(() => { Object.defineProperty(navigator, 'share', { configurable: true, value: window.mockShare }); window.shareMode = 'pending'; });
      await share.click();
      const related = page.locator('.article-card').first();
      const relatedHref = await related.getAttribute('href');
      await related.click();
      await page.waitForURL(`${base}${relatedHref}`);
      await page.getByRole('button', { name: 'Share article', exact: true }).waitFor();
      const previousCopies = await page.evaluate(() => window.copyCalls.length);
      await page.evaluate(() => window.failShare(new DOMException('Denied', 'NotAllowedError')));
      assert.equal(await page.evaluate(() => window.copyCalls.length), previousCopies);
      assert.equal(await page.locator('[data-article-share] [role=status]').innerText(), '');
      await page.goBack({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('[data-article-share] a').getAttribute('href'), canonical);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: text => { window.copyCalls.push(text); return Promise.resolve(); } } });
      });
      await copy.focus();
      await copy.press('Enter');
      await status.filter({ hasText: 'Link copied.' }).waitFor();
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('aria-label')), 'Copy article link');
      assert.equal(await page.evaluate(() => window.copyCalls.at(-1)), canonical);
      assert.deepEqual(errors, []);
      results.push({ engine, share: 'native/fallback/cancel/denied/pending/navigation', layoutWidths: [320, 390, 768, 1440] });
      await context.close();

      const staticContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } });
      const staticPage = await staticContext.newPage();
      await staticPage.goto(`${base}/blog/${slug}`);
      assert.equal(await staticPage.locator('[data-article-share] button').count(), 0);
      assert.equal(await staticPage.locator('[data-article-share] a').getAttribute('href'), canonical);
      assert.equal(await staticPage.locator('.article-content').isVisible(), true);
      await staticContext.close();
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${output}/report.json`, JSON.stringify({ results, externalInterfacesMocked: true }, null, 2));
  console.log('PASS cross-engine article sharing, privacy, cancellation, failure, pending, navigation and no-JS fallback.');
})().catch(error => { console.error(error); process.exitCode = 1; });
