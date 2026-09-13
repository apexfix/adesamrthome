# Local photo previews and metadata guard

Local preview only, 14 September 2026. No customer message or upload to a public service.

## Implementation

- Added fixed 64px uncropped local previews with loading/failure states, readable filenames and 48px removal controls. Narrow containers move captions below the controls; enlarged text does not change the image box. Object URLs and listeners are released on removal, service changes and component unmount. URL creation failure leaves the file removable instead of crashing the page.
- Before giving a source to a browser decoder, check its declared MIME against parsed image type, positive dimensions, a shared 25-megapixel cap and a 20,000,000-byte original-file cap. Read at most 262,144 header bytes. Unreadable headers produce a retry/export message, not a guessed size.
- Files over 1600px on either side are now resized even below the previous 850,000-byte threshold. Processing is sequential to avoid starting four full-size decoders together. Partial successes and stale-result invalidation remain intact. JPEG conversion flattens transparency to white.
- Uses pinned, dependency-free `image-dimensions` 2.5.1 rather than a new bespoke binary parser. The package supports browser Uint8Array input and reports raw dimensions, not EXIF-applied dimensions; browser orientation is tested separately. [Primary documentation](https://github.com/sindresorhus/image-dimensions).
- The npm manifest/lock change only adds this dependency. The existing untracked pnpm lock is not included. The dimension parser is dynamically imported on photo selection; the final built parser chunk is 3,818 bytes uncompressed. This is not a claim about the total application JavaScript delta.

## Verification

- Baseline preview test failed because selected files had no thumbnail. Final `tests/photo-preview-browser.cjs`: four grouped Chrome/WebKit flows at 320/1440px passed. Covers EXIF rotation, four previews, contain layout, 100/200% text, removal/reselection, exact active URL counts, no decoding URL for a small-file 25MP-over-limit image, scaling a 3200x2000 small transparent PNG, white output pixels, URL creation failure and recovery, service cleanup and actual client-navigation unmount. Parser requests are absent before file selection and present afterwards.
- Actual existing installation imagery was also displayed in the test; narrow normal and actual-photo screenshots were visually inspected. Test fixtures do not publish any customer upload.
- `tests/photo-metadata.cjs`: 14 checks passed for allowed image types, MIME mismatch, 25MP exact/over limits, empty/corrupt/unsupported input, 20MB boundary, bounded reads and read failures.
- Real local API still rejects a truncated image with a valid dimension header. Updated `tests/photo-browser.cjs` verifies the visible failed preview, preserved form values, removal and a mocked retry in both engines. This demonstrates that metadata checks are not full content validation.
- Existing photo-batch flows (four), total-size flows (six), API/contract tests (21), enquiry flows (22), and dark-form cases (72) passed during the batch. Final preview/metadata/batch/API-browser checks, production build and scoped ESLint passed after the final URL-failure/import-failure/white-background refinements; the broader enquiry/dark-form suites ran before those three refinements.
- Final sitemap inventory: 57 sitemap URLs plus receipt, 206 internal links and 123 local SEO images, no issues. Diff whitespace checks passed.

Evidence folders: `output/photo-preview/after`, `output/photo-batch/after`, `output/photo-total`, `output/photo-verification`, `output/enquiry-verification`, `output/enquiry-dark`, `output/site-inventory/after`.

## Remaining boundaries

Header metadata is not authoritative decoding or an antivirus check. Browser animation preflight, malicious multi-frame memory behavior, native camera pickers, physical low-memory devices and all EXIF orientations remain unverified. A JPEG whose dimension marker is beyond the bounded header read may be rejected and require re-export. Server content, animation, pixel and normalized-byte checks remain independent. The new raw-file cap is a client resource policy, not a product/business claim. No full attachment security, whole-site performance or final package completion is claimed.
