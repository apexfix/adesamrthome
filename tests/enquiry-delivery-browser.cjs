const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const sharp = require('sharp');
(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const photo = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#445566' } }).png().toBuffer();
  const results=[];
  for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
    const browser=await type.launch(engine==='chromium'?{channel:'chrome'}:{});
    try {
      for(const width of [320,1440]) for(const font of ['100%','200%']) {
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        page.setDefaultTimeout(10000);
        const errors=[];page.on('pageerror',error=>errors.push(error.message));
        await page.route('**/*',route=>new URL(route.request().url()).origin==='http://localhost:6650'?route.continue():route.abort());
        await page.addInitScript(()=>{
          window.__deliveryCalls=[];window.__deliveryMode='pending';window.__aborts=0;window.__offline=false;
          Object.defineProperty(navigator,'onLine',{get:()=>!window.__offline});
          const timeout=window.setTimeout.bind(window),clear=window.clearTimeout.bind(window);
          window.setTimeout=(callback,delay,...args)=>{const id=timeout(callback,delay,...args);if(delay===30000){window.__expireEnquiry=()=>callback(...args);window.__enquiryTimer=id;window.__timerCleared=false;}return id;};
          window.clearTimeout=id=>{if(id===window.__enquiryTimer)window.__timerCleared=true;return clear(id);};
          const original=window.fetch.bind(window);
          window.fetch=async(input,init)=>{
            if(new URL(input instanceof Request?input.url:input,location.href).pathname!=='/api/contact')return original(input,init);
            window.__deliveryCalls.push({photos:init.body.getAll('photos').length,name:init.body.get('name')});
            if(window.__deliveryMode==='pending')return new Promise((resolve,reject)=>init.signal?.addEventListener('abort',()=>{window.__aborts++;reject(new DOMException('Aborted','AbortError'));},{once:true}));
            if(window.__deliveryMode==='network')throw new TypeError('Synthetic failed fetch');
            const fixtures={capacity:[413,'<html>Too large</html>'],limited:[429,'<html>Too many</html>'],invalid:[400,JSON.stringify({message:'Please check the suburb.'})],malformed:[200,'not JSON'],badId:[200,JSON.stringify({success:true,leadId:{email:'private@example.invalid'}})],server:[500,JSON.stringify({message:'Internal diagnostic must not appear'})]};
            const [status,body]=fixtures[window.__deliveryMode];return new Response(body,{status,headers:{'Content-Type':'application/json'}});
          };
        });
        try {
          await page.goto('http://localhost:6650/contact?service=installation-only',{waitUntil:'networkidle'});
          await page.locator('[name=name]').fill('LOCAL DELIVERY TEST');await page.locator('[name=suburb]').fill('Adelaide');await page.locator('[name=email]').fill('test@example.invalid');
          await page.locator('input[type=file]').setInputFiles({name:'door.png',mimeType:'image/png',buffer:photo});await page.getByRole('button',{name:'Remove door.png',exact:true}).waitFor();
          await page.evaluate(font=>document.documentElement.style.fontSize=font,font);
          const submit=page.locator('form button[type=submit]');
          const size=()=>submit.evaluate(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height}));
          const before=await size();
          await submit.click();
          assert.equal(await page.evaluate(()=>typeof window.__expireEnquiry),'function','Enquiry requests need a bounded timeout');
          assert.equal(await submit.isDisabled(),true);
          assert.deepEqual(await size(),before,'Sending must not resize the submit control');
          await page.locator('form').evaluate(form=>form.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
          assert.equal(await page.evaluate(()=>window.__deliveryCalls.length),1);
          await page.evaluate(()=>window.__expireEnquiry());
          await page.getByText('Delivery is unconfirmed.',{exact:false}).waitFor();
          assert.equal(await submit.innerText(),'Send another copy');
          assert.deepEqual(await size(),before,'Uncertain retry must not resize the submit control');
          assert.equal(await page.evaluate(()=>window.__aborts),1);
          assert.equal(await page.evaluate(()=>window.__timerCleared),true);
          for(const [mode,expected] of [['capacity',/too large/i],['limited',/wait/i],['invalid',/check the suburb/i],['malformed',/Delivery is unconfirmed/],['badId',/Delivery is unconfirmed/],['server',/Delivery is unconfirmed/],['network',/Delivery is unconfirmed/]]) {
            await page.evaluate(mode=>window.__deliveryMode=mode,mode);await submit.click();await page.locator('form [role=alert]').waitFor();
            assert.match(await page.locator('form [role=alert]').innerText(),expected);
            assert.equal(await page.locator('[name=name]').inputValue(),'LOCAL DELIVERY TEST');
            assert.equal(await page.getByRole('button',{name:'Remove door.png',exact:true}).count(),1);
            assert.ok(!page.url().includes('thank-you'));
            assert.equal(await page.evaluate(()=>sessionStorage.getItem('ade_completed_lead')),null);
          }
          assert.doesNotMatch(await page.locator('body').innerText(),/Internal diagnostic|private@example.invalid/);
          const calls=await page.evaluate(()=>window.__deliveryCalls.length);
          await page.evaluate(()=>window.__offline=true);await submit.click();await page.getByText(/You're offline/).waitFor();
          assert.equal(await page.evaluate(()=>window.__deliveryCalls.length),calls);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
          await page.evaluate(()=>{window.__offline=false;window.__deliveryMode='pending';});
          await submit.click();
          await page.locator('form a[href="/privacy-policy"]').click();
          await page.waitForURL('**/privacy-policy');
          assert.equal(await page.evaluate(()=>window.__aborts),2,'Unmount must abort the pending fetch');
          assert.equal(await page.evaluate(()=>window.__timerCleared),true,'Unmount must clear the deadline');
          assert.deepEqual(errors,[]);
          results.push({engine,width,font,timeout:true,noDuplicatePending:true,stableControl:true,errorModes:7,preservedDraft:true,offlineNoRequest:true,unmountCleanup:true});
        } finally {await page.close();}
      }
    } finally {await browser.close();}
  }
  await fs.mkdir('output/enquiry-delivery',{recursive:true});await fs.writeFile('output/enquiry-delivery/results.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify({passed:true,cases:results.length}));
})().catch(error=>{console.error(error);process.exitCode=1;});
