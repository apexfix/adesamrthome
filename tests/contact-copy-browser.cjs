const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out='output/contact-copy';
  await fs.mkdir(out,{recursive:true});
  const results=[];
  for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
    const browser=await type.launch(engine==='chromium'?{channel:'chrome'}:{});
    try {
      for(const width of [320,390,768,1440]) for(const mode of ['normal','large','no-js']) {
        const page=await browser.newPage({viewport:{width,height:900},javaScriptEnabled:mode!=='no-js',reducedMotion:'reduce'});
        try {
          await page.goto('http://localhost:6650/contact',{waitUntil:'networkidle'});
          if(mode==='large') await page.evaluate(()=>document.documentElement.style.fontSize='200%');
          const buttons=page.locator('.contact-copy-button');
          assert.equal(await buttons.count(),4);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${engine}/${width}/${mode}: overflow`);
          for(let i=0;i<4;i++) {
            const button=buttons.nth(i), box=await button.boundingBox();
            assert.equal(box.width,48); assert.equal(box.height,48);
            assert.equal(await button.isDisabled(),mode==='no-js');
            if(mode!=='no-js') {
              await button.focus();
              const tip=button.locator('..').locator('.contact-copy-tooltip');
              assert.equal(await tip.isVisible(),true);
              const r=await tip.boundingBox();
              assert.ok(r.x>=0 && r.x+r.width<=width+1,`${engine}/${width}/${mode}: tooltip`);
            }
          }
          const footer=page.locator('.site-footer');
          assert.match(await footer.innerText(),/0431060390/);
          assert.match(await footer.innerText(),/info@adesmarthome.com.au/);
          if(width===390 && mode==='normal') {
            await footer.locator('[aria-labelledby=footer-contact]').scrollIntoViewIfNeeded();
            await page.screenshot({path:`${out}/${engine}-footer.png`});
          }
          results.push({engine,width,mode,passed:true});
        } finally {await page.close();}
      }
      const page=await browser.newPage({viewport:{width:390,height:900},reducedMotion:'reduce'});
      page.setDefaultTimeout(10000);
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      await page.addInitScript(()=>{
        window.__copyMode='ok'; window.__copyValues=[];
        const clipboard={writeText:async value=>{
          window.__copyValues.push(value);
          if(window.__copyMode==='denied') throw new DOMException('Local test denial','NotAllowedError');
          if(window.__copyMode==='pending') await new Promise(resolve=>{window.__resolveCopy=resolve;});
        }};
        Object.defineProperty(navigator,'clipboard',{configurable:true,get:()=>window.__copyMode==='missing'?undefined:clipboard});
      });
      try {
        await page.goto('http://localhost:6650/contact',{waitUntil:'networkidle'});
        const aside=page.locator('.quote-section .enquiry-contact-options');
        const phone=aside.getByRole('button',{name:'Copy phone number',exact:true});
        const email=aside.getByRole('button',{name:'Copy email address',exact:true});
        const phoneStatus=phone.locator('..').getByRole('status');
        const emailStatus=email.locator('..').getByRole('status');
        const waitStatus=async (node,text)=>page.waitForFunction(({element,text})=>element.textContent===text,{element:await node.elementHandle(),text});
        await phone.click();
        await waitStatus(phoneStatus,'Phone number copied.');
        assert.deepEqual(await page.evaluate(()=>window.__copyValues),['0431060390']);
        await page.evaluate(()=>window.__copyMode='denied');
        await email.click();
        await waitStatus(emailStatus,'Copy unavailable. Email address: info@adesmarthome.com.au');
        assert.equal(await emailStatus.innerText(),'Copy unavailable. Email address: info@adesmarthome.com.au');
        await page.evaluate(()=>window.__copyMode='ok');
        await email.click();
        await waitStatus(emailStatus,'Email address copied.');
        await page.evaluate(()=>window.__copyMode='pending');
        await phone.click();
        assert.equal(await phone.isDisabled(),true);
        assert.equal(await phone.getAttribute('aria-busy'),'true');
        assert.equal(await phoneStatus.innerText(),'Copying phone number.');
        const count=await page.evaluate(()=>window.__copyValues.length);
        await phone.evaluate(n=>n.click());
        assert.equal(await page.evaluate(()=>window.__copyValues.length),count);
        await page.evaluate(()=>window.__resolveCopy());
        await waitStatus(phoneStatus,'Phone number copied.');
        await page.evaluate(()=>window.__copyMode='missing');
        await email.click();
        await waitStatus(emailStatus,'Copy unavailable. Email address: info@adesmarthome.com.au');
        assert.equal(await emailStatus.innerText(),'Copy unavailable. Email address: info@adesmarthome.com.au');
        assert.equal(await page.evaluate(()=>window.__copyValues.length),count);
        assert.equal(await aside.locator('a[href^="mailto:"]').count(),1);
        await page.evaluate(()=>window.__copyMode='ok');
        for (const label of ['Phone number','Email address']) {
          const footerButton=page.locator('.site-footer').getByRole('button',{name:`Copy ${label.toLowerCase()}`,exact:true});
          await footerButton.click();
          await waitStatus(footerButton.locator('..').getByRole('status'),`${label} copied.`);
        }
        assert.deepEqual(await page.evaluate(()=>window.__copyValues.slice(-2)),['0431060390','info@adesmarthome.com.au']);
        await page.evaluate(()=>window.__copyMode='pending');
        await phone.click();
        await page.locator('.header-brand').click();
        await page.waitForURL('http://localhost:6650/');
        await page.evaluate(()=>window.__resolveCopy());
        assert.deepEqual(errors,[]);
        results.push({engine,clipboard:'mocked success, denied, retry, pending, absent API, navigation',passed:true});
      } finally {await page.close();}
    } finally {await browser.close();}
  }
  await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify({passed:true,cases:results.length,clipboard:'mocked only; user clipboard untouched'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
