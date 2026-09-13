const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const output = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/enquiryDelivery.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText, { module: output, exports: output.exports });
const { readEnquiryResponse: read } = output.exports;
let checks = 0;
for (const status of [200, 201, 202]) {
  assert.equal(read(status, { success: true, leadId: 'lead_123-abc' }).leadId, 'lead_123-abc'); checks++;
}
for (const body of [null, {}, { success: false, leadId: 'id' }, { success: true },
  { success: true, leadId: {} }, { success: true, leadId: 'email@example.com' },
  { success: true, leadId: 'x'.repeat(101) }]) {
  assert.equal(read(200, body).uncertain, true); checks++;
}
for (const status of [408, 500, 502, 503, 504]) {
  const result = read(status, { message: 'Internal diagnostic' });
  assert.equal(result.uncertain, true); assert.doesNotMatch(result.message, /Internal/); checks++;
}
for (const [status, pattern] of [[413, /too large/], [429, /wait/]]) {
  const result = read(status, null); assert.equal(result.uncertain, false); assert.match(result.message, pattern); checks++;
}
assert.equal(read(400, { message: 'Check suburb' }).message, 'Check suburb'); checks++;
assert.equal(read(400, { message: 'x'.repeat(600) }).message.length, 500); checks++;
assert.ok(read(400, { message: '  ' }).message.length); checks++;
console.log(JSON.stringify({ passed: true, checks }));
