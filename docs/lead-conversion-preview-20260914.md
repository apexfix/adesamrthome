# Accepted-reference conversion guard

Local preview only, 14 September 2026. No external analytics or real enquiries sent.

## Reproduction and scope

The original tracker consumed any nonempty browser record without checking leadId. A regression seeded `{}` and observed three tracker calls where none were expected. Missing, malformed, array and invalid-reference records are now consumed without generating a conversion.

The form response validator and tracker share the same bounded opaque-reference predicate. The tracker independently normalizes service and product to known identifiers and accepts photo counts only as integers from zero through four. Unknown free text is not passed into tracker payloads. Removal happens before tracking as before; storage read/removal failure skips events rather than risking repeated consumption.

This is a client context guard, not authenticated proof of server acceptance. Someone controlling browser storage can forge a syntactically valid reference. Cross-tab/cross-device/server idempotency, durable accepted records, consent timing and analytics delivery configuration remain separate work. Removing context before dispatch can miss conversion events when analytics is unavailable; this batch does not introduce event retries.

## Verification

- `tests/lead-conversion.cjs`: 23 checks, including absent/malformed references, storage failures, all five services, replay prevention, normalized identifiers and invalid count values.
- `tests/lead-conversion-browser.cjs`: eight grouped Chrome/WebKit cases covering direct visits, missing references, malformed context and valid context. Valid context produces one GA lead and one Meta lead call; refresh produces neither. External requests blocked and calls intercepted locally. Output: `output/lead-conversion/results.json`.
- `tests/enquiry-delivery.cjs`: 20 response contracts passed after sharing the reference predicate.
- `tests/enquiry-browser.cjs`: 22 enquiry regressions passed against the rebuilt production preview.
- Production build, scoped ESLint and diff checks passed.

The thank-you page still has unconditional confirmation copy for direct visits, and the form still lacks an inline confirmed receipt for unavailable session storage. Those presentation/fallback requirements remain open; this batch only fixes conversion context validation.
