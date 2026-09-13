const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
function load(file, dependencies, globals = {}) {
  const output = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
  }).outputText, { module: output, exports: output.exports, require: name => dependencies[name], ...globals });
  return output.exports;
}
const enquiry = load('src/lib/enquiry.ts', {});
const delivery = load('src/lib/enquiryDelivery.ts', {});
function harness(body, mode) {
  let stored = typeof body === 'string' ? body : body == null ? null : JSON.stringify(body);
  const events = [];
  const tracker = load('src/components/LeadConversionTracker.tsx', {
    react: { useEffect: effect => effect() },
    '@/lib/enquiry': enquiry,
    '@/lib/enquiryDelivery': delivery,
    '@/lib/analytics': {
      trackEvent: (...args) => events.push(args),
      trackGoogleAdsLead: () => events.push(['google']),
      trackMetaLead: args => events.push(['meta', args]),
    },
  }, { sessionStorage: {
    getItem() { if (mode === 'read-fail') throw Error('denied'); return stored; },
    removeItem() { if (mode === 'remove-fail') throw Error('denied'); stored = null; },
  } });
  return { run: tracker.LeadConversionTracker, events };
}
let checks = 0;
for (const body of [null, '{}', '{bad', 'null', '[]', { service: 'installation-only' },
  { leadId: '' }, { leadId: {} }, { leadId: 'email@example.com' }, { leadId: 'x'.repeat(101) }]) {
  const test = harness(body); test.run(); assert.equal(test.events.length, 0, `Invalid context: ${JSON.stringify(body)}`); checks++;
}
for (const mode of ['read-fail', 'remove-fail']) {
  const test = harness({ leadId: 'LEAD-123' }, mode); test.run(); test.run();
  assert.equal(test.events.length, 0); checks++;
}
for (const service of enquiry.serviceOptions.map(option => option.value)) {
  const test = harness({ leadId: 'LEAD-123', service, product: 'Lockin X9', photoCount: 4, preferredTiming: 'within-one-week' });
  test.run(); test.run();
  assert.equal(test.events.filter(event => event[0] === 'generate_lead').length, 1);
  assert.equal(test.events.filter(event => event[0] === 'photo_ready_lead').length, 1);
  assert.equal(test.events[0][1].service, service);
  assert.equal(test.events[0][1].product, 'lockin-x9-smart-lock');
  assert.equal(test.events[0][1].lead_quality, 'high'); checks++;
}
for (const count of [-1, 5, 1.5, '4', null, {}]) {
  const test = harness({ leadId: 'LEAD-123', service: 'person@example.com', product: 'Customer private text', photoCount: count });
  test.run(); assert.equal(test.events[0][1].photo_count, 0);
  assert.equal(test.events[0][1].service, 'not-specified');
  assert.equal(test.events[0][1].product, 'not-specified');
  assert.doesNotMatch(JSON.stringify(test.events), /person@example|Customer private/); checks++;
}
console.log(JSON.stringify({ passed: true, checks }));
