# V5 MAX self-hosted gallery

Local preview implementation for chapter 24's external-image dependency boundary and descriptive image alternatives. No deployment or product-term changes.

## Changes

- Inspected `v5MaxImages` in `src/lib/localProducts.ts`: it contains 18 remote images, not 13. The previous eight-second performance capture observed only 13 requests; that was not the full source inventory.
- Downloaded all 18 existing source files, fully decoded each using sharp and preserved the exact bytes. No crop, retouch, new generated imagery, metadata rewriting or re-encoding. Total originals: 5,835,484 bytes, dimensions from 713 x 713 to 1400 x 1400, with mixed portrait/landscape sources. Responsive delivery still uses the existing Next image optimizer; browsers do not need to download every original.
- Store under `public/img/products/lockin-v5-max/gallery/` with a positional name and 12-character SHA-256 prefix. Full SHA-256, source URL, dimensions, format, byte size and retrieval time are recorded in `docs/assets/v5-max-gallery-provenance.json`.
- Preserve all 18 positions, image IDs, product price A$1,350, product copy, enquiry parameters and installation photographs. Replace the repeated generic alternative text with 18 distinct descriptions based on visual inspection. Marketing diagrams remain described as diagrams/illustrations, not installation evidence.
- The existing source-image claims, certifications, licensing and model-specific specifications have not been independently certified by this migration. No new licensing rights are asserted. Asset authorization/factual review remains a separate release concern.

## Verification

`node tests/v5-local-images.cjs` passed:

- 18 original hashes, byte counts, dimensions, ordered source mappings and stable IDs; 18 distinct alternative texts.
- Exact-byte HTTP delivery for each local original and successful decoding of all 18 optimized 750px responses.
- 72 actual gallery checks: 18 images at 390px and 1440px in Chromium/WebKit. Each thumbnail selects the expected local main image, preserves `object-fit: contain`, exposes its descriptive alternative and opens at the matching lightbox position. No external image URL, including a remote source inside the Next image proxy, was requested by these pages.
- Four additional cases: JavaScript disabled and all V5 gallery images failing, in each engine. The normal enquiry link still navigates with the product prefilled, and the Open Graph image uses the local first image. No form submission or customer mail.
- The no-JS test initially failed when Playwright's nearest-edge auto-scroll placed the quote link behind the fixed mobile dock. The revised test scrolls the link to the viewport centre and uses an ordinary, unforced click. This proves the link is usable after scrolling, not that no-JS auto-scroll/focus avoidance is complete. That shared dock edge case is retained in the ledger.

Final production build and focused ESLint passed. Final URL/schema inventory: 58 pages, 206 internal links, 123 local SEO image URLs, no reported issues. SEO content suite: 20 pages / 40 responsive checks passed. All 18 sources were visually reviewed using three browser-rendered contact sheets. Gallery screenshots are in `output/v5-local-images/`; results are in `results.json` in that directory. Generated evidence is not committed.

The tests establish local asset delivery and the tested failure/navigation behavior. They do not simulate a production server's outbound network outage, establish a new speed score, prove rights to artwork or complete the full document's acceptance requirements. Real-user performance and production release remain open.

Follow-up: `mobile-dock-clearance-preview-20260913.md` records the CSS fix for the no-JS scroll obstruction. The centre-scroll workaround was removed from this test, and all 76 checks passed again with ordinary direct clicking.
