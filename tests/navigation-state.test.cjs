(async () => {
  const { test } = await import('node:test');
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const { createRequire } = await import('node:module');
  const ts = createRequire(__filename)('typescript');
  const loadedModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/navigation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { module: loadedModule, exports: loadedModule.exports });
  const { activeNavigationHref: active } = loadedModule.exports;
  const products = { '/products/example-lock': 'locks', '/products/example-camera': 'cctv', '/products/example-fitting': 'installation' };
  const cases = [
    ['/products', undefined, null], ['/products', null, '/products'],
    ['/products', 'smart-lock', '/products?category=smart-lock'],
    ['/products', 'SMART LOCKS', '/products?category=smart-lock'],
    ['/products', 'kaadas', '/products?category=smart-lock'],
    ['/products', 'security-camera-kits', '/products/security-camera-kits'],
    ['/products', 'unknown', null],
    ['/products/security-camera-kits', null, '/products/security-camera-kits'],
    ['/products/example-lock', null, '/products?category=smart-lock'],
    ['/products/example-camera', null, '/products/security-camera-kits'],
    ['/products/example-fitting', null, '/smart-lock-installation-only-adelaide'],
    ['/blog/entry', null, '/blog'], ['/brands/lockin', null, '/brands'],
    ['/gallery', null, '/gallery'], ['/about', null, '/about'], ['/', null, '/'],
  ];
  for (const [path, category, expected] of cases) test(`${path}, category=${category}`, () => assert.equal(active(path, category, products), expected));
})().catch(error => { console.error(error); process.exitCode = 1; });
