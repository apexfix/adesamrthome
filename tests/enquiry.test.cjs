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
  function handler({fail=false}={}){
    const messages=[];
    const api=load('src/app/api/contact/route.ts',{
      '@/lib/enquiry':enquiry,
      'next/server':{NextResponse:{json:(value,init)=>Response.json(value,init)}},
      nodemailer:{createTransport:()=>({sendMail:async message=>{if(fail)throw new Error('Synthetic failure');messages.push(message);return{accepted:[message.to]};}})},
    },{process:{env:{SMTP_USER:'test@example.test',SMTP_APP_PASSWORD:'test-only',CONTACT_TO_EMAIL:'owner@example.test'}}});
    return {api,messages};
  }
  return {enquiry,analytics,handler};
};

(async()=>{
 const {test}=await import('node:test');const {default:assert}=await import('node:assert/strict');
 const {enquiry,analytics,handler}=await setup();
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
 test('SMTP failure remains failure, not success',async()=>{const{api}=handler({fail:true});const r=await submit(api);assert.equal(r.status,500);assert.equal((await r.json()).success,false);});
 test('acknowledgement escapes customer input',async()=>{const{api,messages}=handler();await submit(api,{name:'<script>alert(1)</script>'});assert(!messages[1].html.includes('<script>'));assert(messages[1].html.includes('&lt;script&gt;'));});
 test('analytics permits known product identifiers, not free text or personal fields',()=>{
   assert.equal(enquiry.analyticsProductId('Lockin X9'),'lockin-x9-smart-lock');
   const p=analytics.sanitizeAnalyticsParameters({product:'private@example.test',content_name:'private@example.test',email:'private@example.test',phone:'0400000000',message:'secret',service:'security-camera-kit',photo_count:0,page_path:'/contact?email=private#secret',page_location:'https://www.adesmarthome.com.au/contact?email=private#secret'});
   assert.equal(p.product,'not-specified');assert.equal(p.content_name,'not-specified');assert.equal(p.email,undefined);assert.equal(p.phone,undefined);assert.equal(p.message,undefined);assert.equal(p.page_path,'/contact');assert.equal(p.page_location,'https://www.adesmarthome.com.au/contact');assert.equal(p.service,'security-camera-kit');
 });
})();
