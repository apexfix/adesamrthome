const setup = async () => {
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const path = await import('node:path');
  const {createRequire} = await import('node:module');
  const requireModule=createRequire(__filename);
  const ts=requireModule('typescript');
  const root=path.resolve(__dirname,'..');
  const load=(file,dependencies={},globals={})=>{
    const loadedModule={exports:{}};
    const code=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
    vm.runInNewContext(code,{module:loadedModule,exports:loadedModule.exports,URL,Request,Response,File,FormData,Buffer,process:{env:{}},console:{warn(){},error(){}},require:name=>{
      if(name in dependencies)return dependencies[name];
      if(name==='node:crypto')return requireModule(name);
      throw new Error('Unexpected dependency: '+name);
    },...globals});
    return loadedModule.exports;
  };
  const enquiry=load('src/lib/enquiry.ts');
  const delivery=load('src/lib/enquiryDelivery.ts');
  const receipt=load('src/lib/enquiryReceipt.ts',{'./enquiry':enquiry,'./enquiryDelivery':delivery});
  const seoData=load('src/lib/seoData.ts');
  const analytics=load('src/lib/analytics.ts',{'./enquiry':enquiry});
  const sharp=requireModule('sharp');
  const photoLimits=load('src/lib/enquiryPhotoLimits.ts');
  const photoHeader=load('src/lib/enquiryPhotoHeader.ts');
  const enquiryRequest=load('src/lib/enquiryRequest.ts',{'./enquiryPhotoLimits':photoLimits});
  const photos=load('src/lib/enquiryPhotos.ts',{sharp,'./enquiryPhotoLimits':photoLimits,'./enquiryPhotoHeader':photoHeader});
  function handler({fail=false,failAcknowledgement=false,rejectOperator=false,rejectAcknowledgement=false}={}){
    const messages=[];
    const logs=[];
    const api=load('src/app/api/contact/route.ts',{
      '@/lib/enquiry':enquiry,
      '@/lib/enquiryReceipt':receipt,
      '@/lib/seoData':seoData,
      '@/lib/enquiryPhotos':photos,
      '@/lib/enquiryPhotoLimits':photoLimits,
      '@/lib/enquiryRequest':enquiryRequest,
      'next/server':{NextResponse:{json:(value,init)=>Response.json(value,init)}},
      nodemailer:{createTransport:()=>({sendMail:async message=>{if(fail || (failAcknowledgement && messages.length))throw new Error('PRIVATE: test@example.test SMTP-PASSWORD-TEST');const rejected=messages.length?rejectAcknowledgement:rejectOperator;messages.push(message);return{accepted:rejected?[]:[message.to],rejected:rejected?[message.to]:[]};}})},
    },{process:{env:{SMTP_USER:'test@example.test',SMTP_APP_PASSWORD:'test-only',CONTACT_TO_EMAIL:'owner@example.test'}},console:{warn:(...args)=>logs.push(args),error:(...args)=>logs.push(args)}});
    return {api,messages,logs};
  }
  return {enquiry,analytics,handler,photos,sharp,photoLimits};
};

