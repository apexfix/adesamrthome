(async () => {
  const assert = require('node:assert/strict');
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const site = 'https://www.adesmarthome.com.au';
  const browser = await chromium.launch({ channel: 'chrome' });
  try {
    const page = await browser.newPage();
    const sitemap = await page.request.get(`${base}/sitemap.xml`);
    assert.equal(sitemap.status(), 200);
    const entries = await page.evaluate(xml => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.querySelector('parsererror')) throw new Error('Invalid sitemap');
      return [...doc.getElementsByTagName('url')].map(node => ({
        url: node.getElementsByTagName('loc')[0].textContent,
        date: node.getElementsByTagName('lastmod')[0]?.textContent,
        images: [...node.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')].map(image => image.textContent),
      }));
    }, await sitemap.text());
    const home = entries.find(entry => entry.url === `${site}/`);
    assert.equal(home.images.length, 3);
    const homeHtml = await (await page.request.get(base)).text();
    for (const image of home.images) {
      assert.ok(homeHtml.includes(new URL(image).pathname), `Image absent from homepage: ${image}`);
      assert.equal((await page.request.head(base + new URL(image).pathname)).status(), 200);
    }
    for (const route of ['/', '/products', '/gallery', '/contact']) {
      assert.equal(entries.find(entry => entry.url === site + route).date, '2026-09-25');
    }
    assert.ok(!entries.flatMap(entry => entry.images).some(image => image.includes('hero1-optimized')));
    assert.ok(entries.filter(entry => entry.url.includes('/smart-lock-installation/')).every(entry => entry.images.length === 0));
    for (const query of ['', '?service=installation-only']) {
      const response = await page.request.get(`${base}/contact${query}`);
      assert.equal(response.status(), 200);
      const metadata = await page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return { title: doc.title, canonical: doc.querySelector('link[rel="canonical"]')?.href, robots: doc.querySelector('meta[name="robots"]')?.content };
      }, await response.text());
      assert.equal(metadata.title, 'Smart Lock Installation Quote Adelaide | ADE Smart Home');
      assert.equal(metadata.canonical, `${site}/contact`);
      assert.equal(metadata.robots?.includes('noindex') || false, Boolean(query));
    }
    console.log(JSON.stringify({ base, sitemapImages: 'passed', dates: 'passed', contactMetadata: 'passed', submittedEnquiries: 0 }));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
