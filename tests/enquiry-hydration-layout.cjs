const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const label = process.argv[2] || 'current';
assert.match(label, /^[a-z0-9-]+$/);

(async () => {
  const { chromium, webkit } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const out=`output/enquiry-hydration/${label}`;
  await fs.mkdir(out,{recursive:true});
  const results=[];
  for(const [engine,type] of [['chromium',chromium],['webkit',webkit]]) {
    const browser=await type.launch(engine==='chromium'?{channel:'chrome'}:{});
    try {
      for(const width of [320,390,768,1440]) for(const service of ['supply-install','security-camera-kit']) for(const hash of ['', '#quote']) {
        const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'});
        page.setDefaultTimeout(10000);
        let release;
        const gate=new Promise(resolve=>{release=resolve;});
        const errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        await page.addInitScript(()=>{
          window.__shifts=[];
          window.__shiftSupported=PerformanceObserver.supportedEntryTypes?.includes('layout-shift') || false;
          if(window.__shiftSupported) new PerformanceObserver(list=>{
            for(const entry of list.getEntries()) if(!entry.hadRecentInput) window.__shifts.push({value:entry.value,time:entry.startTime,sources:(entry.sources||[]).map(source=>source.node?.className||source.node?.tagName)});
          }).observe({type:'layout-shift',buffered:true});
        });
        await page.route('**/*',async route=>{
          const request=route.request(), u=new URL(request.url());
          if(u.origin!=='http://localhost:6650') await route.abort();
          else if(request.resourceType()==='script' && u.pathname.startsWith('/_next/')) {await gate;await route.continue();}
          else await route.continue();
        });
        const measure=()=>page.evaluate(()=>{
          const rect=selector=>{const r=document.querySelector(selector).getBoundingClientRect();return {top:r.top+scrollY,height:r.height};};
          return {panel:rect('.enquiry-panel'),services:rect('.enquiry-services'),field:rect('[name=name]'),button:rect('.enquiry-submit'),scrollY};
        });
        try {
          await page.goto(`http://localhost:6650/contact?service=${service}${hash}`,{waitUntil:'commit'});
          await page.waitForFunction(()=>document.querySelector('.site-footer') && getComputedStyle(document.querySelector('.enquiry-panel')).backgroundColor==='rgb(24, 24, 27)');
          await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
          const before=await measure();
          assert.equal(await page.locator('.enquiry-submit').isDisabled(),true);
          const start=await page.evaluate(()=>performance.now());
          release();
          await page.waitForLoadState('networkidle');
          await page.waitForFunction(()=>!document.querySelector('.enquiry-submit').matches(':disabled'));
          const after=await measure();
          const shifts=await page.evaluate(start=>window.__shiftSupported?window.__shifts.filter(s=>s.time>=start):null,start);
          const delta=Object.fromEntries(['panel','services','field','button'].map(key=>[key,Math.abs(before[key].top-after[key].top)]));
          results.push({engine,width,service,hash,before,after,delta,shifts,errors});
          if(label!=='baseline') {
            assert.ok(Object.values(delta).every(value=>value<=1),JSON.stringify(results.at(-1)));
            assert.ok(Math.abs(before.panel.height-after.panel.height)<=1,`${engine}/${width}/${service}: panel height changed`);
          }
          assert.deepEqual(errors,[]);
          assert.equal(await page.locator('.enquiry-direct').isVisible(),true);
          assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
          if(label!=='baseline' && service==='supply-install' && hash==='' && [320,1440].includes(width)) {
            await page.screenshot({path:`${out}/${engine}-${width}.png`,fullPage:true});
          }
        } finally {release();await page.close();}
      }
    } finally {await browser.close();}
  }
  await fs.writeFile(`${out}/results.json`,JSON.stringify(results,null,2));
  console.log(JSON.stringify({cases:results.length,maxDocumentShift:Math.max(...results.flatMap(r=>Object.values(r.delta))),maxPanelHeightDelta:Math.max(...results.map(r=>Math.abs(r.before.panel.height-r.after.panel.height))),output:out}));
})().catch(error=>{console.error(error);process.exitCode=1;});
