const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
const sharp=require('sharp');
const {animationFixtures}=require('./fixtures/photo-animation.cjs');
(async()=>{
  const {chromium,webkit}=await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base=process.env.ENQUIRY_PREVIEW_URL||'http://localhost:6650';
  assert.ok(['localhost','127.0.0.1'].includes(new URL(base).hostname));
  const {still,apng,webp}=await animationFixtures();
  const colors=[[240,20,20],[20,220,20],[20,20,240],[230,220,20]];
  const corners=[[0,1,2,3],[1,0,3,2],[3,2,1,0],[2,3,0,1],[0,2,1,3],[2,0,3,1],[3,1,2,0],[1,3,0,2]];
  const fixtures=[];
  for(const [width,height]of [[120,80],[2400,1600]]){
    const raw=Buffer.alloc(width*height*3);
    for(let y=0;y<height;y++)for(let x=0;x<width;x++){
      const color=colors[(y>=height/2?2:0)+(x>=width/2?1:0)];
      for(let c=0;c<3;c++)raw[(y*width+x)*3+c]=color[c];
    }
    for(let orientation=1;orientation<=8;orientation++)fixtures.push({width,height,orientation,buffer:await sharp(raw,{raw:{width,height,channels:3}}).withMetadata({orientation}).jpeg({quality:95}).toBuffer()});
  }
  const results=[];
  await fs.mkdir('output/photo-safety',{recursive:true});
  for(const [engine,type]of [['chromium',chromium],['webkit',webkit]]){
    const browser=await type.launch(engine==='chromium'?{channel:'chrome'}:{});
    try{
      const page=await browser.newPage({viewport:{width:390,height:1000},reducedMotion:'reduce'});
      const errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.route('**/*',r=>new URL(r.request().url()).origin===base&&new URL(r.request().url()).pathname!=='/api/contact'?r.continue():r.abort());
      await page.addInitScript(()=>{
        window.__created=0;window.__urls=new Set();
        const create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);
        URL.createObjectURL=file=>{window.__created++;const url=create(file);window.__urls.add(url);return url};
        URL.revokeObjectURL=url=>{window.__urls.delete(url);revoke(url)};
      });
      await page.goto(base+'/contact',{waitUntil:'networkidle'});
      const input=page.locator('input[type=file]');
      for(const [name,mimeType,buffer]of [['animation.png','image/png',apng],['animation.webp','image/webp',webp]]){
        const before=await page.evaluate(()=>window.__created);
        await input.setInputFiles({name,mimeType,buffer});
        await page.getByText(/Animated photos are not supported/).waitFor();
        assert.equal(await page.evaluate(()=>window.__created),before,'Animation must not reach a decoder or preview URL');
        assert.equal(await page.locator('.enquiry-photo-preview').count(),0);
        results.push({engine,name,rejectedBeforeDecode:true});
      }
      await input.setInputFiles([{name:'valid.png',mimeType:'image/png',buffer:still},{name:'animation.png',mimeType:'image/png',buffer:apng}]);
      await page.getByText(/Animated photos are not supported/).waitFor();
      await page.locator('.enquiry-photo-preview[data-state=ready]').waitFor();
      assert.equal(await page.locator('.enquiry-photo-preview').count(),1,'Keep the valid member of a mixed batch');
      await page.getByRole('button',{name:'Remove valid.png',exact:true}).click();
      for(const fixture of fixtures){
        const name=`orientation-${fixture.orientation}-${fixture.width}.jpg`;
        await input.setInputFiles({name,mimeType:'image/jpeg',buffer:fixture.buffer});
        await page.locator('.enquiry-photo-preview[data-state=ready]').waitFor();
        const observed=await page.locator('.enquiry-photo-preview img').evaluate(async img=>{
          const canvas=document.createElement('canvas');canvas.width=img.naturalWidth;canvas.height=img.naturalHeight;
          const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);
          const samples=[[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y])=>[...ctx.getImageData(Math.floor(canvas.width*x),Math.floor(canvas.height*y),1,1).data]);
          const blob=await (await fetch(img.src)).blob();
          const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob)});
          return {width:img.naturalWidth,height:img.naturalHeight,samples,data};
        });
        const scale=Math.min(1,1600/Math.max(fixture.width,fixture.height));
        const expected=[Math.round(fixture.width*scale),Math.round(fixture.height*scale)];
        if(fixture.orientation>=5)expected.reverse();
        assert.deepEqual([observed.width,observed.height],expected);
        for(let i=0;i<4;i++)for(let c=0;c<3;c++)assert.ok(Math.abs(observed.samples[i][c]-colors[corners[fixture.orientation-1][i]][c])<45,`${engine} ${name} corner ${i}`);
        const prepared=Buffer.from(observed.data.split(',')[1],'base64');
        const metadata=await sharp(prepared).metadata();
        if(fixture.width>1600){assert.equal(metadata.orientation,undefined);assert.equal(metadata.exif,undefined);}
        else assert.equal(metadata.orientation,fixture.orientation,'Small originals retain orientation for server normalization');
        // Exercise the same final orientation operation used after upload and verify no double rotation.
        const output=await sharp(prepared).rotate().raw().toBuffer({resolveWithObject:true});
        assert.deepEqual([output.info.width,output.info.height],expected);
        for(const [i,[x,y]]of [[.25,.25],[.75,.25],[.25,.75],[.75,.75]].entries())for(let c=0;c<3;c++){
          const offset=(Math.floor(output.info.height*y)*output.info.width+Math.floor(output.info.width*x))*output.info.channels+c;
          assert.ok(Math.abs(output.data[offset]-colors[corners[fixture.orientation-1][i]][c])<45);
        }
        await page.getByRole('button',{name:`Remove ${name}`,exact:true}).click();
        await page.waitForFunction(()=>window.__urls.size===0);
        results.push({engine,orientation:fixture.orientation,resized:fixture.width>1600,cornersCorrect:true,urlsReleased:true});
      }
      assert.deepEqual(errors,[]);
      await page.close();
    }finally{await browser.close()}
  }
  await fs.writeFile('output/photo-safety/results.json',JSON.stringify(results,null,2));
  console.log(JSON.stringify({passed:true,cases:results.length,mixedBatchFlows:2,actualRequests:'No submissions or external requests'}));
})().catch(e=>{console.error(e);process.exitCode=1});
