const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sharp = require('sharp');
function load(file, dependencies) {
  const sandboxModule = { exports: {} };
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { module: sandboxModule, exports: sandboxModule.exports, Uint8Array, require: name => dependencies[name] ?? require(name) });
  return sandboxModule.exports;
}
(async () => {
  const limits = load('src/lib/enquiryPhotoLimits.ts', {});
  const header = load('src/lib/enquiryPhotoHeader.ts', {});
  const { checkEnquiryPhotoMetadata: check } = load('src/lib/enquiryPhotoMetadata.ts', { './enquiryPhotoLimits': limits, './enquiryPhotoHeader': header });
  let checks = 0;
  for (const format of ['jpeg','png','webp']) {
    const bytes = await sharp({create:{width:80,height:40,channels:3,background:'#406090'}}).toFormat(format).toBuffer();
    const meta = await check(new File([bytes],`photo.${format}`,{type:`image/${format}`}));
    assert.deepEqual([meta.width,meta.height,meta.type],[80,40,format]); checks++;
    await assert.rejects(check(new File([bytes],'wrong.png',{type:format==='png'?'image/jpeg':'image/png'})),/dimensions could not/); checks++;
  }
  const exact = await sharp({create:{width:5000,height:5000,channels:3,background:'#ffffff'}}).png().toBuffer();
  assert.equal((await check(new File([exact],'exact.png',{type:'image/png'}))).width,5000); checks++;
  const over = await sharp({create:{width:5001,height:5000,channels:3,background:'#ffffff'}}).png().toBuffer();
  assert.ok(over.length<850000);
  await assert.rejects(check(new File([over],'over.png',{type:'image/png'})),/25 megapixels/); checks++;
  for(const file of [new File([],'empty.png',{type:'image/png'}),new File(['not an image'],'bad.png',{type:'image/png'}),new File(['bad'],'bad.heic',{type:'image/heic'})]) { await assert.rejects(check(file)); checks++; }
  let reads=0;
  await assert.rejects(check({size:20000001,type:'image/jpeg',slice(){reads++;throw new Error('Must not read');}}),/20 MB/);
  assert.equal(reads,0); checks++;
  await check({size:20000000,type:'image/png',slice(start,end){assert.equal(start,0);assert.equal(end,262144);reads++;return new Blob([exact]);}});
  assert.equal(reads,1); checks++;
  await assert.rejects(check({size:100,type:'image/png',slice(){return {arrayBuffer(){throw new Error('Read failed');}};}}),/dimensions could not/); checks++;
  console.log(JSON.stringify({passed:true,checks,scope:'Metadata policy only; full image content remains server-validated'}));
})().catch(error=>{console.error(error);process.exitCode=1;});
