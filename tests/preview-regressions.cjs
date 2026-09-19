const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const groups = {
  contracts: ['enquiry.test', 'enquiry-request', 'enquiry-receipt', 'enquiry-delivery', 'lead-conversion', 'photo-metadata', 'photo-header', 'catalogue', 'gallery-filters', 'product-pricing', 'product-error-contract', 'story-ssr', 'navigation-state.test', 'hero-state.test', 'camera-content-scope'],
  browser: ['observer-fallback-browser', 'lifecycle-browser', 'glass-contrast-browser', 'site-forced-colors', 'selection-indicator-browser', 'photo-preview-browser', 'photo-batch-browser', 'photo-total-browser', 'photo-safety-browser', 'enquiry-browser', 'contact-copy-browser', 'enquiry-motion-browser', 'enquiry-confirmation-hydration', 'hero-interaction-browser', 'mobile-dock-layout', 'header-text-resize', 'site-inventory'],
  acceptance: ['service-theme-content', 'service-theme-browser', 'site-text-resize-browser', 'site-inventory', 'enquiry-browser'],
  followup: ['lifecycle-browser', 'enquiry-browser', 'enquiry-motion-browser', 'enquiry-confirmation-hydration', 'mobile-dock-layout', 'site-inventory'],
};
const group = process.argv[2] || 'contracts';
assert.ok(groups[group], 'Choose contracts, browser, acceptance or followup');
fs.mkdirSync('output/final-regressions', { recursive: true });
const results = [];
for (const name of groups[group]) {
  const started = Date.now();
  const result = spawnSync(process.execPath, [`tests/${name}.cjs`], { encoding: 'utf8', timeout: 900000, maxBuffer: 8 * 1024 * 1024, env: { ...process.env, SMTP_USER: '', SMTP_APP_PASSWORD: '' } });
  fs.writeFileSync(`output/final-regressions/${name}.log`, `${result.stdout || ''}\n${result.stderr || ''}`);
  results.push({ name, exitCode: result.status, elapsedMs: Date.now() - started, error: result.error?.message });
  fs.writeFileSync(`output/final-regressions/${group}.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results.at(-1)));
  assert.equal(result.status, 0, `${name}: inspect output/final-regressions/${name}.log`);
}
console.log(JSON.stringify({ passed: true, group, suites: results.length }));
