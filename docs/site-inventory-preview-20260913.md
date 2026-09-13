# Whole-site inventory preview

13 September 2026. Baseline for this batch: `4f296ed`, branch `fix/enquiry-preview-20260913`.

## Findings and changes

The root layout emitted a generic `Product` named "Dahua Security Camera Kits Adelaide" on every page, including service, article and receipt pages. It described a category without a specific product offer. `src/app/layout.tsx` now represents that category as an `OfferCatalog` pointing to the existing camera collection. Concrete camera products retain their detail-page `Product` offers.

The supply-and-installation overview reused product entity IDs for six installed packages. In particular, a lock-only product price and its installed package could share the same `#product` identity across pages. `src/app/smart-lock-supply-installation-adelaide/page.tsx` now identifies these as supply-and-installation `Service` entities with separate `#installation-package` IDs. Visible descriptions, package prices, images, warranty text and product links are unchanged.

The intent is to distinguish categories, services and products, not to invent reviews or fill optional fields with unsupported facts. Google's [product snippet guidance](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) describes product-specific markup requirements; [Schema.org OfferCatalog](https://schema.org/OfferCatalog) describes a catalogue of related offers or subcatalogues. This local correction does not prove that any historical Search Console warning has cleared.

## Reusable audit

`tests/site-inventory.cjs` reads actual local HTTP responses, parses sitemap XML and HTML using browser DOM parsers, and recursively inspects all JSON-LD, including nested entities in the root layout. It does not submit forms, execute uploaded package scripts or use real customer data.

The script checks HTTP status, single H1, title/description presence and uniqueness, canonical/OG URL consistency, receipt noindex, JSON-LD parsing, placement/completeness/count of Product entities, known internal fragment targets, other internal links and same-site sitemap/OG image responses. It also checks the current robots response and sitemap declaration. This is a focused project regression audit, not a complete Schema.org or Google validator.

## Results

- `pnpm build`: passed, TypeScript passed and 63 static pages generated.
- `pnpm lint`: passed.
- `node tests/site-inventory.cjs`: passed; 57 sitemap pages plus one receipt page, 198 unique internal links, 105 local SEO image URLs, no issues under the implemented checks.
- Nine concrete product detail pages each retain exactly one Product entity; the installation-only detail retains its Service markup.
- `node tests/seo-content-browser.cjs`: passed, 20 pages and 40 responsive checks across Chromium/WebKit.
- Baseline and final raw inventories: `output/site-inventory/before/report.json` and `output/site-inventory/after/report.json`.

The baseline recorded 58 instances of the same incomplete category Product, plus 55 non-product-page occurrences including six overview packages. These are repeated findings from two shared modeling choices, not 113 distinct business or SEO defects. The final assertion also guards against accidentally removing all detail Product entities.

## Boundaries and rollback

No visible redesign, price change, new redirect, payment change, API/mail change, production push or deployment occurred. The locally running preview remains at `http://localhost:6650/` with SMTP disabled. The live Search Console account, Google rendering, external-image availability, real-user performance and production inbox were not verified.

This batch also records intake of the newly supplied black/gold package, without executing its scripts or substituting its sample site for the application. Revert only this batch commit to restore the two schema changes and its audit/document additions; retain earlier preview commits and unrelated assets. No data migration or environment change is required to roll back.
