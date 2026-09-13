(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const label = process.argv[2] || 'sample';
  assert.match(label, /^[a-z0-9-]+$/);
  const output = `output/performance-verification/${label}`;
  await fs.mkdir(output, { recursive: true });
  const profiles = [
    { name: 'mobile', width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
    { name: 'desktop', width: 1440, height: 1000, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
  ];
  const routes = ['/', '/products', '/products/lockin-v5-max-smart-lock'];
  const settings = { latencyMs: 150, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750, cpuSlowdown: 4, observationMs: 8000, cache: 'fresh browser contexts; browser cache disabled; existing server image cache', repetitions: 3 };
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const runs = [];
  try {
    for (const profile of profiles) for (const route of routes) for (let repetition = 1; repetition <= settings.repetitions; repetition++) {
      const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height }, deviceScaleFactor: profile.deviceScaleFactor, isMobile: profile.isMobile, hasTouch: profile.hasTouch, reducedMotion: 'no-preference', serviceWorkers: 'block' });
      const page = await context.newPage();
      const cdp = await context.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: settings.latencyMs, downloadThroughput: settings.downloadBytesPerSecond, uploadThroughput: settings.uploadBytesPerSecond, connectionType: 'cellular4g' });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: settings.cpuSlowdown });
      const requests = new Map();
      cdp.on('Network.requestWillBeSent', event => requests.set(event.requestId, { url: event.request.url, type: event.type, priority: event.request.initialPriority, bytes: null }));
      cdp.on('Network.loadingFinished', event => { if (requests.has(event.requestId)) requests.get(event.requestId).bytes = event.encodedDataLength; });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.addInitScript(() => {
        window.lab = { lcp: null, shifts: [], longTasks: [] };
        const identify = node => node ? `${node.tagName.toLowerCase()}${node.id ? '#' + node.id : ''}.${typeof node.className === 'string' ? node.className.trim().split(/\s+/).slice(0, 3).join('.') : ''}` : null;
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.lab.lcp = { time: entry.startTime, size: entry.size, url: entry.url || null, element: identify(entry.element) }; }).observe({ type: 'largest-contentful-paint', buffered: true });
        new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.lab.shifts.push({ time: entry.startTime, value: entry.value, elements: (entry.sources || []).map(source => identify(source.node)) }); }).observe({ type: 'layout-shift', buffered: true });
        new PerformanceObserver(list => { for (const entry of list.getEntries()) window.lab.longTasks.push({ time: entry.startTime, duration: entry.duration }); }).observe({ type: 'longtask', buffered: true });
      });
      const response = await page.goto(`${base}${route}`, { waitUntil: 'commit', timeout: 60000 });
      assert.equal(response.status(), 200);
      await page.waitForTimeout(settings.observationMs);
      const metrics = await page.evaluate(() => {
        let max = 0, current = 0, first = 0, previous = 0;
        for (const shift of window.lab.shifts) {
          if (shift.time - previous < 1000 && shift.time - first < 5000) current += shift.value;
          else { first = shift.time; current = shift.value; }
          previous = shift.time; max = Math.max(max, current);
        }
        const navigation = performance.getEntriesByType('navigation')[0];
        return {
          lcp: window.lab.lcp, cls: max, shifts: window.lab.shifts,
          fcpMs: performance.getEntriesByName('first-contentful-paint')[0]?.startTime ?? null,
          ttfbMs: navigation.responseStart, elapsedMs: performance.now(),
          longTaskExcessMs: window.lab.longTasks.reduce((sum, task) => sum + Math.max(0, task.duration - 50), 0),
          highPriorityImages: [...document.images].filter(i => i.fetchPriority === 'high').map(i => i.currentSrc || i.src),
          fontResources: performance.getEntriesByType('resource').filter(r => /\.(woff2?|ttf)(\?|$)/.test(r.name)).map(r => r.name),
          images: [...document.images].map(i => ({ url: i.currentSrc || i.src, loading: i.loading, priority: i.fetchPriority, complete: i.complete && i.naturalWidth > 0, renderedWidth: i.getBoundingClientRect().width, top: i.getBoundingClientRect().top })),
        };
      });
      const resources = [...requests.values()];
      const run = { profile: profile.name, route, repetition, metrics, resources, transferredBytes: resources.reduce((sum, r) => sum + (r.bytes || 0), 0), pendingRequests: resources.filter(r => r.bytes === null).length, errors };
      runs.push(run);
      assert.deepEqual(errors, []);
      if (repetition === 1) await page.screenshot({ path: `${output}/${profile.name}-${route === '/' ? 'home' : route.split('/').at(-1)}.png` });
      console.log(`${profile.name} ${route} #${repetition}: LCP=${Math.round(metrics.lcp?.time ?? 0)}ms CLS=${metrics.cls.toFixed(4)} transfer=${Math.round(run.transferredBytes / 1024)}KiB pending=${run.pendingRequests}`);
      await context.close();
    }
    const summarize = values => {
      const sorted = values.filter(value => value !== null).sort((a, b) => a - b);
      return sorted.length ? { median: sorted[Math.floor(sorted.length / 2)], min: sorted[0], max: sorted.at(-1) } : null;
    };
    const summary = profiles.flatMap(profile => routes.map(route => {
      const selected = runs.filter(r => r.profile === profile.name && r.route === route);
      return { profile: profile.name, route, lcpMs: summarize(selected.map(r => r.metrics.lcp?.time ?? null)), cls: summarize(selected.map(r => r.metrics.cls)), transferredBytes: summarize(selected.map(r => r.transferredBytes)), longTaskExcessMs: summarize(selected.map(r => r.metrics.longTaskExcessMs)) };
    }));
    await fs.writeFile(`${output}/report.json`, JSON.stringify({ recordedAt: new Date().toISOString(), browser: browser.version(), settings, profiles, scope: 'Local fixed-window load lab diagnostics, not Lighthouse, real-user p75 or INP; later layout shifts/interactions and production services are unmeasured.', summary, runs }, null, 2));
    console.log(JSON.stringify(summary, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
