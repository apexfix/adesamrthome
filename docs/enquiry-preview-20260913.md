# Enquiry repair preview - 13 September 2026

Status: implemented and locally verified; NOT published.
Branch: `fix/enquiry-preview-20260913`; production baseline: `4b8d045`.

## Completed checklist items

- Share the valid service definitions between form and API, including CCTV equipment enquiries.
- Clear product selection and door photos when changing service; invalidate unfinished photo preparation. Reject camera requests containing door photos on the server as well.
- Require name, suburb and at least one valid contact method. Property type and timing are optional. A supplied but invalid secondary contact method is rejected.
- Separate CCTV equipment and smart-lock acknowledgement emails and success pages. Remove unverified response-time promises from those receipts.
- Require an explicit successful API response and lead reference before the success page. Retain form input after failure and allow retry. Block simultaneous duplicate submit clicks.
- Fix the homepage camera link without restoring the removed large camera showcase. Remove the camera installation implication from the service pathway.
- Normalize product names to fixed identifiers before analytics; drop named personal fields from event parameters. Strip query/hash from explicit page-location analytics and the new attribution landing path.
- Improve service selector legibility, use 16px form inputs, consolidate repeated photo instructions, and remove the duplicate fixed mobile contact bar on the enquiry form page.
- Preserve product prices, installation-only pinning, existing URLs, metadata strategy and black/gold styling.

## Verification

- `pnpm lint`: passed.
- `pnpm build`: passed, 63 generated pages.
- `node --test tests/enquiry.test.cjs`: 11 tests passed. SMTP is an in-memory mock, including equipment receipts, mobile-only enquiries, validation, attachment limits and delivery failure.
- `node tests/enquiry-browser.cjs`: passed in Chromium and WebKit. Twenty layout combinations: two services, five widths (360/390/430/768/1440), two engines. Both engines additionally passed service switching, email-only and mobile-only submission, no-contact validation, failed-delivery retry, malformed-success rejection, receipt routing, refresh deduplication and mocked analytics checks.
- No horizontal overflow, clipped selector labels or page errors detected in that matrix. Input font size was 16px and selector targets at least 44px high.
- WebKit translation-mutation regression: home to products to contact, then switch camera/lock; no browser errors.
- Desktop and mobile preview screenshots inspected. Evidence: `output/enquiry-verification/results.json` and screenshots in the same folder.

All browser enquiry requests were intercepted. External analytics requests were blocked and gtag was a local recorder. This build has no configured Google tag, so live GA configuration/delivery was NOT verified. No real customer enquiries or emails were sent.

## Preview and release boundary

Local preview: `http://localhost:6650/contact`.
Same-network mobile preview: `http://192.168.50.126:6650/contact` (host must be running; not an Internet URL).
The preview launcher explicitly empties SMTP credentials. Manual preview submissions cannot deliver email; the success flow was tested with intercepted responses.

No push, merge, Vercel deployment, DNS change, new paid service or production mail configuration change was performed. Release requires a separately authorized production deployment and a controlled operator test of actual receipt delivery.

## Still open

- Durable enquiry storage, request-level idempotency, delivery retries and application anti-spam controls need a separate storage/privacy design. Button-level duplicate prevention is not server idempotency.
- File-type validation still checks declared MIME/size, not decoded image content.
- Real inbox delivery, GA4/Meta reporting, enhanced measurement settings and real-user performance are not verified. Storage/script failure can still lose browser-side conversion events.
- Real iPhone keyboard, VoiceOver/TalkBack and system text scaling are not covered by the desktop browser matrix.
- Stock claims, installation-count evidence, wider SEO copy/schema cleanup and CCTV commercial-policy wording remain on the earlier audit checklist. No rankings or conversion improvement is claimed from these tests.

## Rollback

The production site is unchanged. Keep this branch independent until approved. If these changes are later merged, revert this batch's commit rather than resetting the repository or discarding unrelated work. Existing untracked output, ad assets and lockfile were not included.
