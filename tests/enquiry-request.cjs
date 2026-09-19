const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const sandbox = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/enquiryRequest.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText,
  { module: sandbox, exports: sandbox.exports, Request, require: () => ({ MAX_TOTAL_PHOTO_BYTES: 3500000 }) });
const { readBoundedEnquiryRequest: read, MAX_ENQUIRY_REQUEST_BYTES: limit } = sandbox.exports;

(async () => {
  let checks = 0;
  for (const size of [0, 1, limit]) {
    const request = new Request('http://test.invalid', { method: 'POST', body: 'x'.repeat(size) });
    assert.equal((await (await read(request)).arrayBuffer()).byteLength, size); checks++;
  }
  for (const declared of [undefined, '1', String(limit + 1)]) {
    let cancelled = false, pulls = 0;
    const body = new ReadableStream({
      pull(controller) { pulls++; controller.enqueue(new Uint8Array(500000)); },
      cancel() { cancelled = true; },
    });
    const request = new Request('http://test.invalid', { method: 'POST', body, duplex: 'half', headers: declared ? { 'content-length': declared } : {} });
    await assert.rejects(read(request), error => error.status === 413);
    assert.ok(cancelled); assert.ok(pulls <= 10); checks++;
  }
  for (const length of ['-1', 'abc', '1.1', '9007199254740992']) {
    await assert.rejects(read(new Request('http://test.invalid', { method: 'POST', body: '{}', headers: { 'content-length': length } })), error => error.status === 400); checks++;
  }
  const form = new FormData(); form.set('service', 'installation-only'); form.set('photos', new File(['test bytes'], 'door.jpg', { type: 'image/jpeg' }));
  const parsed = await (await read(new Request('http://test.invalid', { method: 'POST', body: form }))).formData();
  assert.equal(parsed.get('service'), 'installation-only'); assert.equal(await parsed.get('photos').text(), 'test bytes'); checks++;
  console.log(JSON.stringify({ passed: true, checks, scope: 'Body bytes and cancellation only; not distributed request-rate limiting' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
