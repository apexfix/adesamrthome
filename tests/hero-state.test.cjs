(async () => {
  const { test } = await import('node:test');
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs');
  const vm = await import('node:vm');
  const { createRequire } = await import('node:module');
  const ts = createRequire(__filename)('typescript');
  const loadedModule = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/heroCarousel.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { module: loadedModule, exports: loadedModule.exports });
  const { initialCarousel, reduceCarousel: reduce, canAutoPlay, HERO_INTERVAL } = loadedModule.exports;
  function ready(count) {
    let s = initialCarousel(count);
    s = reduce(s, { type: 'visible', value: true });
    s = reduce(s, { type: 'inViewport', value: true });
    for (let i = 0; i < count; i++) s = reduce(s, { type: 'ready', index: i });
    return s;
  }
  for (const count of [0,1,2,3]) test(`${count} slides: readiness, wrapping and controls`, () => {
    assert.equal(Boolean(canAutoPlay(initialCarousel(count))), false);
    let s = ready(count);
    assert.equal(Boolean(canAutoPlay(s)), count > 1);
    for (let i = 0; i < 12; i++) s = reduce(s, { type: 'next' });
    assert.equal(s.index, count ? 12 % count : 0);
    s = reduce(s, { type: 'previous' });
    assert.equal(s.index, count ? (12 + count - 1) % count : 0);
    assert.equal(Boolean(canAutoPlay(s)), false);
  });
  test('seven second timer and higher priority gates', () => {
    assert.equal(HERO_INTERVAL, 7000);
    const s = ready(3);
    assert.equal(canAutoPlay(s, true), false);
    for (const type of ['visible', 'inViewport']) {
      const hidden = reduce(s, { type, value: false });
      assert.equal(canAutoPlay(reduce(hidden, { type: 'play' })), false);
      assert.equal(reduce(hidden, { type: 'tick' }).index, 0);
      assert.ok(canAutoPlay(reduce(hidden, { type, value: true })));
    }
  });
  test('interaction pause survives visibility changes until explicit play', () => {
    let s = reduce(ready(3), { type: 'pause' });
    s = reduce(s, { type: 'inViewport', value: false });
    s = reduce(s, { type: 'inViewport', value: true });
    assert.equal(canAutoPlay(s), false);
    s = reduce(s, { type: 'play' });
    assert.ok(canAutoPlay(s));
    assert.equal(reduce(s, { type: 'tick' }).index, 1);
  });
  test('slow image preserves active slide and commits only the latest target', () => {
    let s = reduce(initialCarousel(3), { type: 'ready', index: 0 });
    s = reduce(s, { type: 'next' });
    assert.equal(s.index, 0); assert.equal(s.pending, 1);
    s = reduce(s, { type: 'next' });
    assert.equal(s.pending, 2);
    s = reduce(s, { type: 'ready', index: 1 });
    assert.equal(s.index, 0); assert.equal(s.pending, 2);
    s = reduce(s, { type: 'ready', index: 2 });
    assert.equal(s.index, 2); assert.equal(s.pending, null);
    assert.ok(s.userPaused);
  });
  test('pending selection can be cancelled and invalid input is ignored', () => {
    let s = reduce(initialCarousel(3), { type: 'ready', index: 0 });
    s = reduce(s, { type: 'select', index: 2 });
    s = reduce(s, { type: 'select', index: 0 });
    s = reduce(s, { type: 'ready', index: 2 });
    assert.equal(s.index, 0); assert.equal(s.pending, null);
    for (const index of [-1, 3, 1.5, NaN]) assert.equal(reduce(s, { type: 'select', index }), s);
    for (const count of [-1, Infinity, NaN]) assert.equal(initialCarousel(count).count, 0);
  });
})();
