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
  const analytics=load('src/lib/analytics.ts',{'./enquiry':enquiry});
  const sharp=requireModule('sharp');
  const photoLimits=load('src/lib/enquiryPhotoLimits.ts');
  const photos=load('src/lib/enquiryPhotos.ts',{sharp,'./enquiryPhotoLimits':photoLimits});
  function handler({fail=false}={}){
    const messages=[];
    const api=load('src/app/api/contact/route.ts',{
      '@/lib/enquiry':enquiry,
      '@/lib/enquiryPhotos':photos,
      '@/lib/enquiryPhotoLimits':photoLimits,
      'next/server':{NextResponse:{json:(value,init)=>Response.json(value,init)}},
      nodemailer:{createTransport:()=>({sendMail:async message=>{if(fail)throw new Error('Synthetic failure');messages.push(message);return{accepted:[message.to]};}})},
    },{process:{env:{SMTP_USER:'test@example.test',SMTP_APP_PASSWORD:'test-only',CONTACT_TO_EMAIL:'owner@example.test'}}});
    return {api,messages};
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
 test('camera minimal email enquiry is accepted and has equipment-only receipt',async()=>{const{api,messages}=handler();const r=await submit(api);assert.equal(r.status,200);assert((await r.json()).leadId);assert.equal(messages.length,2);assert.match(messages[1].subject,/camera equipment/);assert.doesNotMatch(messages[1].text,/door|24 hours|48 hours/i);assert.match(messages[0].text,/Preferred equipment package/);});
 test('mobile-only installation enquiry is accepted with no customer email',async()=>{const{api,messages}=handler();assert.equal((await submit(api,{service:'installation-only',product:'Customer-supplied lock',phone:'0431060390',email:''})).status,200);assert.equal(messages.length,1);});
 test('optional selections may be empty but not invalid',async()=>{const{api}=handler();assert.equal((await submit(api,{propertyType:'',preferredTiming:''})).status,200);assert.equal((await submit(api,{propertyType:'invented'})).status,400);});
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
