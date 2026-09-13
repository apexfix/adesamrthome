# Product layout and footer preview

## Scope and boundary

13 September 2026. This batch follows `2554499` on `fix/enquiry-preview-20260913`. Local preview only; no production deployment, paid resource, real email or customer message. Prices, stock facts, policy terms, the pinned installation-only listing and the removed homepage camera showcase are unchanged.

The planned durable enquiry work was inspected first: the local project has no database dependency or adapter, and only `.env.example` is present. Production environment values were not inspected. No storage provider or retention policy was invented. Durable acceptance, server idempotency and retries remain unimplemented. Independent layout items were advanced instead.

## Changes

| File | Reason |
| --- | --- |
| `src/app/products/[slug]/page.tsx` | Product heading, image and purchase section form a consistent responsive grid; visible price labels distinguish lock-only, installed package, equipment kit and installation-only options. Enquiry and SMS actions precede long descriptions. Redundant support panels are consolidated. Camera/service breadcrumbs and their schema point to the appropriate existing category/service page. Manufacturer detail images below the main content load lazily. |
| `src/components/ProductGallery.tsx` | Stable gallery and thumbnail dimensions, explicit accessible thumbnail group, responsive image sizes and high fetch priority for the initial main image. No asset removed or replaced. |
| `src/app/globals.css` | Scoped layout, column-width constraints, zero letter spacing in the product introduction, footer typography and keyboard focus. Explicit gallery width fixes WebKit shrinking an aspect-ratio box when height is capped. |
| `src/components/Footer.tsx` | Contact information appears earlier on mobile; direct service links are retained and specialist/secondary/area links use native details elements. All former destinations remain available without JavaScript. Email wraps instead of truncating. |
| `tests/product-layout-browser.cjs`, `tests/fixtures/footer-links.json` | Ten-product price/schema/prefill regression, responsive layout and keyboard interaction coverage; captured pre-change footer destinations are a committed fixture. |
| `tests/seo-content-browser.cjs` | Image visibility checks now respect viewport and scroll-container clipping, with diagnostic output on failure. |

No new client component or third-party library was added. The product page/footer remain server rendered; the gallery retains its existing selection state. Shared prices and business facts were not modified.

## Verification

- `pnpm build`: passed, 63 static pages generated; TypeScript passed.
- `pnpm lint` and `git diff --check`: passed.
- `node tests/product-layout-browser.cjs`: 100 responsive checks, ten products, Chromium and WebKit, widths 360/390/768/1024/1440. One H1, unchanged prices, Product vs Service schema, matching breadcrumb destinations, no page overflow/section overlap, full-width image frame, image selection by keyboard, correct contact service and product prefill. Every pre-change footer destination is retained; disclosure controls work by keyboard.
- `node tests/navigation-browser.cjs`: 12 combinations passed.
- `node tests/seo-content-browser.cjs`: 20 pages / 40 responsive checks passed.
- `node --test tests/enquiry.test.cjs`: 18 tests passed using mock SMTP.
- `node tests/enquiry-browser.cjs`: 22 checks passed using mocked success/failure responses.
- `node tests/photo-browser.cjs`: Chromium/WebKit pass real API rejection of invalid images, retained fields and mocked successful retry.

The first SEO image test timed out on V5 Max because it counted horizontally clipped, off-screen lazy thumbnails as visible. Diagnostics showed the visible main image and thumbnails loaded correctly. The assertion was corrected to intersect the image with both the viewport and every clipping ancestor, rather than forcing hidden images to load eagerly. The full suite then passed. Browser page errors are still failures, not suppressed.

At a 390px viewport the footer decreased from 1806px to 1444px; at 1440px it decreased from 815px to 622px, with all destination links preserved. These are layout measurements, not performance or SEO ranking claims.

## Evidence and preview

Local preview: `http://localhost:6650/`. The launcher disables SMTP credentials, so it is not an operational customer-contact deployment.

Evidence folder: `output/product-layout-verification/`:

- `before-390.png`, `before-1440.png`: prior product layout.
- `{chromium,webkit}-lockin-x9-smart-lock-{390,1440}.png`: final product layout.
- Equivalent Kaadas, installation-only and 6MP camera screenshots cover the other price models.
- `results.json`: 100 final responsive results.
- `footer-links-before.json`: captured original destinations; the reusable test fixture is tracked under `tests/fixtures/`.

Existing navigation, SEO, enquiry and photo evidence folders were refreshed by the regression runs. Real iPhone keyboard/VoiceOver, text enlargement, live email delivery, production analytics, Google validation and real-user performance have not been verified.

## Rollback

This batch is one local commit after `2554499`. Revert only that batch commit to undo its code/test/document changes; do not reset the worktree or overwrite prior preview work. Production remains at the previously recorded baseline until a separately authorized release.
