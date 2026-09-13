# Photo batch recovery preview

Local preview only, 14 September 2026. No real enquiry or email sent.

## Reproduced issue and change

Selecting one supported photo and one unsupported HEIC file discarded the supported photo because the batch used fail-fast aggregation. The new browser test failed against that behavior.

The form now waits for every selected file to settle, retains successful files in selection order, and explains individual failures. Existing attachments remain. Long filenames are shortened in failure text and may wrap; original successful attachment names are unchanged. Analytics receives only failure counts and a fixed reason, never filenames. Removal is disabled during preparation so count reporting uses a stable selection. Service changes and unmount invalidate pending results; the existing object URL cleanup still runs when processing finishes.

## Evidence

- `tests/photo-batch-browser.cjs`: four grouped flows passed (Chrome/WebKit, 320/1440px). Includes mixed batch retention, accepted-only mocked payloads, failed large-image URL cleanup, removal/reselection, excess-count rejection preserving existing files, mixed delayed compression plus immediate rejection, disabled submission/removal until processing settles, and ignoring pending results after switching to CCTV and back.
- Long failure-name geometry tested at 200% root font. Normal and enlarged screenshots saved under `output/photo-batch/after`; narrow normal rendering visually inspected. These checks are not whole-page zoom or physical mobile acceptance.
- Test network isolation was corrected from hostname matching to origin matching: WebKit can expose local blob requests to interception. The earlier test-only rejection of those blobs was not an app decoding defect.
- Existing `tests/photo-browser.cjs` passed in both engines: real local API rejects a corrupt small image, preserves input, and supports removal followed by a mocked retry.
- Existing `tests/enquiry-browser.cjs` passed 22 checks. These two regressions ran before the final filename-display-only refinement; the final batch suite, production build and scoped ESLint passed after it.

## Boundaries

This is client batch recovery, not a complete attachment pipeline replacement. Small images still receive authoritative content validation on the server, HEIC conversion is not supported, and total prepared-byte/pixel edge cases need separate client-side coverage. Durable acceptance, server idempotency, abuse protection, physical phone photo pickers and successful production mail delivery remain unverified.
