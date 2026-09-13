/* eslint-disable @typescript-eslint/no-require-imports -- Isolated CommonJS loader exercises TS server templates. */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');

// Execute actual server templates against isolated fixtures, without changing the catalogue.
const resolve = Module._resolveFilename;
Module._resolveFilename = function(request, ...args) {
  return resolve.call(this, request.startsWith('@/') ? path.resolve('src', request.slice(2)) : request, ...args);
};
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: {
    module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
    target: ts.ScriptTarget.ES2020,
  } }).outputText, filename);
};
for (const [file, name] of [['ProductGallery', 'ProductGallery'], ['InstallationPhotoStrip', 'InstallationPhotoStrip'], ['StoryCarousel', 'default']]) {
  const filename = require.resolve(`@/components/${file}`);
  const component = file === 'ProductGallery'
    ? () => React.createElement('div', { style: { aspectRatio: '1', width: '100%' }, 'aria-hidden': true })
    : () => null;
  require.cache[filename] = { id: filename, filename, loaded: true, exports: { __esModule: true, [name]: component } };
}
const { formatMinorPrice, getPrice, priceLabel } = require('@/lib/productPricing');
const { localProducts } = require('@/lib/localProducts');
const api = require('@/lib/api');
let fixture;
api.getProduct = async () => fixture;
const { ProductCard } = require('@/components/ProductCard');
const { getProductStock } = require('@/lib/productStock');
const { default: ProductPage, generateMetadata } = require('@/app/products/[slug]/page');

