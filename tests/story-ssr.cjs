const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) { return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, ...args); };
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const StoryCarousel = require('@/components/StoryCarousel').default;
const out = 'output/story-verification';
fs.mkdirSync(out, { recursive: true });
for (const count of [0, 1, 2, 6]) {
  const stories = Array.from({ length: count }, (_, index) => ({ slug: `synthetic-story-${index}`, title: `Fixture ${'LongTitle'.repeat(25)} ${index}`, category: '', suburb: '', coverImage: '' }));
  const html = renderToStaticMarkup(React.createElement(StoryCarousel, { stories }));
  if (!count) assert.equal(html, '');
  else {
    assert.equal((html.match(/class="story-card /g) || []).length, count);
    assert.equal((html.match(/<button/g) || []).length, count > 1 ? 2 : 0);
    assert.equal((html.match(/Image unavailable/g) || []).length, count);
    assert.ok(html.includes(stories[0].title));
    assert.doesNotMatch(html, /line-clamp|Untitled Project/);
  }
  fs.writeFileSync(`${out}/fixture-${count}.html`, html);
}
console.log('PASS story SSR: empty, one, two and six entries; long titles, absent metadata and missing photos.');
