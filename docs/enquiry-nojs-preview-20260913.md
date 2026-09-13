# Unenhanced Enquiry Safety

Status: local preview only, not deployed.

The previous form relied on the client submit handler without an HTML method/action. A real no-script local browser attempt constructed a GET navigation with name, phone, suburb, email, propertyType, preferredTiming, product and message query keys. The diagnostic used nonprivate test values and intercepted/aborted that navigation before delivery.

The server-rendered form now has a disabled outer fieldset until client hydration completes. A stable useSyncExternalStore hydration snapshot follows the existing ArticleShare pattern. Disabled inputs/selects/upload/submit cannot be used for an unenhanced submission; native SMS and email links with visible contact details remain available when scripts are absent, blocked or pending. The privacy-policy link is intentionally still keyboard-accessible. Explicit POST/multipart/action attributes prevent falling back to GET should the native method be invoked; this does not claim a full no-JS form-processing flow.

Verification:
- Production build and focused ESLint passed.
- `tests/enquiry-nojs-browser.cjs`: 40 no-JS layouts (five services, four widths, Chrome/WebKit), plus blocked and delayed-script cases in both engines. Checked disabled controls, keyboard bypass, actual fallback URLs, POST method/action and no horizontal overflow. Delayed hydration enables the form and one mocked successful submission reaches the existing receipt without contact details in the URL.
- `tests/enquiry-browser.cjs`: 22 existing flow checks passed after the wrapper change.
- `tests/enquiry-dark-browser.cjs`: all 72 dark visual/layout/upload/error cases passed after the wrapper change.
- All successful POSTs intercepted locally. No customer email, external message, billing action or production release.

Limits: this guards before hydration, not arbitrary failures after the application is already interactive. The temporary contact fallback disappears when enhancement starts; its effect on contact-page layout shift has not yet been measured. Durable acceptance, replay protection, native OS handler availability and physical assistive technology remain separate verification work.
