/* eslint-disable @typescript-eslint/no-require-imports -- Isolated CommonJS loader for the actual TS server page. */
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
const { selectCatalogue, catalogueHref } = require('@/lib/catalogue');
const { localProducts } = require('@/lib/localProducts');
const api = require('@/lib/api');
let source = localProducts;
api.getProducts = async () => { if (source instanceof Error) throw source; return source; };
const { default: ProductsPage, generateMetadata } = require('@/app/products/page');

(async () => {
  const cases = [
    [{}, 10], [{ category: 'smart-lock' }, 7], [{ category: 'SMART LOCKS' }, 7],
    [{ category: 'installation-service' }, 1], [{ category: 'security-camera-kits' }, 2],
    [{ category: 'lockin' }, 6], [{ category: 'fingerprint-smart-locks' }, 3],
    [{ brand: 'Lockin' }, 6], [{ brand: 'kaadas' }, 1], [{ brand: 'dahua' }, 2], [{ brand: 'ade-smart-home' }, 1],
    [{ category: 'smart-lock', brand: 'lockin' }, 6], [{ category: 'security-camera-kits', brand: 'lockin' }, 0],
    [{ category: 'installation-service', brand: 'kaadas' }, 0], [{ category: '', brand: '' }, 10],
  ];
  for (const [params, count] of cases) {
    const selection = selectCatalogue(source, params);
    assert.ok(selection.valid, JSON.stringify(params));
    assert.equal(selection.products.length, count, JSON.stringify(params));
    const metadata = await generateMetadata({ searchParams: Promise.resolve(params) });
    assert.equal(metadata.robots?.index, selection.filtered ? false : undefined);
    assert.equal(metadata.alternates.canonical, 'https://www.adesmarthome.com.au/products');
  }
  for (const params of [
    { brand: 'in' }, { brand: 'fingerprint' }, { brand: 'unlisted' }, { category: 'unlisted' },
    { category: '!!!' }, { category: ['smart-lock', 'security-camera-kits'] }, { brand: ['lockin', 'kaadas'] },
    { category: 'x'.repeat(101) },
  ]) {
    assert.equal(selectCatalogue(source, params).valid, false);
    const metadata = await generateMetadata({ searchParams: Promise.resolve(params) });
    assert.deepEqual(metadata.robots, { index: false, follow: false });
    await assert.rejects(() => ProductsPage({ searchParams: Promise.resolve(params) }));
  }
  assert.equal(catalogueHref('security-camera-kits', 'lockin'), '/products?category=security-camera-kits&brand=lockin');
  const all = selectCatalogue(source, {});
  assert.deepEqual(all.groups.map(g => g.products.length), [1, 7, 2]);
  assert.equal(all.products[0].slug, 'smart-lock-installation-only-service');
  assert.deepEqual(all.brands.map(b => b.name), ['ADE Smart Home', 'Dahua', 'Kaadas', 'Lockin']);
  const empty = renderToStaticMarkup(await ProductsPage({ searchParams: Promise.resolve({ category: 'security-camera-kits', brand: 'lockin' }) }));
  assert.match(empty, /No matching products/); assert.match(empty, /Clear all filters/);
  source = [];
  const absent = renderToStaticMarkup(await ProductsPage({}));
  assert.match(absent, /Catalogue unavailable/); assert.doesNotMatch(absent, /No matching products/);
  source = new Error('Synthetic source failure');
  await assert.rejects(() => ProductsPage({}), /Synthetic source failure/);
  console.log('PASS: 15 catalogue selections, 8 invalid queries, grouping/brand provenance, empty data and source failure.');
})().catch(error => { console.error(error); process.exitCode = 1; });
