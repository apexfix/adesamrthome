// Invalid photos exercise the real local API; the successful retry is mocked and never sends mail.
(async()=>{
  const {default:assert}=await import('node:assert/strict');
  const fs=await import('node:fs/promises');
  const {chromium,webkit}=await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const results=[];const output='output/photo-verification';await fs.mkdir(output,{recursive:true});
  for(const[engine,type]of[['chromium',chromium],['webkit',webkit]]){
    const browser=await type.launch(engine==='chromium'?{channel:'chrome'}:{});
    try{
      const page=await browser.newPage({viewport:{width:390,height:900}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.goto('http://localhost:6650/contact?service=installation-only',{waitUntil:'networkidle'});
      await page.locator('[name=name]').fill('LOCAL PHOTO TEST');await page.locator('[name=suburb]').fill('Adelaide 5000');await page.locator('[name=email]').fill('test@example.invalid');
      await page.locator('input[type=file]').setInputFiles({name:'broken.png',mimeType:'image/png',buffer:Buffer.from('not a real image')});
      await page.getByRole('button',{name:'Remove broken.png'}).waitFor();
      const responsePromise=page.waitForResponse(r=>new URL(r.url()).pathname==='/api/contact');
      await page.locator('form button[type=submit]').click();const response=await responsePromise;
      assert.equal(response.status(),400);const body=await response.json();assert.equal(body.success,false);assert.match(body.message,/Photo 1 could not be read/);
      await page.locator('form [role=alert]').waitFor();assert.equal(await page.locator('[name=name]').inputValue(),'LOCAL PHOTO TEST');
      await page.locator('form [role=alert]').scrollIntoViewIfNeeded();await page.screenshot({path:`${output}/${engine}-invalid-390.png`});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
      await page.getByRole('button',{name:'Remove broken.png'}).click();
      assert.equal(await page.getByRole('button',{name:'Remove broken.png'}).count(),0);
      await page.evaluate(()=>{
        const original=window.fetch.bind(window);
        window.fetch=async(input,init)=>{
          if(new URL(input,location.href).pathname==='/api/contact'){
            if(init.body.getAll('photos').length)throw new Error('Old attachment retained');
            return new Response(JSON.stringify({success:true,leadId:'LOCAL-PHOTO-RETRY'}),{headers:{'Content-Type':'application/json'}});
          }
          return original(input,init);
        };
      });
      await page.locator('form button[type=submit]').click();await page.waitForURL('**/contact/thank-you?service=installation-only');await page.waitForLoadState('networkidle');
      await page.screenshot({path:`${output}/${engine}-retry-390.png`});assert.deepEqual(errors,[]);
      results.push({engine,status:response.status(),message:body.message,retainedInputs:true,removedAttachment:true,mockedRetry:true,pageErrors:errors});
    }finally{await browser.close();}
  }
  await fs.writeFile(`${output}/results.json`,JSON.stringify(results,null,2));console.log(JSON.stringify({passed:true,results}));
})().catch(error=>{console.error(error);process.exitCode=1;});
