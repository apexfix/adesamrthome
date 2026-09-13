# Dark Enquiry Form

Status: local preview only. Implements the visual migration in OPT-010, not complete enquiry reliability or whole-site acceptance.

The former light glass form is now a solid charcoal tool surface with a dark native control scheme, gold selected services and primary submit button, readable field borders, explicit keyboard focus, and semantic dark error/success panels. All five service values and existing submission/validation logic are retained. Upload, four-file status, removal (48px target), preparation/disabled states and retry feedback use the same palette. Labels are sentence case with consistent input spacing. Chrome autofill has dark inset fill and white text; forced-colour mode restores system text handling.

The obsolete light-glass class and its white reduced-effects fallbacks were removed (no other consumers). The root canvas defaults to black under both light and dark OS colour schemes. The enquiry layout has minmax tracks and shrinkable contact links to fix a reproduced 390px/200% root-font horizontal overflow.

Evidence:
- Production build and focused ESLint passed.
- `tests/enquiry-dark-browser.cjs`: 70 layouts (five services, both Chrome/WebKit, normal 320/390/768/1440, plus no-JS/reduced/root-font-200% at390) and two upload/pending/error cases. Computed text contrast >=4.5, control boundary contrast >=3, no page overflow, 48px service targets and visible field focus. Mocked network failure retains inputs; invalid upload retains the other three files. Chrome forced autofill pseudo-state verified, not a real user's saved autofill.
- `tests/enquiry-browser.cjs`: 22 checks including service switching, minimal contacts, failure/retry, malformed response and mocked receipt tracking.
- `tests/enquiry.test.cjs`: 18 unit/API tests using mock SMTP.
- `tests/photo-browser.cjs`: two engine cases for invalid photo rejection and mocked successful retry.
- Existing visual-effects (24 combinations) and dock-clearance (72 route/18 focus) checks passed before the final minmax track/8px label-spacing refinements. Do not treat those older runs as full final-code evidence.
- Screenshots in `output/enquiry-dark/`; 320px and desktop form captures visually inspected. Element captures may include the fixed header after automatic screenshot scrolling; they are not proof that the whole form fits one viewport.

Newly reproduced next issue: with site scripts disabled, the existing HTML form defaults to GET and constructs a URL containing name/contact fields. Local diagnostic intercepted and aborted that navigation before delivery. This is not fixed by the colour migration. Add a safe unenhanced/pending-script state and verify contact fallbacks separately.

Limits: no real email sent, no production release, no physical device/keyboard/autofill accessibility certification. Durable acceptance, idempotency and conversion reliability remain separate work.
