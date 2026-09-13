// Local preview only. No real submission or analytics delivery.
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out = `output/contact-errors/${process.argv.includes('--before') ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const results = [];
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? { channel: 'chrome' } : {});
    try {
      for (const width of [320, 1440]) {
        const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        page.setDefaultTimeout(10000);
        let posts = 0;
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.route('**/*', async route => {
          const url = new URL(route.request().url());
          if (url.pathname === '/api/contact') { posts++; await route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ message: 'Local server error' }) }); }
          else if (url.origin === 'http://localhost:6650') await route.continue(); else await route.abort();
        });
        try {
          await page.goto('http://localhost:6650/contact', { waitUntil: 'networkidle' });
          await page.locator('[name=name]').fill('LOCAL CONTACT TEST');
          await page.locator('[name=suburb]').fill('Adelaide 5000');
          const submit = page.locator('form button[type=submit]');
          const phone = page.locator('[name=phone]'), email = page.locator('[name=email]');
          await submit.click();
          assert.equal(await phone.getAttribute('aria-invalid'), 'true', 'Missing contact must be associated with the mobile field');
          assert.equal(await email.getAttribute('aria-invalid'), 'true');
          assert.equal(await page.evaluate(() => document.activeElement.name), 'phone');
          const description = await phone.getAttribute('aria-describedby');
          assert.ok(description);
          assert.match(await phone.evaluate(node => node.getAttribute('aria-describedby').split(/\s+/).map(id => document.getElementById(id)?.textContent).join(' ')), /mobile number or email address/);
          await email.fill('person@example.invalid');
          assert.notEqual(await phone.getAttribute('aria-invalid'), 'true');
          assert.notEqual(await email.getAttribute('aria-invalid'), 'true');
          assert.equal(await page.locator('form [role=alert]').count(), 0);
          await phone.fill('wrong12345678');
          await submit.click();
          assert.equal(await page.evaluate(() => document.activeElement.name), 'phone');
          assert.equal(await phone.getAttribute('aria-invalid'), 'true');
          assert.notEqual(await email.getAttribute('aria-invalid'), 'true');
          await phone.fill('');
          // Native email validity allows this, while the shared enquiry rule requires a dotted domain.
          await email.fill('person@example');
          await submit.click();
          assert.equal(await page.evaluate(() => document.activeElement.name), 'email', 'Email errors must not focus the phone field');
          assert.equal(await email.getAttribute('aria-invalid'), 'true');
          assert.notEqual(await phone.getAttribute('aria-invalid'), 'true');
          assert.equal(posts, 0);
          await page.evaluate(() => document.documentElement.style.fontSize = '200%');
          await page.locator('form [role=alert]').scrollIntoViewIfNeeded();
          assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
          await page.screenshot({ path: `${out}/${engine}-${width}-email-large.png` });
          await page.evaluate(() => document.documentElement.style.fontSize = '100%');
          // Native invalid capture still keeps a visible, associated email explanation.
          await email.fill('invalid@');
          await phone.fill('invalid12345678');
          await submit.click();
          assert.equal(await email.getAttribute('aria-invalid'), 'true');
          assert.equal(await phone.getAttribute('aria-invalid'), 'true');
          assert.equal(posts, 0);
          await phone.fill('');
          await email.fill('person@example.invalid');
          await submit.click();
          await page.getByText('Local server error', { exact: false }).waitFor();
          assert.equal(posts, 1);
          assert.notEqual(await email.getAttribute('aria-invalid'), 'true');
          assert.notEqual(await phone.getAttribute('aria-invalid'), 'true');
          assert.deepEqual(errors, []);
          results.push({ engine, width, missingPairAssociated: true, appropriateFocus: true, correctionsClear: true, nativeEmailExplained: true, deliveryErrorSeparate: true });
        } finally { await page.close(); }
      }
    } finally { await browser.close(); }
  }
  await fs.writeFile(`${out}/results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify({ passed: true, cases: results.length, results }));
})().catch(error => { console.error(error); process.exitCode = 1; });
