const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true, target: ts.ScriptTarget.ES2020,
  } }).outputText, filename);
};
for (const [file, name] of [['ProductGallery', 'ProductGallery'], ['InstallationPhotoStrip', 'InstallationPhotoStrip'], ['StoryCarousel', 'default']]) {
  const filename = require.resolve(`@/components/${file}`);
  require.cache[filename] = { id: filename, filename, loaded: true, exports: { __esModule: true, [name]: () => null } };
}
const api = require('@/lib/api');
const { localProducts } = require('@/lib/localProducts');
const { notFound } = require('next/navigation');
const { default: ProductPage, generateMetadata } = require('@/app/products/[slug]/page');
const props = { params: Promise.resolve({ slug: 'lockin-v5-max-smart-lock' }) };

(async () => {
  let missingDigest;
  try { notFound(); } catch (error) { missingDigest = error.digest; }
  assert.ok(missingDigest);
  api.getProduct = async () => null;
  await assert.rejects(() => ProductPage(props), error => error.digest === missingDigest);
  assert.equal((await generateMetadata(props)).robots.index, false);
  const failure = new Error('Synthetic product source unavailable');
  api.getProduct = async () => { throw failure; };
  await assert.rejects(() => ProductPage(props), error => error === failure, 'Source failures must reach the error boundary, not become a 404');
  await assert.rejects(() => generateMetadata(props), error => error === failure);
  api.getProduct = async () => localProducts.find(product => product.slug === 'lockin-v5-max-smart-lock');
  assert.ok(await ProductPage(props));
  assert.match((await generateMetadata(props)).title, /V5/i);
  console.log(JSON.stringify({ passed: true, checks: 6, scope: 'Actual server functions with isolated source fixtures; not a browser error-boundary test' }));
})().catch(error => { console.error(error); process.exitCode = 1; });