(async () => {
  let checks = 0;
  for (const [value, unit, expected] of [
    ['69900', 2, '699'], ['1234', 2, '12.34'], ['1230', 2, '12.30'],
    ['1', 2, '0.01'], ['10', 2, '0.10'], ['559', 0, '559'],
    ['1350001', 3, '1350.001'], ['0001230', 2, '12.30'], ['1', 6, '0.000001'],
    ['9007199254740991', 6, '9007199254.740991'],
  ]) { assert.equal(formatMinorPrice(value, unit), expected); checks++; }
  for (const value of [undefined, null, '', ' ', '0', '000', '-1', '123abc', '12.30', '1e3', 'Infinity', 'NaN', 123, '9007199254740992']) {
    assert.equal(formatMinorPrice(value), null); checks++;
  }
  for (const unit of [-1, 1.5, 7, NaN, Infinity, null, '2']) {
    assert.equal(formatMinorPrice('1234', unit), null); checks++;
  }
  assert.equal(formatMinorPrice('114930', 2, true), '1,149.30');
  assert.equal(formatMinorPrice('1234'), '12.34');
  assert.equal(priceLabel(null), 'Quote Required'); checks += 3;
  for (const [regular, sale] of [['1235', true], ['1234', false], ['1233', false], ['0', false], ['1235abc', false]]) {
    assert.equal(getPrice({ prices: { price: '1234', regular_price: regular } }).isOnSale, sale); checks++;
  }

  const base = { ...localProducts.find(p => p.slug.includes('ola-slim')), description: '', short_description: '' };
  const cases = [
    { name: 'camera-fraction', categories: [{ slug: 'security-camera-kits' }], prices: { price: '44399' }, installed_price: undefined, current: '443.99', camera: true },
    { name: 'camera-unknown', categories: [{ slug: 'security-camera-kits' }], prices: undefined, installed_price: undefined, current: null, camera: true },
    { name: 'fraction', prices: { price: '55930', regular_price: '60010' }, installed_price: '89999', current: '559.30', installed: '899.99' },
    { name: 'zero-unit', prices: { price: '559', currency_minor_unit: 0 }, installed_price: '899', current: '559', installed: '899' },
    { name: 'three-unit', prices: { price: '559001', currency_minor_unit: 3 }, installed_price: '899123', current: '559.001', installed: '899.123' },
    { name: 'missing', prices: undefined, installed_price: undefined, current: null },
    { name: 'zero', prices: { price: '0' }, installed_price: '0', current: null },
    { name: 'malformed', prices: { price: '559abc' }, installed_price: '899abc', current: null },
    { name: 'installed-only-price', prices: { price: '' }, installed_price: '89930', current: null, installed: '899.30' },
    { name: 'service', kind: 'service', prices: { price: '20010' }, installed_price: undefined,
      service_options: [{ name: 'Compact locks', price: '20010', description: 'Compact' }, { name: 'Standard 6068', price: '35099', description: 'Full size' }], current: '200.10' },
    { name: 'service-unknown', kind: 'service', prices: undefined, installed_price: undefined,
      service_options: [{ name: 'Compact smart lock / small lock body', price: '', description: 'Compact' }, { name: 'Full-size smart lock / standard 6068 mortise', price: '0', description: 'Full size' }], current: null },
    { name: 'stock-available', in_stock: true, prices: { price: '55900' }, current: '559' },
    { name: 'stock-unavailable', in_stock: false, prices: { price: '55900' }, current: '559' },
    { name: 'stock-unknown', in_stock: undefined, prices: { price: '55900' }, current: '559' },
    { name: 'image-missing-long-title', images: [], title: 'SmartLockWithAnUnusuallyLongUnbrokenModelIdentifierAndExtendedProductDescription',
      in_stock: false, prices: { price: '55930', regular_price: '69999' }, current: '559.30' },
    { name: 'service-stock-ignored', kind: 'service', in_stock: false, prices: { price: '20000' }, current: '200',
      service_options: [{ name: 'Compact locks', price: '20000', description: 'Compact' }] },
  ];
  const output = 'output/product-pricing-verification';
  fs.mkdirSync(output, { recursive: true });
  for (const test of cases) {
    fixture = { ...base, ...test, name: test.title || base.name };
    if (test.name.startsWith('stock-') || test.title || test.name === 'service-stock-ignored') fixture.installed_price = undefined;
    const props = { params: Promise.resolve({ slug: fixture.slug }) };
    const html = renderToStaticMarkup(await ProductPage(props));
    const card = renderToStaticMarkup(React.createElement(ProductCard, { product: fixture }));
    const metadata = await generateMetadata(props);
    const schema = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    const entity = schema.find(s => s['@type'] === (fixture.kind === 'service' ? 'Service' : 'Product'));
    assert.ok(entity, test.name);
    const label = priceLabel(test.current);
    const stock = getProductStock(fixture);
    assert.equal(stock?.label ?? null, fixture.kind !== 'service' && typeof fixture.in_stock === 'boolean'
      ? fixture.in_stock ? 'In stock' : 'Out of stock' : null);
    assert.equal(card.includes('data-product-stock'), Boolean(stock));
    if (stock) assert.ok(card.includes(stock.label) && html.includes(stock.label));
    if (fixture.kind !== 'service') assert.equal(entity.offers?.availability, test.current ? stock?.schema : undefined);
    assert.doesNotMatch(card, /<button\b/);
    if (fixture.images?.length === 0) {
      assert.ok(card.includes('Image unavailable'));
      assert.doesNotMatch(html, /placeholder\.jpg/);
    }
    assert.ok(card.includes(label), `${test.name}: card price`);
    assert.ok(html.includes(label), `${test.name}: detail price`);
    if (fixture.kind === 'service') {
      assert.deepEqual(entity.hasOfferCatalog.itemListElement.map(o => o.price), fixture.service_options.map(o => formatMinorPrice(o.price) ?? undefined));
    } else {
      assert.equal(entity.offers?.price ?? null, test.current);
      if (test.current === null) assert.equal(Object.hasOwn(entity, 'offers'), false);
    }
    if (test.current) assert.ok(metadata.description.includes(test.current), `${test.name}: metadata`);
    else assert.doesNotMatch(metadata.description, /\$(?:0\b|null|NaN)/);
    if (test.installed) {
      assert.ok(html.includes(`$${test.installed}`)); assert.ok(card.includes(`$${test.installed}`));
    }
    if (!test.installed && fixture.kind !== 'service' && !test.camera) {
      assert.ok(html.includes('Lock only; installation quoted separately'));
      assert.equal(entity.additionalProperty[0].value, 'Quoted separately');
    }
    fs.writeFileSync(`${output}/${test.name}.html`, html);
    fs.writeFileSync(`${output}/${test.name}-card.html`, card);
    checks++;
  }
  for (const product of localProducts) {
    const amount = getPrice(product).current;
    assert.equal(Number(amount), Number(product.prices.price) / 10 ** product.prices.currency_minor_unit);
    checks++;
  }
  fs.writeFileSync(`${output}/report.json`, JSON.stringify({ checks, fixtures: cases.map(c => c.name), catalogueProducts: localProducts.length }, null, 2));
  console.log(`PASS: ${checks} pricing cases, including ${cases.length} actual server-template fixtures and ${localProducts.length} catalogue amounts.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
