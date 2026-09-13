/* eslint-disable @typescript-eslint/no-require-imports -- Isolated TS server-template fixtures. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { renderToStaticMarkup } = require('react-dom/server');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, ...args);
};
for (const ext of ['.ts', '.tsx']) Module._extensions[ext] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020 },
}).outputText, filename);
const source = require('@/lib/installationProjects');
const real = source.installationProjects;
const { selectGallery } = require('@/lib/galleryFilters');
const { default: GalleryPage, generateMetadata } = require('@/app/gallery/page');
const output = 'output/gallery-filter-verification';
fs.mkdirSync(output, { recursive: true });

(async () => {
  let checks = 0;
  for (const params of [{}, { model: '' }, { model: 'X9' }, { model: 'v5 max' }, { suburb: 'Adelaide' }, { model: 'X9', suburb: 'Adelaide' }]) {
    const selected = selectGallery(real, params);
    assert.equal(selected.valid, true);
    assert.equal(selected.results.length, params.model ? 1 : 6);
    const metadata = await generateMetadata({ searchParams: Promise.resolve(params) });
    assert.equal(metadata.robots?.index, selected.filtered ? false : undefined);
    const html = renderToStaticMarkup(await GalleryPage({ searchParams: Promise.resolve(params) }));
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1])).find(s => s['@type'] === 'ImageGallery');
    assert.deepEqual(schema.associatedMedia.map(item => item.name), selected.results.map(p => p.title));
    assert.equal((html.match(/data-gallery-project/g) || []).length, selected.results.length);
    assert.match(html, /method="get"/);
    checks++;
  }
  for (const params of [{ model: 'unlisted' }, { model: ['X9', 'SV40'] }, { suburb: ['Adelaide'] }, { model: 'v5' }, { model: ' ' }, { model: 'x'.repeat(101) }, { suburb: 'Melbourne' }]) {
    assert.equal(selectGallery(real, params).valid, false);
    assert.deepEqual((await generateMetadata({ searchParams: Promise.resolve(params) })).robots, { index: false, follow: false });
    await assert.rejects(() => GalleryPage({ searchParams: Promise.resolve(params) }));
    checks++;
  }
  source.installationProjects = [{ ...real[0], suburb: 'Fixture A' }, { ...real[1], suburb: 'Fixture B' }];
  const params = { model: real[0].category, suburb: 'Fixture B' };
  assert.equal(selectGallery(source.installationProjects, params).valid, true);
  assert.equal(selectGallery(source.installationProjects, params).results.length, 0);
  const empty = renderToStaticMarkup(await GalleryPage({ searchParams: Promise.resolve(params) }));
  assert.match(empty, /No matching installations/); assert.match(empty, /Clear all filters/);
  assert.match(empty, /name="suburb"/); assert.doesNotMatch(empty, /primaryImageOfPage/);
  fs.writeFileSync(`${output}/empty.html`, empty);
  source.installationProjects = [];
  const absent = renderToStaticMarkup(await GalleryPage({}));
  assert.match(absent, /Installation photos unavailable/); assert.doesNotMatch(absent, /No matching installations/);
  fs.writeFileSync(`${output}/absent.html`, absent);
  source.installationProjects = null;
  await assert.rejects(() => GalleryPage({}), TypeError);
  source.installationProjects = real;
  assert.deepEqual(selectGallery(real, {}).suburbs, ['Adelaide']);
  assert.deepEqual(selectGallery(real, {}).models, real.map(p => p.category));
  console.log(`PASS ${checks} real/invalid filter cases; real-data options, matching schema, valid empty combination, absent data and source failure.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
