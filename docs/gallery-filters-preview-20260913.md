# Gallery filters and navigation preview

Chapter 16 scoped implementation, 13 September 2026. Local-only. Existing six project records and image sources are unchanged.

## Behavior

- Gallery selection is server-rendered from `model` and `suburb` URL parameters. A native GET form applies changes, matching the catalogue's explicit Apply workflow. Selected options, counts and photos survive refresh, shared URLs and browser history.
- Model and area options come exclusively from existing project fields. The six current entries all have Adelaide as their area, so an unfiltered visit does not show a redundant area selector. A selected area remains visible; a future source with multiple actual areas exposes those options. No new brand or suburb facts were added.
- Clear filters returns to all six records. The form is keyed to applied filters so client-side reset/navigation cannot leave an old uncontrolled select value visible.
- Valid known combinations with zero matches render an empty result and reset link. A wholly empty source has a distinct photos-unavailable message. Invalid/repeated/unknown filter parameters invoke notFound with noindex metadata; source failures are not converted into empty results.
- Filtered metadata is noindex/follow and canonicalizes to `/gallery`; the base gallery retains its existing metadata. ImageGallery markup reflects exactly the visible photos and safely omits a primary image when empty. Social fallback metadata no longer dereferences an absent first entry.
- Only the interactive results grid needs client code. Cards retain the full photo and product/enquiry links, and adopt the existing progressive entrance/feedback/text-glass styling. Lightbox state is scoped to the selected set.
- Photo controls are real public image links with a progressive lightbox click handler. With no JavaScript they open the image normally; modifier clicks retain native link behavior. Ordinary enhanced clicks still support zoom, next/previous, Escape and focus restoration.

## Evidence

- Production build and TypeScript passed. `/gallery` now renders dynamically to serve its query selections. No production release was performed.
- Focused ESLint and `git diff --check` passed.
- `node tests/gallery-filters.cjs`: 13 real/invalid filter cases; exact data-derived options, filtered schema, gallery-page SSR output, valid empty combination, absent source, and source-error propagation. Fictional area names exist only in isolated test fixtures, never in the catalogue.
- `node tests/gallery-filters-browser.cjs`: 80 real layouts across Chrome/WebKit, JS on/off, five selections and 320/390/768/1440px. Covers selected values, counts, matching image schema, canonical/noindex metadata, readable Apply text, form submission, reload, new-tab direct URL, back/reset, product navigation and no-JS full photo navigation. Also 16 static server-fixture empty-state layouts; these are not real production empty-area records.
- `node tests/gallery-controls-browser.cjs`: all 30 lightbox/control checks passed with the new Apply workflow and photo links, including filtered image counts, zoom, next image, Escape and focus/scroll recovery.
- Invalid model, repeated model and unknown suburb requests returned HTTP 404 in direct local HTTP checks, not just an empty-looking page.
- `node tests/seo-content-browser.cjs`: 40 checks across 20 pages passed.
- `node tests/site-inventory.cjs`: 58 pages, 206 internal links and 105 SEO images; no reported issues. The six additional links are public full-image destinations.
- Desktop/mobile screenshot inspection found insufficient Apply-button text contrast; explicit white text and a browser assertion were added, rebuilt and retested. Final screenshots: `output/gallery-filter-verification/chrome-390-viewport.png` and `chrome-1440-viewport.png`.

## Remaining boundaries

No real multi-area or multi-brand catalogue was invented to populate filters. Additional filter dimensions should be enabled only from verified project data. No customer photo publication permissions, location accuracy or image privacy review is proven by this code change. Native device/assistive-technology checks, performance evidence, remaining document chapters and production release remain open. Existing homepage slide choices, installation-service pin, prices and contact information are unchanged.