(async()=>{
 const {test}=await import('node:test');const {default:assert}=await import('node:assert/strict');
 const {enquiry,analytics,handler,photos,sharp,photoLimits}=await setup();
 const sample={name:'Test only',suburb:'Adelaide 5000',email:'test@example.test',service:'security-camera-kit',product:'Dahua 6MP Smart Dual Light 2-Camera PoE Kit'};
 async function submit(api,fields={},files=[]){const body=new FormData();for(const[k,v]of Object.entries({...sample,...fields}))body.append(k,v);files.forEach(file=>body.append('photos',file));return api.POST(new Request('http://test.invalid/api/contact',{method:'POST',body}));}
 test('service definitions include all front-end choices',()=>{for(const item of enquiry.serviceOptions){assert(enquiry.isEnquiryService(item.value));assert(enquiry.serviceLabels[item.value]);}assert(!enquiry.isEnquiryService('bad'));});
 test('one contact method suffices; malformed nonempty fields rejected',()=>{
   for(const [phone,email]of [['','a@example.test'],['0431060390',''],['+61 431 060 390','a@example.test']])assert.equal(enquiry.contactValidationError(phone,email),null);
   for(const [phone,email]of [['',''],['abc12345678',''],['0431060390','bad@'],['','a@@b.test']])assert(enquiry.contactValidationError(phone,email));
 });
 test('contact validation identifies the actual invalid fields without including private values',()=>{
   for(const [phone,email,fields]of [['','',['phone','email']],['bad12345678','valid@example.test',['phone']],['0431060390','bad@',['email']],['bad','bad@',['phone','email']]]){
     const issue=enquiry.contactValidationIssue(phone,email);
     assert.deepEqual(Array.from(issue.fields),fields);assert.equal(issue.message,enquiry.contactValidationError(phone,email));
     assert(!issue.message.includes('bad@'));assert(!issue.message.includes('0431060390'));
   }
   assert.equal(enquiry.contactValidationIssue('0431060390',''),null);
 });
 test('camera minimal email enquiry is accepted and has equipment-only receipt',async()=>{const{api,messages}=handler();const r=await submit(api);assert.equal(r.status,200);assert((await r.json()).leadId);assert.equal(messages.length,2);assert.match(messages[1].subject,/camera equipment/);assert.doesNotMatch(messages[1].text,/door|24 hours|48 hours/i);assert.match(messages[0].text,/Preferred equipment package/);});
 test('each service receives its own acknowledgement rather than a generic lock receipt',async()=>{
   const expected={
     'supply-install':/preferred lock, door details/,
     'installation-only':/model you have purchased/,
     'security-camera-kit':/package name, quantity/,
     'portfolio-project':/properties, quantities/,
     'not-sure':/clarify suitable product or service options/,
   };
   for(const[service,copy]of Object.entries(expected)){
     const{api,messages}=handler();const response=await submit(api,{service});const receipt=await response.json();
     assert.equal(response.status,200);assert.equal(receipt.acknowledgementSent,true);assert.equal(messages.length,2);
     assert.match(messages[1].text,copy,service);assert.match(messages[1].html,copy,service);
     assert.ok(messages[1].subject.includes(receipt.leadId));assert.ok(messages[1].text.includes(receipt.leadId));
     assert.match(messages[1].text,/0431060390/);assert.match(messages[1].text,/https:\/\/www\.adesmarthome\.com\.au\//);
     assert.doesNotMatch(messages[1].text,/24 hours|48 hours|guaranteed|licensed/i);
     if(service==='security-camera-kit')assert.doesNotMatch(messages[1].text,/door|installation|coverage|position/i);
   }
 });
 test('mobile-only installation enquiry is accepted with no customer email',async()=>{const{api,messages}=handler();assert.equal((await submit(api,{service:'installation-only',product:'Customer-supplied lock',phone:'0431060390',email:''})).status,200);assert.equal(messages.length,1);});
 test('optional selections may be empty but not invalid',async()=>{const{api}=handler();assert.equal((await submit(api,{propertyType:'',preferredTiming:''})).status,200);assert.equal((await submit(api,{propertyType:'invented'})).status,400);});
 test('all five services accept every displayed optional property and timing combination',async()=>{
   let checked=0;
   for(const service of enquiry.serviceOptions)for(const property of enquiry.propertyOptions)for(const timing of enquiry.timingOptions){
     const{api,messages}=handler();
     const response=await submit(api,{service:service.value,propertyType:property.value,preferredTiming:timing.value});
     assert.equal(response.status,200,`${service.value}/${property.value}/${timing.value}`);
     assert.ok(messages[0].text.includes(`Property type: ${property.value?property.label:'Not specified'}`));
     assert.ok(messages[0].text.includes(`Preferred timing: ${timing.value?timing.label:'Not specified'}`));
     checked++;
   }
   assert.equal(checked,150);
 });
 test('unknown optional values never send mail',async()=>{
   for(const field of ['propertyType','preferredTiming'])for(const value of ['invented','constructor','__proto__']){
     const{api,messages}=handler();assert.equal((await submit(api,{[field]:value})).status,400);assert.equal(messages.length,0);
   }
 });
 test('all services support phone-only contact without attempting an acknowledgement',async()=>{
   for(const service of enquiry.serviceOptions){
     const{api,messages}=handler();const response=await submit(api,{service:service.value,email:'',phone:'0431060390'});
     assert.equal(response.status,200);assert.equal((await response.json()).acknowledgementSent,false);assert.equal(messages.length,1);
   }
 });
 test('missing contact, missing name and invalid service are rejected',async()=>{const{api,messages}=handler();for(const fields of [{email:''},{name:''},{service:'invalid'}])assert.equal((await submit(api,fields)).status,400);assert.equal(messages.length,0);});
 test('camera requests cannot silently include stale door photos',async()=>{const{api,messages}=handler();assert.equal((await submit(api,{},[new File(['test'],'test.jpg',{type:'image/jpeg'})])).status,400);assert.equal(messages.length,0);});
 test('photo limits still apply to locks',async()=>{const{api,messages}=handler();const f=new File(['test'],'test.jpg',{type:'image/jpeg'});assert.equal((await submit(api,{service:'supply-install'},[f,f,f,f,f])).status,400);assert.equal((await submit(api,{service:'supply-install'},[new File([new Uint8Array(1000001)],'large.jpg',{type:'image/jpeg'})])).status,400);assert.equal(messages.length,0);});
 test('shared photo metadata boundaries include exact limits, count, empty and unknown types',()=>{
   const check=sizes=>photoLimits.photoSelectionError(sizes.map(size=>({size,type:'image/jpeg'})));
   for(const sizes of [[],[1],[1000000],[1000000,1000000,750000,750000]])assert.equal(check(sizes),null);
   for(const sizes of [[0],[1000001],[NaN],[Infinity],[-1],[1.5],[1,1,1,1,1],[1000000,1000000,750000,750001],[900000,900000,900000,900000]])assert.ok(check(sizes));
   assert.ok(photoLimits.photoSelectionError([{size:1,type:'image/heic'}]));
 });
 test('actual API accepts exact total and single limits but rejects one extra byte before email',async()=>{
   const jpeg=await sharp({create:{width:20,height:20,channels:3,background:'#334455'}}).jpeg().toBuffer();
   const padded=size=>new File([jpeg,Buffer.alloc(size-jpeg.length)],'door.jpg',{type:'image/jpeg'});
   for(const [sizes,status]of [[[1000000],200],[[1000001],400],[[1000000,1000000,750000,750000],200],[[1000000,1000000,750000,750001],400],[[900000,900000,900000,900000],400]]){
     const{api,messages}=handler();const response=await submit(api,{service:'installation-only'},sizes.map(padded));
     assert.equal(response.status,status);assert.equal(messages.length,status===200?2:0);
     if(sizes.reduce((a,b)=>a+b,0)>3500000)assert.match((await response.json()).message,/3.5 MB/);
   }
 });
 test('SMTP failure remains failure, not success',async()=>{const{api}=handler({fail:true});const r=await submit(api);assert.equal(r.status,500);assert.equal((await r.json()).success,false);});
 test('an SMTP response without an accepted operator recipient cannot report success or send a receipt',async()=>{
   const{api,messages,logs}=handler({rejectOperator:true});const response=await submit(api);const body=await response.json();
   assert.equal(response.status,500);assert.equal(body.success,false);assert.equal(body.leadId,undefined);
   assert.equal(messages.length,1);assert.equal(logs.length,1);assert.doesNotMatch(JSON.stringify(logs),/test@example|owner@example/);
 });
 test('a rejected customer receipt does not discard the accepted operator enquiry',async()=>{
   for(const service of enquiry.serviceOptions){
     const{api,messages,logs}=handler({rejectAcknowledgement:true});const response=await submit(api,{service:service.value});const body=await response.json();
     assert.equal(response.status,200);assert.equal(body.success,true);assert.equal(body.acknowledgementSent,false);
     assert.ok(body.leadId);assert.equal(messages.length,2);assert.equal(logs.length,1);
   }
 });
 test('SMTP errors never place raw provider errors or contact details in logs',async()=>{
   for(const options of [{fail:true},{failAcknowledgement:true}]){
     const{api,messages,logs}=handler(options);const response=await submit(api);const body=await response.json();
     assert.equal(response.status,options.fail?500:200);assert.equal(messages.length,options.fail?0:1);
     assert.equal(body.success,!options.fail);if(!options.fail)assert.equal(body.acknowledgementSent,false);
     assert.equal(logs.length,1);assert.doesNotMatch(JSON.stringify(logs),/PRIVATE|test@example|SMTP-PASSWORD/);
   }
 });
 test('request byte limit is enforced without Content-Length and before mail',async()=>{
   const{api,messages}=handler();
   const body=JSON.stringify({...sample,message:'x'.repeat(4000000)});
   const response=await api.POST(new Request('http://test.invalid/api/contact',{method:'POST',headers:{'content-type':'application/json'},body}));
   assert.equal(response.status,413);assert.equal((await response.json()).success,false);assert.equal(messages.length,0);
 });
 test('malformed JSON or multipart yields a readable 400 without logging payloads',async()=>{
   for(const [type,body] of [['application/json','{PRIVATE'],['multipart/form-data; boundary=test','PRIVATE']]){
     const{api,messages,logs}=handler();const response=await api.POST(new Request('http://test.invalid/api/contact',{method:'POST',headers:{'content-type':type},body}));
     assert.equal(response.status,400);assert.equal(messages.length,0);assert.deepEqual(logs,[]);
   }
 });
 test('JPEG, PNG and WebP decode and become bounded JPEG attachments',async()=>{
   for(const format of ['jpeg','png','webp']){
     const input=await sharp({create:{width:40,height:60,channels:3,background:'#2468ac'}}).toFormat(format).toBuffer();
     const {api,messages}=handler();
     const response=await submit(api,{service:'installation-only'},[new File([input],'original.'+format,{type:'image/'+format})]);
     assert.equal(response.status,200);assert.equal(messages.length,2);
     const attachment=messages[0].attachments[0];
     assert.equal(attachment.filename,'door-photo-1.jpg');assert.equal(attachment.contentType,'image/jpeg');
     const metadata=await sharp(attachment.content).metadata();assert.equal(metadata.format,'jpeg');assert.equal(metadata.width,40);assert.equal(metadata.height,60);
   }
 });
 test('invalid bytes, mismatched MIME, truncated images and empty files do not send mail',async()=>{
   const png=await sharp({create:{width:64,height:64,channels:3,background:'#abcdef'}}).png().toBuffer();
   const files=[new File(['not an image'],'fake.jpg',{type:'image/jpeg'}),new File([png],'wrong.jpg',{type:'image/jpeg'}),new File([png.subarray(0,png.length-30)],'broken.png',{type:'image/png'}),new File([],'empty.png',{type:'image/png'}),new File(['<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'],'fake.png',{type:'image/png'})];
   for(const file of files){const{api,messages}=handler();const r=await submit(api,{service:'supply-install'},[file]);assert.equal(r.status,400);assert.equal((await r.json()).success,false);assert.equal(messages.length,0);}
 });
 test('oversized decoded pixel dimensions are rejected even when compressed bytes are small',async()=>{
   const bytes=await sharp({create:{width:5001,height:5000,channels:3,background:'#ffffff'}}).png().toBuffer();
   assert(bytes.length<1000000);const{api,messages}=handler();assert.equal((await submit(api,{service:'supply-install'},[new File([bytes],'large.png',{type:'image/png'})])).status,400);assert.equal(messages.length,0);
 });
 test('all eight EXIF orientations preserve corner placement and strip identifying metadata',async()=>{
   const width=120,height=80;
   const colors=[[240,20,20],[20,220,20],[20,20,240],[230,220,20]];
   const raw=Buffer.alloc(width*height*3);
   for(let y=0;y<height;y++)for(let x=0;x<width;x++){
     const color=colors[(y>=height/2?2:0)+(x>=width/2?1:0)];
     for(let c=0;c<3;c++)raw[(y*width+x)*3+c]=color[c];
   }
   const corners=[[0,1,2,3],[1,0,3,2],[3,2,1,0],[2,3,0,1],[0,2,1,3],[2,0,3,1],[3,1,2,0],[1,3,0,2]];
   for(let orientation=1;orientation<=8;orientation++){
     const source=await sharp(raw,{raw:{width,height,channels:3}}).withMetadata({orientation}).withExifMerge({IFD0:{Artist:'PRIVATE-PHOTO-OWNER',ImageDescription:'PRIVATE-PHOTO-LOCATION'}}).jpeg({quality:95}).toBuffer();
     assert.equal((await sharp(source).metadata()).orientation,orientation);
     assert.ok((await sharp(source).metadata()).exif);
     for(const marker of ['PRIVATE-PHOTO-OWNER','PRIVATE-PHOTO-LOCATION'])assert.equal(source.includes(Buffer.from(marker)),true);
     const {api,messages}=handler();
     assert.equal((await submit(api,{service:'installation-only'},[new File([source],'private-location.jpg',{type:'image/jpeg'})])).status,200);
     const attachment=messages[0].attachments[0];
     assert.equal(attachment.filename,'door-photo-1.jpg');
     const metadata=await sharp(attachment.content).metadata();
     assert.equal(metadata.width,orientation>=5?height:width);
     assert.equal(metadata.height,orientation>=5?width:height);
     for(const key of ['exif','icc','iptc','xmp','orientation'])assert.equal(metadata[key],undefined,`orientation ${orientation}: ${key}`);
     for(const marker of ['PRIVATE-PHOTO-OWNER','PRIVATE-PHOTO-LOCATION'])assert.equal(attachment.content.includes(Buffer.from(marker)),false);
     const {data,info}=await sharp(attachment.content).raw().toBuffer({resolveWithObject:true});
     for(const [i,[fx,fy]]of [[.25,.25],[.75,.25],[.25,.75],[.75,.75]].entries()){
       const offset=(Math.floor(info.height*fy)*info.width+Math.floor(info.width*fx))*info.channels;
       colors[corners[orientation-1][i]].forEach((expected,c)=>assert.ok(Math.abs(data[offset+c]-expected)<35,`orientation ${orientation}, corner ${i}, channel ${c}`));
     }
   }
 });
 test('normalization strips metadata and trailing bytes, applies orientation, and does not crop',async()=>{
   const bytes=await sharp({create:{width:30,height:60,channels:3,background:'#2468ac'}}).withMetadata({orientation:6}).jpeg().toBuffer();
   const result=await photos.prepareEnquiryPhoto(new File([Buffer.concat([bytes,Buffer.from('PRIVATE-TRAILING-MARKER')])],'private-name.jpg',{type:'image/jpeg'}),0);
   const metadata=await sharp(result.content).metadata();assert.equal(metadata.width,60);assert.equal(metadata.height,30);assert.equal(metadata.exif,undefined);assert.equal(metadata.orientation,undefined);assert(!result.content.includes(Buffer.from('PRIVATE-TRAILING-MARKER')));
 });
 test('animated WebP is rejected instead of silently keeping one frame',async()=>{
   const data=Buffer.alloc(10*20*3);for(let i=0;i<200;i++)data[i*3+(i<100?0:2)]=255;
   const bytes=await sharp(data,{raw:{width:10,height:20,channels:3,pageHeight:10}}).webp({loop:0,delay:[100,100]}).toBuffer();
   assert.equal((await sharp(bytes).metadata()).pages,2);
   await assert.rejects(photos.prepareEnquiryPhoto(new File([bytes],'animated.webp',{type:'image/webp'}),0),/non-animated/);
 });
 test('animated PNG and WebP cannot bypass preflight by submitting directly',async()=>{
   const {apng,webp}=await require('./fixtures/photo-animation.cjs').animationFixtures();
   for(const [bytes,type]of [[apng,'image/png'],[webp,'image/webp']]){
     const {api,messages}=handler();
     const response=await submit(api,{service:'installation-only'},[new File([bytes],'animation',{type})]);
     assert.equal(response.status,400);assert.equal(messages.length,0);
     assert.match((await response.json()).message,/non-animated/);
   }
 });
 test('large dimensions are resized proportionally and transparent backgrounds become white',async()=>{
   const bytes=await sharp({create:{width:3200,height:2000,channels:4,background:{r:0,g:0,b:0,alpha:0}}}).png().toBuffer();
   const result=await photos.prepareEnquiryPhoto(new File([bytes],'transparent.png',{type:'image/png'}),0);
   const meta=await sharp(result.content).metadata();assert.equal(meta.width,1600);assert.equal(meta.height,1000);assert.equal(meta.hasAlpha,false);
   const pixel=await sharp(result.content).extract({left:0,top:0,width:1,height:1}).raw().toBuffer();assert(pixel.every(value=>value>250));
 });
 test('valid photos before a bad photo do not cause partial email delivery',async()=>{
   const bytes=await sharp({create:{width:20,height:20,channels:3,background:'#2468ac'}}).png().toBuffer();
   const{api,messages}=handler();const r=await submit(api,{service:'supply-install'},[new File([bytes],'valid.png',{type:'image/png'}),new File(['bad'],'bad.png',{type:'image/png'})]);assert.equal(r.status,400);assert.match((await r.json()).message,/Photo 2/);assert.equal(messages.length,0);
 });
 test('acknowledgement escapes customer input',async()=>{const{api,messages}=handler();await submit(api,{name:'<script>alert(1)</script>'});assert(!messages[1].html.includes('<script>'));assert(messages[1].html.includes('&lt;script&gt;'));});
 test('analytics permits known product identifiers, not free text or personal fields',()=>{
   assert.equal(enquiry.analyticsProductId('Lockin X9'),'lockin-x9-smart-lock');
   const p=analytics.sanitizeAnalyticsParameters({product:'private@example.test',content_name:'private@example.test',email:'private@example.test',phone:'0400000000',message:'secret',service:'security-camera-kit',photo_count:0,page_path:'/contact?email=private#secret',page_location:'https://www.adesmarthome.com.au/contact?email=private#secret'});
   assert.equal(p.product,'not-specified');assert.equal(p.content_name,'not-specified');assert.equal(p.email,undefined);assert.equal(p.phone,undefined);assert.equal(p.message,undefined);assert.equal(p.page_path,'/contact');assert.equal(p.page_location,'https://www.adesmarthome.com.au/contact');assert.equal(p.service,'security-camera-kit');
 });
})();
