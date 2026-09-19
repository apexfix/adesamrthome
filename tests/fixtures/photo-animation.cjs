const sharp = require('sharp');
const {crc32} = require('node:zlib');
function pngChunk(kind, data) {
  const chunk = Buffer.alloc(data.length + 12);
  chunk.writeUInt32BE(data.length); chunk.write(kind, 4); data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, -4)), chunk.length - 4);
  return chunk;
}
function chunks(png) {
  const result = [];
  for (let offset = 8; offset < png.length;) {
    const end = offset + png.readUInt32BE(offset) + 12;
    result.push({kind: png.toString('ascii', offset + 4, offset + 8), data: png.subarray(offset + 8, end - 4), bytes: png.subarray(offset, end)});
    offset = end;
  }
  return result;
}
async function animationFixtures() {
  const still = await sharp({create:{width:20,height:10,channels:3,background:'#ee2020'}}).png().toBuffer();
  const second = await sharp({create:{width:20,height:10,channels:3,background:'#2020ee'}}).png().toBuffer();
  const animationControl = Buffer.alloc(8); animationControl.writeUInt32BE(2);
  const control = sequence => {
    const data = Buffer.alloc(26);
    data.writeUInt32BE(sequence, 0); data.writeUInt32BE(20, 4); data.writeUInt32BE(10, 8);
    data.writeUInt16BE(1, 20); data.writeUInt16BE(10, 22);
    return pngChunk('fcTL', data);
  };
  const frame = Buffer.concat([Buffer.from([0,0,0,2]), ...chunks(second).filter(c=>c.kind==='IDAT').map(c=>c.data)]);
  const apng = Buffer.concat([still.subarray(0,8), chunks(still).find(c=>c.kind==='IHDR').bytes, pngChunk('acTL',animationControl), control(0), ...chunks(still).filter(c=>c.kind==='IDAT').map(c=>c.bytes), control(1), pngChunk('fdAT',frame), pngChunk('IEND',Buffer.alloc(0))]);
  const raw=Buffer.alloc(20*20*3);
  for(let i=0;i<400;i++)raw[i*3+(i<200?0:2)]=255;
  const webp=await sharp(raw,{raw:{width:20,height:20,channels:3,pageHeight:10}}).webp({loop:0,delay:[100,100]}).toBuffer();
  return {still,apng,webp};
}
module.exports={pngChunk,chunks,animationFixtures};
