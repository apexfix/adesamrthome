# Enquiry delivery states and deadline

Local preview only, 14 September 2026. No deployment or real enquiry was sent.

## Reproduced and changed

- Baseline pending requests had no deadline. The new browser regression first failed because no bounded timeout existed.
- A 30-second AbortController deadline covers fetch and response parsing. Unmount clears the timer and aborts the request; stale continuations cannot update the form or navigate.
- Known offline state stops before a POST. HTTP 413 and 429 have useful messages even for HTML responses. Other known client errors retain a bounded server validation message.
- Timeouts, network errors, 408/5xx and malformed success bodies are explicitly unconfirmed delivery, not a claim that nothing arrived. The user is advised to check by SMS/email before sending another copy. No automatic retry is performed.
- Success requires success=true and a bounded opaque string reference before receipt storage, completion events or navigation. Internal 5xx diagnostics are not displayed.
- Failure retains fields and prepared photos. Pending duplicate submit events remain guarded.
- Sending/uncertain labels share reserved grid geometry. Testing caught a narrow 200%-text sizing defect in the first implementation; a bounded grid track and fixed-pixel horizontal padding/gap fixed it without shrinking text.

## Final evidence

- `tests/enquiry-delivery.cjs`: 20 response-contract checks passed.
- `tests/enquiry-delivery-browser.cjs`: eight grouped flows passed, Chrome/WebKit x 320/1440px x 100/200% root font. Covers deadline, pending duplicate prevention, seven failure modes, input/photo retention, no false receipt, offline no-request, unchanged submit dimensions and unmount abort/timer cleanup.
- Deadline tests invoke the captured 30,000ms callback, rather than waiting 30 real seconds. Local fetch mocks isolate delivery; not production network timing evidence.
- `tests/enquiry-browser.cjs`: 22 existing success/error checks passed.
- `tests/enquiry.test.cjs`: 21 API/contract checks passed with isolated email behavior.
- `tests/contact-errors-browser.cjs`: four affected-field/error-separation flows passed.
- `tests/enquiry-dark-browser.cjs`: 72 layouts/state checks passed; screenshots regenerated and Chrome failure screenshot inspected. Element captures may include fixed-header overlays from screenshot scrolling; geometry checks are separate.
- Production build and scoped ESLint passed.
- Evidence: `output/enquiry-delivery/results.json`, `output/enquiry-dark/`, `output/enquiry-verification/results.json`.

## Limits

Browser abort cannot recall an email already sent or reliably stop server processing. Manual retries can still duplicate enquiries. Durable acceptance, server idempotency, distributed rate limiting and approved retention/access configuration remain open. Uncertain state is not persisted across navigation/reload. This does not certify production delivery, physical-device accessibility or full-site acceptance.
