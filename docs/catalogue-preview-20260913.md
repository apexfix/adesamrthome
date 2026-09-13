# Catalogue grouping and filters

Local preview implementation of the core chapter 13 catalogue requirements. The full document goal remains active. Nothing was deployed and no prices, stock, warranties, installation coverage or catalogue records were changed.

## Implemented

- Installation-only service stays first in the default catalogue, now in an independent horizontal section rather than a lock card. It retains the actual service detail link, supplied-lock explanation and the A$200/A$350 options from the shared price formatter. Existing installation imagery is reused without editing or cropping.
- Physical products are grouped into seven Smart Locks and two Security Camera Kits. Group headings, result counts and default collection JSON-LD follow the same visible order. The homepage carousel is untouched: V5 MAX, X9, A$443 Dahua kit.
- Category links and an explicitly applied native brand selector use existing `category`/`brand` URL parameters. Brand/category names are resolved from real catalogue taxonomy and brand attributes. Legacy brand categories match an existing brand exactly; features and partial name fragments are no longer accepted as brands.
- The Smart Locks category now contains physical locks only. Installation service has its own category and remains accessible from the smart-lock quote link. This deliberately replaces the former mixed lock/service filter results.
- Known category plus known brand with zero matching listings gives a 200 empty state and clear/reset/contact links. Unknown categories, unknown brands and repeated filter parameters invoke the existing not-found handling with noindex/nofollow. Real source failures are not converted into a no-stock message.
- Valid filtered views retain noindex/follow and the canonical catalogue URL. Only the unfiltered view publishes the full collection ItemList. All public product links remain in server-rendered HTML.
- The brand form works without JavaScript. Category changes retain the applied brand. Refresh, copied URLs, browser back and clear filters recover their expected selections.
- Mobile installation content is compact; secondary brand guides sit after the listings. The native select uses a dark color scheme, explicit appearance and a decorative lucide arrow to prevent WebKit white-on-white rendering. It remains a native labelled select.
- Catalogue product-detail and guide links do not prefetch unrelated pages. Other ProductCard consumers preserve their existing prefetch behavior. An intermittent WebKit RSC prefetch/access-control diagnostic during navigation was observed before this adjustment; final catalogue runs reported no page errors. This is not proof about every older Safari version or network condition.

## Verification

- `pnpm build`: successful, 63 generated pages.
- Focused ESLint and `git diff --check`: passed.
- `node tests/catalogue.cjs`: 15 valid selections, eight invalid query cases, real brand provenance, visible grouping/order, metadata policy, empty source data and thrown source failure.
- `node tests/catalogue-browser.cjs`: 112 layout checks across seven views, 360/390/768/1440px, Chrome/WebKit and JavaScript on/off. Also exercises native GET submission, category/brand combinations, reload, back, clear, installation detail navigation, invalid URLs, image loading and JSON-LD ordering. Final run has no page errors.
- Default collection: one installation service first, seven physical locks, two CCTV packages, ten results. Smart-lock filter: seven products; Lockin: six; Kaadas: one; CCTV: two.
- `node tests/content-motion-navigation.cjs`: two browser regressions passed. Updated its former first-card assertion to verify the installation section/detail link remains first; the user-facing ordering requirement is unchanged.
- `node tests/navigation-motion-browser.cjs`: 12 groups passed.
- `node tests/seo-content-browser.cjs`: 40 checks over 20 pages passed.
- `node tests/site-inventory.cjs`: 58 pages, 200 internal links, 105 local SEO images; no issues.
- Visual evidence: `output/catalogue-verification` contains full-page and viewport screenshots, browser event records and a layout report. Mobile screenshots were inspected after the final select styling correction.

## Remaining boundaries

Optional search, price sorting, comparison and pagination were not introduced for this ten-listing catalogue. Price sorting cannot safely mix equipment, installed and installation-only amounts. New discontinued/stock-status semantics, a full bad-image card treatment, complete catalogue indicator motion, real-device assistive-technology tests and package-wide acceptance remain separate work. No new asset rights or policy assertions were made. Durable enquiries, abuse protection, other unfinished design surfaces and performance measurement remain on the main checklist.
