const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { gzipSync } = require('node:zlib');

const sandbox = {};
vm.runInNewContext(fs.readFileSync('.next/server/app/page_client-reference-manifest.js', 'utf8'), sandbox);
const manifest = Object.values(sandbox.__RSC_MANIFEST)[0];
const components = ['Header', 'HeroMediaCarousel', 'StoryRail', 'MobileContactBar', 'DisclosureMotion', 'ProcessStepMotion', 'GlassHighlight', 'RevealGroup', 'ContactForm', 'VisualEffectsControl'];
const entries = Object.entries(manifest.clientModules).filter(([key]) => components.some(name => key.endsWith(`/src/components/${name}.tsx`)));
assert.equal(entries.length, components.length);
const chunks = [...new Set(entries.flatMap(([, value]) => value.chunks))].map(url => {
  assert.ok(url.startsWith('/_next/static/chunks/'));
  const bytes = fs.readFileSync(path.join('.next', url.slice('/_next/'.length)));
  return { url, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
});
const gzipBytes = chunks.reduce((sum, chunk) => sum + chunk.gzipBytes, 0);
assert.ok(gzipBytes <= 60000, `Home motion component-entry chunks exceed the conservative 60KB budget: ${gzipBytes}`);
const clientFiles = fs.readdirSync('.next/static/chunks', { recursive: true }).filter(file => file.endsWith('.js'));
const findings = [];
for (const file of clientFiles) {
  const source = fs.readFileSync(path.join('.next/static/chunks', file), 'utf8');
  for (const name of ['SMTP_APP_PASSWORD', 'SMTP_USER', 'nodemailer', 'BEGIN PRIVATE KEY', 'BEGIN RSA PRIVATE KEY']) {
    if (source.includes(name)) findings.push({ file, name });
  }
}
assert.deepEqual(findings, []);
const result = {
  recordedAt: new Date().toISOString(), buildId: fs.readFileSync('.next/BUILD_ID', 'utf8').trim(),
  components, chunks, gzipBytes, clientFilesScanned: clientFiles.length, findings,
  scope: 'Deduplicated homepage component-entry chunks include non-motion code and shared helpers, a conservative container bound rather than a before/after motion-only measurement. Framework/bootstrap, other routes, interaction-only lazy chunks and network headers are not part of this budget. Literal SMTP/private-key scan is not a comprehensive secret audit or production-environment check.',
};
fs.mkdirSync('output/client-bundle-audit', { recursive: true });
fs.writeFileSync('output/client-bundle-audit/results.json', JSON.stringify(result, null, 2));
console.log(JSON.stringify(result));
