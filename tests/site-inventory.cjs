(async () => {
  const { default: assert } = await import('node:assert/strict');
  const fs = await import('node:fs/promises');
  const { chromium } = await import('file:///C:/Users/Linton/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs');
  const base = process.env.PREVIEW_URL || 'http://localhost:6650';
  const site = 'https://www.adesmarthome.com.au';
  const recordOnly = process.argv.includes('--record-only');
  const out = `output/site-inventory/${recordOnly ? 'before' : 'after'}`;
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome' });
  const issues = [], pages = [], assets = [], links = [];
  const sameSite = value => new URL(value, site).origin === site;
  const local = value => {
    const u = new URL(value, site);
    assert.equal(u.origin, site);
    return base + u.pathname + u.search;
  };
  const normalize = value => new URL(value, site).href.replace(/\/$/, '');
  const check = (condition, type, url, detail) => { if (!condition) issues.push({ type, url, detail }); };
  try {
    const parser = await browser.newPage();
    const robotsResponse = await parser.request.get(base + '/robots.txt');
    const robots = await robotsResponse.text();
    check(robotsResponse.status() === 200, 'robots-status', '/robots.txt', robotsResponse.status());
    check(/^Allow: \/\s*$/m.test(robots) && !/^Disallow: \/\s*$/m.test(robots), 'robots-blocks-site', '/robots.txt');
    check(robots.includes(`Sitemap: ${site}/sitemap.xml`), 'robots-sitemap', '/robots.txt');
    const response = await parser.request.get(base + '/sitemap.xml');
    assert.equal(response.status(), 200);
    const sitemap = await parser.evaluate(xml => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      if (doc.querySelector('parsererror')) throw new Error('Malformed sitemap XML');
      return [...doc.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'url')].map(n => ({
        url: n.getElementsByTagNameNS('http://www.sitemaps.org/schemas/sitemap/0.9', 'loc')[0].textContent,
        images: [...n.getElementsByTagNameNS('http://www.google.com/schemas/sitemap-image/1.1', 'loc')].map(n => n.textContent),
      }));
    }, await response.text());
    check(new Set(sitemap.map(n => n.url)).size === sitemap.length, 'duplicate-sitemap-url', '/sitemap.xml');
    const assetUrls = new Set(sitemap.flatMap(n => n.images));
    const urls = [...sitemap.map(n => n.url), site + '/contact/thank-you'];
    for (const url of urls) {
      const res = await parser.request.get(local(url), { maxRedirects: 0 });
      const data = await parser.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const meta = key => doc.querySelector(`meta[name="${key}"],meta[property="${key}"]`)?.getAttribute('content');
        const schema = [], errors = [];
        for (const n of doc.querySelectorAll('script[type="application/ld+json"]')) {
          try { schema.push(JSON.parse(n.textContent)); } catch (e) { errors.push(e.message); }
        }
        const nodes = [];
        function walk(value) {
          if (Array.isArray(value)) value.forEach(walk);
          else if (value && typeof value === 'object') {
            if (value['@type']) nodes.push(value);
            Object.values(value).forEach(walk);
          }
        }
        schema.forEach(walk);
        return {
          title: doc.title, description: meta('description'), robots: meta('robots'),
          canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          ogTitle: meta('og:title'), ogDescription: meta('og:description'), ogUrl: meta('og:url'), ogImage: meta('og:image'),
          twitterTitle: meta('twitter:title'), twitterDescription: meta('twitter:description'),
          h1: [...doc.querySelectorAll('h1')].map(n => n.textContent),
          ids: [...doc.querySelectorAll('[id]')].map(n => n.id),
          anchors: [...doc.querySelectorAll('a[href]')].map(n => n.getAttribute('href')),
          schemaTypes: nodes.map(n => n['@type']),
          products: nodes.filter(n => n['@type'] === 'Product'), errors,
        };
      }, await res.text());
      check(res.status() === 200, 'page-status', url, res.status());
      check(data.h1.length === 1, 'h1-count', url, data.h1.length);
      check(Boolean(data.title && data.description), 'missing-page-metadata', url);
      check(data.errors.length === 0, 'invalid-json-ld', url, data.errors);
      const receipt = url.endsWith('/contact/thank-you');
      if (receipt) check(data.robots?.includes('noindex'), 'receipt-must-be-noindex', url);
      else {
        check(!data.robots?.includes('noindex'), 'indexed-page-noindex', url);
        check(normalize(data.canonical || '/') === normalize(url), 'canonical-mismatch', url, data.canonical);
        check(Boolean(data.ogTitle && data.ogDescription && data.ogImage), 'missing-social-metadata', url);
        check(normalize(data.ogUrl || '/') === normalize(url), 'og-url-mismatch', url, data.ogUrl);
      }
      for (const p of data.products) {
        check(Boolean(p.name && (p.offers || p.review || p.aggregateRating)), 'incomplete-product', url, p.name);
        check(url.includes('/products/') && !url.endsWith('/security-camera-kits') && !url.endsWith('/smart-lock-installation-only-service'), 'product-on-non-product-page', url, p.name);
      }
      const productPath = new URL(url).pathname;
      const detailProduct = /^\/products\/[^/]+$/.test(productPath)
        && !productPath.endsWith('/security-camera-kits')
        && !productPath.endsWith('/smart-lock-installation-only-service');
      check(data.products.length === (detailProduct ? 1 : 0), 'product-entity-count', url, data.products.length);
      if (data.ogImage && sameSite(data.ogImage)) assetUrls.add(new URL(data.ogImage, site).href);
      pages.push({ url, status: res.status(), ...data });
    }
    const byUrl = new Map(pages.map(p => [normalize(p.url), p]));
    const checked = new Set();
    for (const page of pages) for (const href of page.anchors) {
      if (!href || !/^(https?:|\/|#|\?)/.test(href)) continue;
      const target = new URL(href, page.url);
      if (target.origin !== site || target.pathname.startsWith('/api/')) continue;
      const key = target.href;
      if (checked.has(key)) continue;
      checked.add(key);
      const known = byUrl.get(normalize(site + target.pathname));
      if (known && !target.search) {
        if (target.hash) {
          const hash = decodeURIComponent(target.hash.slice(1));
          check(known.ids.includes(hash), 'missing-fragment', page.url, key);
        }
        links.push({ url: key, status: known.status });
      } else {
        const res = await parser.request.get(local(key));
        links.push({ url: key, status: res.status() });
        check(res.status() === 200, 'internal-link-status', page.url, { target: key, status: res.status() });
      }
    }
    for (const url of assetUrls) {
      if (!sameSite(url)) continue;
      const res = await parser.request.head(local(url));
      const type = res.headers()['content-type'];
      assets.push({ url, status: res.status(), type });
      check(res.status() === 200 && type?.startsWith('image/'), 'seo-image-unavailable', url, { status: res.status(), type });
    }
    for (const field of ['title', 'description']) {
      const groups = new Map();
      for (const p of pages.filter(p => !p.robots?.includes('noindex'))) {
        const value = p[field];
        groups.set(value, [...(groups.get(value) || []), p.url]);
      }
      for (const [value, urls] of groups) check(urls.length === 1, `duplicate-${field}`, urls, value);
    }
    const report = { generatedAt: new Date().toISOString(), base, robots, sitemapPages: sitemap.length, pages, links, assets, issues };
    await fs.writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
    console.log(JSON.stringify({ sitemapPages: sitemap.length, checkedPages: pages.length, internalLinks: links.length, localImages: assets.length, issues }, null, 2));
    if (!recordOnly) assert.equal(issues.length, 0, `See ${out}/report.json`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
