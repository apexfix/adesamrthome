# Shared photo limits preview

Local preview only, 14 September 2026. No external enquiry or email.

## Issue and implementation

The client previously enabled submission with four prepared 900,000-byte photos, while the API correctly rejected the 3,600,000-byte total. A browser regression reproduced the enabled button before the change.

Added a small browser-safe shared metadata policy used by the form and API: at most four files, JPEG/PNG/WebP, positive integer bytes, at most 1,000,000 bytes each and 3,500,000 combined. The image decoder also imports the shared individual byte cap; its pixel/animation/content validation and normalized-output check remain in place.

The form keeps the attachments visible, shows the combined-limit error before sending, disables submission and independently guards the submit handler. Removing an attachment recomputes the limit and restores submission. The four-photo success message is suppressed while invalid. Prepared size limits are stated beside the upload control. Server validation remains authoritative; the metadata helper does not certify that a file is a valid image.

## Verification

- `tests/photo-total-browser.cjs`: six cases passed in Chrome/WebKit at 320px. Mocked compression output totals of 3,600,000 and 3,500,001 are blocked, 3,500,000 is allowed, removal recovers, direct submit events are guarded, and captured payloads exclude removed files. Compression byte sizes and submission are mocked; this is not a browser encoder/content-validation test.
- `tests/enquiry.test.cjs`: 20 tests passed. New shared-policy edge checks cover exact/over limits, count, invalid numbers, empty files and unsupported type. Actual API handlers with real sharp decoding and padded valid JPEG inputs accept the exact individual/total cap and reject one extra byte before any mocked mail. Existing metadata stripping, animation, malformed-content, pixel and mail-failure regressions pass.
- Four photo-batch browser flows, two invalid-photo/API retry flows, 22 enquiry flow checks and 72 dark-form layout/state cases passed against the final build.
- Final production build, scoped ESLint and whitespace checks passed. Site inventory: 57 sitemap pages plus receipt, 206 internal links and 123 local SEO images, no issues.

Evidence: `output/photo-total`, `output/photo-batch/after`, `output/photo-verification`, `output/enquiry-verification`, `output/enquiry-dark` and `output/site-inventory/after`.

## Remaining boundaries

Client decoded-pixel/memory coverage, physical phone compression/picker behavior and the complete photo matrix remain open. Small-file byte decoding is still performed by the server. This does not implement durable enquiry storage, server idempotency or distributed abuse controls. No deployment or production mail test was performed.
