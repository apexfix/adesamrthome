const assert = require('node:assert/strict');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const ts = require('typescript');
const files = [
  'src/components/AudienceServicePage.tsx',
  'src/app/airbnb-smart-lock-installation-adelaide/page.tsx',
  'src/app/service-areas/page.tsx',
  'src/app/smart-lock-installation-only-adelaide/page.tsx',
  'src/app/smart-lock-supply-installation-adelaide/page.tsx',
  'src/app/smart-lock-installation/[suburb]/page.tsx',
  'src/app/zh/page.tsx',
];
function withoutClasses(file, source) {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const spans = [];
  function visit(node) {
    if (ts.isJsxAttribute(node) && node.name.getText(tree) === 'className') spans.push([node.getStart(tree), node.end]);
    else ts.forEachChild(node, visit);
  }
  visit(tree);
  for (const [start, end] of spans.sort((a,b) => b[0] - a[0])) source = source.slice(0, start) + source.slice(end);
  return source.replace(/\r\n/g, '\n');
}
for (const file of files) {
  const before = execFileSync('git', ['show', `96b4708:${file}`], { encoding: 'utf8' });
  assert.equal(withoutClasses(file, fs.readFileSync(file, 'utf8')), withoutClasses(file, before), file);
}
console.log(JSON.stringify({ cases: files.length, passed: true, scope: 'Only className values changed in the seven service-theme sources; content, URLs and metadata match checkpoint 96b4708.' }));
