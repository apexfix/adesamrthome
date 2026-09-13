# Stable enquiry loading

Local preview only, 14 September 2026. No production deployment or customer messages.

## Reproduced issue

The native SMS/email fallback was removed after hydration. In the saved 32-case baseline this reduced the form panel height and shifted its service selector, name field and submit button by up to 140 CSS pixels. The baseline is `output/enquiry-hydration/baseline/results.json`.

## Change

Keep two compact native SMS/email links above the form before and after hydration. They wrap on narrow screens, retain 48px minimum height and provide a useful direct enquiry alternative without an empty reserved spacer. Full contact details and copy controls remain in the sidebar/footer. The unenhanced fieldset remains disabled and the form retains its explicit POST/multipart action.

## Verification

- Production build and ContactForm ESLint passed.
- `tests/enquiry-hydration-layout.cjs stable-contacts`: 32 cases passed across Chrome/WebKit, widths 320/390/768/1440, lock/CCTV enquiries, with and without the quote anchor. Scripts are deliberately held until styled server-rendered content is measured, then released. Maximum measured document-coordinate movement and panel height change: 0px. Chrome recorded no layout-shift entries in the measured hydration interval. WebKit does not expose that entry type; its result is null, not a claimed zero CLS.
- `tests/enquiry-nojs-browser.cjs`: 44 cases passed. The delayed-script test now verifies that direct links remain visible and controls enable; disabled-controls and privacy safeguards remain asserted.
- `tests/enquiry-dark-browser.cjs`: 72 cases passed, including enlarged root font, dark error/disabled/upload states and mocked delivery failure.
- `tests/enquiry-browser.cjs`: 22 enquiry flow checks passed.
- Screenshots captured at 320/1440 in both engines under `output/enquiry-hydration/stable-contacts`; Chrome desktop and mobile layouts visually inspected.

This is a scoped hydration/layout result, not a whole-site CLS, performance or accessibility score. Real mobile keyboards, actual SMS/email handlers, post-hydration runtime failures, durable acceptance and production behavior remain unverified. All enquiry delivery in these browser regressions was intercepted locally.
