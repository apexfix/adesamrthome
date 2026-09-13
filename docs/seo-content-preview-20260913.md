# SEO content cleanup - 13 September 2026

Status: local preview only, on `fix/enquiry-preview-20260913`, following enquiry repair commit `4c02053`. No production push or deployment.

## Completed

- Removed the unverified 400+ installation count from Organization data, shared social metadata, About, Chinese metadata/body and the service-features component. Replaced visible text with service descriptions; this does not assert the original count was false.
- Removed default LimitedAvailability from lock product offers and the installed-package catalog. Unknown stock is not a limited-stock claim. Preserved the owner-confirmed 5MP kit's existing in-stock flag; did not invent a current quantity or add stock claims for other products.
- Rewrote the installer page's searcher-facing draft language into customer information: customer-supplied locks, standard A$200/A$350 fitting, X9 A$699 installed, door checks, quoting, appointments and handover. Clarified that apartment suitability requires assessment. No new emergency availability promise.
- Corrected installer-page image alt text to describe a completed installation, not a technician pictured working.
- Kept existing URLs, canonical metadata, price data, installation-only pinning, imagery and visual components. Did not restore the removed home camera feature, merge landing pages, fabricate ratings or add unconfirmed camera warranty/delivery terms.

## Evidence

- `pnpm build`, `pnpm lint`, and `git diff --check`: passed.
- `node tests/seo-content-browser.cjs`: 10 routes in Chromium and WebKit (20 page checks), each at 390px and 1440px (40 layout checks). Passed HTTP status, canonical, indexability, one H1, JSON-LD parsing, removed claims, checked prices, preserved Service type for installation-only, unknown/confirmed stock behavior, installer CTA and visible image loading. No page errors detected in these checks.
- `node --test tests/enquiry.test.cjs`: all 11 isolated tests still pass.
- `node tests/enquiry-browser.cjs`: previous enquiry suite passes after waiting for background navigation requests to settle. Earlier WebKit runs reported prefetch access-control errors when the test repeatedly navigated before requests completed. These failures are not suppressed; the test now waits for network idle before navigating. This is a test-timing change, not an application CORS change.
- Initial desktop screenshot was captured before a resized responsive image finished loading. Added explicit in-viewport image readiness checks, regenerated evidence and inspected the updated screenshots.
- Evidence: `output/seo-content-verification/results.json` and matching screenshot files. This is local validation, not Google Rich Results Test or Search Console validation.

## Source guidance

Google's [structured data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) require accurate, representative content. Its [product snippet guide](https://developers.google.com/search/docs/appearance/structured-data/product-snippet) distinguishes required fields and recommendations; missing optional information is not a reason to invent it. Consulted 13 September 2026.

## Remaining / release boundary

- Production inbox delivery, Google Search Console/GA4 reports and real-user performance remain unverified.
- Fresh stock confirmation for every model and evidence for installation counts remain business inputs, not inferred facts.
- Camera delivery/returns, tax and warranty wording remains pending the policy clarification noted in the original audit.
- No claim that all SEO is complete, rankings improved or rich results are guaranteed.
- Local preview: `http://localhost:6650/smart-lock-installer-adelaide`; same-network access: `http://192.168.50.126:6650/smart-lock-installer-adelaide`. SMTP remains disabled in this preview launcher.
- Review this batch together with the preceding enquiry repair before a separately authorized release. If later deployed and rollback is needed, revert the relevant batch commit; do not discard unrelated repository work.
