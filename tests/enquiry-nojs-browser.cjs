const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const base = 'http://localhost:6650';
const services = ['supply-install', 'installation-only', 'security-camera-kit', 'portfolio-project', 'not-sure'];

async function checkFallback(page) {
  const panel = page.locator('.enquiry-panel');
  await panel.waitFor();
  assert.equal(await panel.locator('.enquiry-direct').isVisible(), true);
  assert.deepEqual(await panel.locator('.enquiry-direct a').evaluateAll(nodes => nodes.map(n => n.getAttribute('href'))), ['sms:+61431060390', 'mailto:info@adesmarthome.com.au']);
  assert.equal(await panel.locator('form').getAttribute('method'), 'post');
  assert.equal(await panel.locator('form').getAttribute('action'), '/api/contact');
  assert.ok(await panel.locator('form').evaluate(n => [...n.querySelectorAll('input,select,textarea,button')].every(control => control.matches(':disabled'))));
  await panel.locator('.enquiry-direct a').last().focus();
  await page.keyboard.press('Tab');
  assert.equal(await page.evaluate(() => document.activeElement.matches('form input, form select, form textarea, form button')), false);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
}

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  await fs.mkdir('output/enquiry-nojs', {recursive:true});
  let layouts = 0;
  for (const [engine, type] of [['chromium', chromium], ['webkit', webkit]]) {
    const browser = await type.launch(engine === 'chromium' ? {channel:'chrome'} : {});
    try {
      for (const width of [320,390,768,1440]) for (const service of services) {
        const page = await browser.newPage({viewport:{width,height:900},javaScriptEnabled:false});
        const unsafe = [];
        await page.route('**/*', async route => {
          const u = new URL(route.request().url());
          if (['name','phone','email','message'].some(key => u.searchParams.has(key))) {
            unsafe.push(u.pathname); await route.abort();
          } else if (u.pathname === '/api/contact') {
            unsafe.push('unexpected-submit'); await route.abort();
          } else await route.continue();
        });
        try {
          await page.goto(`${base}/contact?service=${service}`);
          await checkFallback(page);
          assert.deepEqual(unsafe, []);
          layouts++;
        } finally {await page.close();}
      }
      for (const mode of ['blocked', 'delayed']) {
        const page = await browser.newPage({viewport:{width:390,height:900}});
        page.setDefaultTimeout(10000);
        let release;
        const gate = new Promise(resolve => {release=resolve;});
        let posts = 0;
        await page.route('**/*', async route => {
          const request=route.request(), u=new URL(request.url());
          if (u.pathname === '/api/contact') {
            posts++;
            assert.equal(request.method(), 'POST');
            await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,leadId:`LOCAL-NOJS-${engine}`})});
          } else if (request.resourceType() === 'script' && u.pathname.startsWith('/_next/')) {
            if(mode === 'blocked') await route.abort();
            else { await gate; await route.continue(); }
          } else await route.continue();
        });
        try {
          await page.goto(`${base}/contact?service=security-camera-kit`,{waitUntil:'commit'});
          await checkFallback(page);
          assert.equal(posts,0);
          if (mode === 'blocked') {
            await page.waitForLoadState('load');
            await page.screenshot({path:`output/enquiry-nojs/${engine}-${mode}.png`});
          }
          if (mode === 'delayed') {
            release();
            await page.waitForLoadState('networkidle');
            assert.equal(await page.locator('.enquiry-direct').isVisible(), true);
            await page.waitForFunction(() => !document.querySelector('.enquiry-submit').matches(':disabled'));
            await page.screenshot({path:`output/enquiry-nojs/${engine}-loaded.png`});
            await page.locator('[name=name]').fill('Local test only');
            await page.locator('[name=suburb]').fill('5000');
            await page.locator('[name=email]').fill('test@example.invalid');
            await page.locator('.enquiry-submit').click();
            await page.waitForURL('**/contact/thank-you?service=security-camera-kit');
            assert.equal(posts,1);
            assert.ok(!page.url().includes('example.invalid'));
          }
          layouts++;
        } finally {release(); await page.close();}
      }
    } finally {await browser.close();}
  }
  console.log(JSON.stringify({passed:true,layouts,delivery:'all POSTs intercepted, no real messages'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
