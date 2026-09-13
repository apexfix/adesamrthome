# Contact validation accessibility preview

Local preview only, 14 September 2026. No real enquiry or email.

## Change

The browser baseline reproduced missing programmatic error associations on both contact fields. Source inspection also showed all custom contact errors focusing Mobile, including email-only errors that pass the browser's less restrictive domain check.

- Shared validation now returns affected fields and a message; the existing string API remains available to the server. Validation criteria are unchanged. When both populated values are invalid the message identifies both rather than reporting only Mobile.
- Mobile and Email reference the visible contact requirement and, after a failed attempt, the relevant error. The contact error sits immediately after the contact rows, separate from delivery errors. Correcting the data updates the explanation and removes obsolete invalid states.
- Custom validation focuses the relevant field after the error has rendered. Native email invalid events expose the associated explanation without replacing browser focus behavior. Switching service clears the attempted-validation state.
- React-generated IDs keep descriptions and errors unique per form instance. No customer input is interpolated into error messages.

## Evidence

- `tests/contact-errors-browser.cjs`: four grouped flows passed across Chrome/WebKit and 320/1440px. Tests missing-pair associations, correct focus for mobile and email, correction without submission, both-invalid native email capture, 200% root-font wrapping and delivery-error separation. No request is made until valid; the final request is intercepted locally.
- `tests/enquiry.test.cjs`: 21 tests passed, including field identification, unchanged valid/invalid contact decisions, privacy and existing photo/API behavior with mocked mail.
- Existing enquiry flow: 22 checks passed. Delayed hydration: 32 layouts measured 0px panel shift and height change. This is not whole-site CLS.
- Production build, scoped ESLint and whitespace checks passed. Narrow enlarged error screenshot visually inspected; evidence is in `output/contact-errors/after`.

## Limits

This verifies DOM associations and browser focus, not physical screen-reader announcements or every native validity rule. Required name/suburb still use native constraint validation. Full ACCESS-03, localization, OS keyboard, assistive technology and final whole-site acceptance remain open. No release authorization is implied.
