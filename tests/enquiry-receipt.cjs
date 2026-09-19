const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies = {}) {
  const sandboxModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText,
    { module: sandboxModule, exports: sandboxModule.exports, require: name => dependencies[name] });
  return sandboxModule.exports;
}
const enquiry = load('src/lib/enquiry.ts');
const delivery = load('src/lib/enquiryDelivery.ts');
const { parseEnquiryReceipt: parse, enquiryReceiptDetails: details } = load('src/lib/enquiryReceipt.ts', { './enquiry': enquiry, './enquiryDelivery': delivery });
let checks = 0;
for (const option of enquiry.serviceOptions) {
  const value = { leadId: 'LEAD-123', service: option.value, email: 'private@example.invalid' };
  assert.equal(JSON.stringify(parse(JSON.stringify(value))), JSON.stringify({ leadId: value.leadId, service: value.service }));
  assert.ok(details(option.value).intro); assert.ok(details(option.value).review); assert.ok(details(option.value).next); checks++;
}
for (const raw of [null, undefined, '', '{bad', 'null', '[]', '{}', JSON.stringify({ leadId: 'x', service: 'unknown' }),
  JSON.stringify({ leadId: {}, service: 'installation-only' }), JSON.stringify({ leadId: 'x'.repeat(101), service: 'installation-only' }),
  JSON.stringify({ leadId: 'person@example.com', service: 'installation-only' }), ' '.repeat(513)]) {
  assert.equal(parse(raw), null); checks++;
}
assert.equal(details('__proto__').intro, details('not-sure').intro); checks++;
assert.match(details('installation-only').next, /installation-only/); checks++;
assert.doesNotMatch(JSON.stringify(details('security-camera-kit')), /door|installation|coverage planning/i); checks++;
console.log(JSON.stringify({ passed: true, checks }));
