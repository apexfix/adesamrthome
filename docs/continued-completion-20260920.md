# Continued completion: enquiries and selection controls

Local preview only. This follows checkpoint `660a406` after the owner asked that independent remaining work continue rather than stopping at a release gate. No production deployment, real enquiry, customer message, paid service or account change was made.

## Actual gaps corrected

- The browser receipt already distinguished five services, but the actual API acknowledgement still used only camera-versus-lock copy. The API now reuses the browser receipt's five service-specific descriptions, keeping installation-only, property/project and recommendation enquiries distinct. The shared business phone and website are used in the receipt.
- Property and timing options were independently duplicated in the browser and API. Both now consume the same definitions, including the optional empty value. The displayed labels and submitted values are unchanged.
- A mail call returning without an accepted recipient could previously report success. Operator acceptance is now checked before a success response or customer receipt. A failed/rejected customer receipt leaves the already-accepted operator enquiry successful but reports `acknowledgementSent: false`. Acceptance by SMTP is not proof of inbox delivery or durable storage.
- SMTP connection/greeting inactivity limits are 10 seconds and socket inactivity is 15 seconds. These are not a global request deadline or a retry queue; uncertain-delivery handling remains necessary.
- Catalogue categories and service choices now share a measured, decorative 220ms moving outline. Their existing static selection remains visible and semantically marked. The outline cannot intercept input; resize/font changes remeasure it and observers are disconnected. Missing ResizeObserver or scripts retain static controls. Reduced effects remove animation and forced colors hide the decoration.
- Visual inspection found that two-column service buttons were technically within bounds but unreadable with enlarged text. A rem-aware grid now becomes one column when space is insufficient and remains at most two columns otherwise. The final option spans the row.
- Disabled service controls retain their selected color while loading/submitting and without scripts; selection is not dependent on the animated outline.

## Evidence

- New acknowledgement tests first failed against the two-branch implementation. New rejected-recipient tests also failed before the acceptance checks.
- All 32 API/contract tests now pass with mocked mail only. These include all five service receipts in text/HTML, 150 service/property/timing combinations, unknown optional values, all five phone-only paths and rejected acknowledgement behavior. Existing image, body-bound, escaping and private-log tests pass.
- All 15 contract suites pass.
- Production-mode local build passes with 63 generated route entries. Current preview build ID: `qDvcQlpbN5g6PuXMuKr3Y`. Full ESLint and diff whitespace checks pass.
- `selection-indicator-browser.cjs`: 40 cases pass across Chrome/WebKit, 320/1440px, 100/200% root fonts and normal/reduced/no-observer/no-JS/forced-colors modes. Cases exercise real category links, all service selections, a synthetic long label, responsive resizing, exact indicator bounds and full-width narrow rows. No page errors or horizontal overflow were recorded. WebKit forced colors is CSS media emulation, not a native OS palette test.
- A test harness hang was caused by stylesheet injection with JavaScript disabled. Direct root-style evaluation fixed the harness. The no-JS subset and complete 40-case suite subsequently passed. This tests healthy pages, not server-failure fallback.
- `output/selection-verification/enlarged-services.png` was visually inspected. It is a component-only synthetic long-label fixture; the fixed header/dock are hidden only for that screenshot, not for the preceding layout assertions or normal website.
- All six scoped follow-up suites passed on `X-irRGBJIBCtQ-CyCqxhH`: lifecycle cleanup, enquiry submission, form feedback, receipt hydration, mobile dock (72 cases) and SEO inventory (58 pages, 206 links, 123 local image URLs, no issues). The only application change after that run was preserving disabled service-button colors. The final build then passed the complete 40-case selection suite again, including explicit static-color assertions, and all 22 enquiry browser checks. Results: `output/final-regressions/followup.json`, `output/selection-verification/report.json` and `output/enquiry-verification/results.json`.

## Still not completed

Subsequent owner decision, 20 September: email delivery is sufficient. A database, CRM, durable outbox and cross-instance idempotency are excluded from the current release, not implemented or passed. The existing handler already uses email; retain uncertainty recovery and do not promise exactly-once delivery or inbox receipt from SMTP acceptance alone. Deployed abuse safeguards still need review. Release and real test-mail permission remain separate, as recorded in `release-readiness-20260920.md`; no production provider or project was invented.

The actual Next 16.1.1 server-error response without JavaScript remains unresolved. Source inspection of installed `getErrorRSCPayload` in `node_modules/next/dist/server/app-render/app-render.js` shows the production `__next_error__` seed has an empty body, while the custom global error component is supplied separately for the client router. Editing the visible component alone cannot make that seed contain native recovery links. No vendor patch, false HTTP 200, production-only proxy assumption or synthetic pass was introduced. The earlier failing no-JS runtime fixture remains a failure; it was not rerun or relabelled by this session's healthy-page checks.

Real delivery, native-device/assistive-technology checks, live tracking/search performance, unresolved business/media facts and explicit release authorization remain separate gates. Earlier measurements belong to their recorded builds; the 18-run performance lab was not rerun for this follow-up. The complete 116-case matrix is not fully passed.
