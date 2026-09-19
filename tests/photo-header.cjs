const assert=require('node:assert/strict');
const ts=require('typescript');
const fs=require('node:fs');
const vm=require('node:vm');
const sharp=require('sharp');
const {pngChunk,chunks,animationFixtures}=require('./fixtures/photo-animation.cjs');
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/enquiryPhotoHeader.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:mod,exports:mod.exports,DataView});
const {checkStaticPhotoHeader:check,MAX_PHOTO_HEADER_BYTES:cap}=mod.exports;
(async()=>{
  let checks=0;
  const {still,apng,webp}=await animationFixtures();
  for(const [bytes,type]of [[apng,'image/png'],[webp,'image/webp']]){
    assert.throws(()=>check(bytes.subarray(0,cap),type,bytes.length),/Animated/);checks++;
  }
  for(const format of ['jpeg','png','webp']){
    const bytes=await sharp({create:{width:20,height:10,channels:3,background:'#406080'}}).toFormat(format).toBuffer();
    check(bytes,`image/${format}`,bytes.length);checks++;
  }
  const header=still.subarray(0,33),tail=still.subarray(33);
  const text=Buffer.from('Note\0acTL ANIM ANMF are plain metadata, not animation chunks');
  const misleading=Buffer.concat([header,pngChunk('tEXt',text),tail]);
  check(misleading,'image/png',misleading.length);checks++;
  const padded=Buffer.concat([header,pngChunk('tEXt',Buffer.alloc(cap)),tail]);
  assert.throws(()=>check(padded.subarray(0,cap),'image/png',padded.length),/header could not/);checks++;
  const tooLong=Buffer.from(still);tooLong.writeUInt32BE(0xffffffff,33);
  assert.throws(()=>check(tooLong,'image/png',tooLong.length),/header could not/);checks++;
  for(const length of [0,1,7,12,24,32]){
    assert.throws(()=>check(still.subarray(0,length),'image/png',length));checks++;
  }
  const noData=Buffer.concat([header,pngChunk('IEND',Buffer.alloc(0))]);
  assert.throws(()=>check(noData,'image/png',noData.length),/header could not/);checks++;
  const truncated=Buffer.concat([header,pngChunk('tEXt',text).subarray(0,10)]);
  assert.throws(()=>check(truncated,'image/png',truncated.length),/header could not/);checks++;
  for(const mutate of [b=>b.writeUInt32LE(0xffffffff,4),b=>b.writeUInt32LE(12,16),b=>b.write('ANIM',12),b=>b.write('FAIL',8)]){
    const invalid=Buffer.from(webp);mutate(invalid);
    assert.throws(()=>check(invalid,'image/webp',invalid.length),/header could not/);checks++;
  }
  // IDAT content may extend beyond the bounded prefix; no need to read pixel payload to classify a still PNG.
  const idat=chunks(still).find(c=>c.kind==='IDAT');
  const prefix=Buffer.concat([header,idat.bytes.subarray(0,8)]);
  check(prefix,'image/png',still.length);checks++;
  console.log(JSON.stringify({passed:true,checks,scope:'Bounded chunk/animation preflight, not a complete image validator'}));
})().catch(e=>{console.error(e);process.exitCode=1});
