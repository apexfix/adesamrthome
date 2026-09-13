# Enquiry photo validation - 13 September 2026

Status: preview only on `fix/enquiry-preview-20260913`, following `406399e`. No deployment or real email sent.

## Changes

- `src/lib/enquiryPhotos.ts`: decode JPEG/PNG/WebP with sharp rather than trusting MIME or extension. Require matching detected format; reject empty, corrupt, oversized or multi-frame input. Input limits: 1 MB and 25 million pixels. Use strict decode warnings and a five-second processing timeout.
- Normalize accepted images to JPEG, max 1600px on either side, retaining aspect ratio without enlarging small images. Apply EXIF orientation before removing metadata; use white behind transparency. Do not forward original filenames, original bytes, EXIF or trailing payloads. Output limit is 1 MB per attachment.
- `src/app/api/contact/route.ts`: prepare attachments sequentially, reject an invalid photo with HTTP 400 and its numbered explanation, and attempt no email until every photo passes. Preserve the existing four-photo and 3.5 MB combined limits; check normalized combined bytes too. Empty uploads are no longer silently discarded.
- `package.json`: explicitly depend on sharp 0.34.5, the version already present through Next's optional dependencies. No paid service or model/image-generation service involved.
- `package-lock.json`: synchronized with the manifest. The existing lock also lacked already-declared gray-matter/react-markdown dependency trees; npm filled those entries. A comparison confirmed no pre-existing package version changed. The prior untracked pnpm lock was updated by installation but is not added to this commit.
- Tests use actual sharp decoding and mocked SMTP, not a mock image validator.

## Verification

- Build and lint passed. The generated API deployment trace includes sharp and native libraries. A Windows build is not a Linux deployment test; production build validation remains part of release.
- 18 API/helper tests passed. Normal JPEG/PNG/WebP, corrupt/truncated bytes, empty input, MIME mismatch, SVG disguised as PNG, oversized decoded dimensions, animated WebP, orientation, metadata removal, trailing bytes, resizing, transparency and mixed valid/invalid attachments are covered.
- Real local API rejected a synthetic invalid image in Chromium and WebKit with HTTP 400. Inputs remained populated, the photo could be removed, and a mocked success retry reached the receipt page. No real SMTP was used; the preview launcher keeps SMTP credentials empty.
- The existing full enquiry browser regression was rerun. Results: `output/enquiry-verification/results.json`.
- Raw API results: `output/photo-verification/api-tests.txt`. Browser evidence: `output/photo-verification/results.json`.
- UI state screenshots: `chromium-invalid-390.png`, `webkit-invalid-390.png`, and matching `*-retry-390.png` in the same folder. Error-state mobile screenshot inspected. These compare failure/recovery states, not a visual redesign.

## Limits and remaining work

This validates and normalizes images; it is not antivirus scanning or a guarantee against every decoder vulnerability. The pixel/timeout controls do not replace a total request-body limit, distributed request throttling or infrastructure protections. Keep native dependencies maintained.

Metadata removal applies to normalized email attachments. It does not alter files on the customer's device, hide details visible in the photograph, or remove metadata from the original upload while in transit to the API.

Durable enquiry storage, server idempotency, retry queues, anti-spam controls and actual production inbox delivery remain open. No permanent customer data store was introduced. Camera equipment enquiries continue to reject door-photo attachments.

Library reference: [sharp constructor safety options](https://sharp.pixelplumbing.com/api-constructor/) and [output/metadata behavior](https://sharp.pixelplumbing.com/api-output/), consulted 13 September 2026.

## Preview and rollback

Preview: `http://localhost:6650/contact`. The server runs locally with SMTP disabled. Invalid-photo checks use the real API; successful delivery tests use an in-memory mail receiver.

Keep this as a separate commit. Revert the batch and restore dependencies from the corresponding lockfile if it must be rolled back; do not hard-reset unrelated work. This branch has not been pushed to main or deployed.
