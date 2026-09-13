# Catalogue price precision

Local preview implementation of chapter 14's integer-minor-unit, fractional-price and missing-price requirements. No catalogue prices, tax treatment, currency, installation inclusions or inventory were changed. Not deployed.

## Changes

- Product cards and detail pages now share the same validated amount formatter. Brand package comparisons, the CCTV comparison table and the retained (unused) HomeCameraFeature use it too. The removed home camera feature remains unmounted.
- Integer minor units are split without floating-point division or rounding. Whole-dollar prices stay compact; nonzero fractions retain their declared precision, including trailing fractional zeros. An explicit minor unit of zero is respected; an absent unit defaults to two.
- Accepted data is a positive safe integer encoded as at most 16 decimal digits, with a declared minor unit from zero to six. Malformed strings, negative values, unsafe integers, invalid precision, blank or absent values and zero return no price. This site's catalogue does not define a free-product offer; zero must not silently advertise a free product.
- Missing prices show `Quote Required`. Product JSON-LD omits the priced offer when no valid base price exists. Installation service options retain their names and descriptions but omit unknown prices rather than emit zero/null. Metadata uses an enquiry fallback.
- Discount indicators require a valid regular amount strictly above the valid current amount. A higher current price is not a discount.
- A missing optional installation package no longer changes a lock-only item into an installation-included item in the detail label or schema.
- Unknown-price text is sized separately from numeric prices so it remains readable in narrow layouts. Price values and the existing installation/equipment scopes remain distinct.

## Evidence

- `pnpm build`: successful production build, 63 generated pages.
- Focused ESLint and `git diff --check`: passed.
- `node tests/product-pricing.cjs`: 60 cases, comprising parser/discount cases, 11 actual server-template fixtures and all 10 existing catalogue values. Fixtures cover fractional, zero-minor-unit, three-minor-unit, missing, zero, malformed, separately priced installation, service and CCTV cases. Assertions compare card/detail output, metadata and JSON-LD.
- `node tests/product-pricing-browser.cjs`: 88 Chrome/WebKit price-panel layouts at 360/390/768/1440px plus 22 narrow-card checks. Uses actual server-template fixture markup and built CSS, with unrelated client gallery/story leaves stubbed; it is not an end-to-end test of the gallery. Screenshots inspected for fractional and unknown-price states.
- `node tests/product-layout-browser.cjs`: 100 checks of the real 10 catalogue pages in Chrome/WebKit at five widths, including current amounts, schema, enquiry prefill, image loading and layout.
- `node tests/site-inventory.cjs`: 58 pages, 198 internal links and 105 local SEO images; no issues.
- `node tests/seo-content-browser.cjs`: 40 responsive checks across 20 pages passed.
- Reports and screenshots: `output/product-pricing-verification`, `output/product-layout-verification` and the existing site inventory output.

## Scope limits

This does not establish foreign-currency catalogue support, GST policy, changes to authored promotional copy or image prices, new free-product semantics, checkout totals, live Google rich-result acceptance, physical-phone accessibility or production correctness. The full design/SEO goal remains open. Durable enquiry storage, anti-spam, remaining motion/surface work, performance and the package-wide acceptance audit are still tracked in the main checklist.
