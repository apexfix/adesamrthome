# Product card resilience preview

Scope: chapter 13 card states and the matching chapter 14 product detail presentation. Local preview only; no production deployment or catalogue price/stock record changes.

## Changes

- Product and installation-listing photos use the existing shared image component. Missing/failed images have a readable fallback while the product title and detail link remain available. Card links do not contain retry buttons or other nested interactive controls.
- Square product image frames retain uncropped, contained images. Sale and installation/equipment scope labels now live below the photo instead of overlaying it.
- Stock is interpreted strictly: explicit true is In stock, explicit false is Out of stock, and an absent value makes no inventory assertion. Service listings do not interpret inventory booleans. Product detail Offer availability uses the same decision. Unknown detail availability has neutral text, not a green stock indication.
- Existing discounts, valid fractional prices and quote-required behavior are retained. The only current catalogue item with an explicit stock value remains the A$443 Dahua 5MP kit.
- Missing detail photos now reach the gallery's empty state without requesting a nonexistent placeholder image.
- An adversarial long product name exposed overflow in the detail page's lower heading. That heading now wraps without widening the page.

## Evidence

- `pnpm build`: passed, including TypeScript and 63 generated pages.
- Focused ESLint and `git diff --check`: passed.
- `node tests/product-pricing.cjs`: 65 cases, 16 actual server-template fixtures, all 10 current catalogue prices unchanged. Added explicit true/false/unknown inventory, service inventory exclusion, missing image and long-title fixtures; matching visible stock/schema assertions.
- `node tests/product-pricing-browser.cjs`: 128 detail pricing layouts and 32 narrow card layouts in Chrome/WebKit. Fixtures are actual server markup inserted under built CSS; they are not a claim of hydrated fixture interaction coverage.
- `node tests/product-card-browser.cjs`: 24 real catalogue layouts at 320/390/768/1440px, Chrome/WebKit, normal/failed images/no JavaScript. Tests preserve square frames, labels below photos, readable card text, detail navigation after image failure, explicit stock only, and absence of nested buttons/page overflow/runtime exceptions.
- `node tests/catalogue-browser.cjs`: 112 layouts and navigation/history/reset/invalid-URL checks passed.
- `node tests/product-layout-browser.cjs`: 100 real-product layouts across all 10 products and both engines passed on the final build.
- `node tests/content-motion-navigation.cjs`: two cross-engine navigation checks passed.
- `node tests/site-inventory.cjs`: 58 pages, 200 internal links and 105 local SEO image URLs, no reported issues.
- Visual inspection: `output/product-card-verification/x9-mobile.png` and `desktop-viewport.png`; full-page normal/error/no-JS screenshots are in the same folder. Prices, scope text and full lock imagery remain visible.

## Remaining boundaries

No discontinued lifecycle field currently exists in Product data. Do not label false inventory as discontinued or invent a stopped-sale record; chapter 13's distinct discontinued state remains to be modeled and verified if introduced. Explicitly out-of-stock products remain enquiry-based, with no availability date or restock promise. Loading/error recovery without client JavaScript retains native image behavior and readable server content, not a scripted retry UI. Physical-device accessibility, image rights/privacy review, full-package acceptance and deployment remain open.
