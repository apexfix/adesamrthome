# Release readiness and remaining decisions

## Release Authorization Update, 25 September

The owner explicitly approved publishing the current changes and sending one test enquiry. This supersedes the release/test-mail permission statements below, which describe the earlier preview-only stage. Email-only scope remains in force. See `production-release-20260925.md` for actual release evidence and remaining verification limits; approval alone is not a successful deployment or inbox-delivery result.

This is a release gate, not a declaration that the 116 integration cases are complete. Local styling, interaction and validation work can be reviewed at `http://localhost:6650`. Production has not been changed.

## Owner Decision: Email-only Enquiries, 20 September

The owner confirmed that enquiries only need to arrive by email. The current release does not require a database, CRM, durable outbox, automatic mail retries or cross-instance request deduplication. These features are excluded by scope, not implemented or passed. This decision supersedes earlier storage-related release blockers and does not authorize deployment or a real test enquiry.

The existing handler already sends operator email. Preserve validated request/photo limits, SMTP recipient acceptance checks, the browser's duplicate-submit guard and explicit uncertain-delivery recovery. SMTP acceptance does not prove inbox receipt. A lost response can follow a successful send; do not automatically resend or claim exactly-once delivery. The current-tab receipt is only a local reference, not a stored lead record.

## Required Before Final Sign-off

| Gate | What remains | Why it cannot be marked complete |
| --- | --- | --- |
| Abuse safeguards | Review deployed request limits and any existing platform rate-limit/challenge protection without adding paid infrastructure or changing account settings without approval | Local validation and button guards are verified; distributed abuse protection is not. Email-only scope does not establish a shared rate limit. |
| Ambiguous email delivery | Retain tested failure/uncertainty feedback and SMS/email fallback; verify recovery during the approved mail check | The UI cannot guarantee that a manual retry never duplicates mail. Durable acceptance and automatic retry jobs are outside this release scope. |
| Production release and mail | Explicit release approval and permission for a clearly labelled operator-only enquiry test; verify actual receipt | Existing credentials and local mocked mail are not evidence of production delivery. No customer mail is authorized by this report. |
| Production analytics | Verify accepted production events, consent/automatic collection behavior and downstream deduplication in the owner's GA4/Meta/Ads setup | No live account access/verification in this batch. A mock event is not a lead; key events and linked conversions require owner approval. |
| Native devices and accessibility | iPhone/Android keyboards, safe areas, OS zoom, screen readers, native clipboard/share handlers and remaining image/transparent-text contrast checks | Browser emulation and axe do not cover these fully. |
| Runtime failures with JavaScript disabled | Select and test a framework/hosting-level fallback that can survive actual route/root rendering failures | The existing Next fixture fails before visible no-JS recovery HTML; normal-page noscript links and isolated component tests do not fix that. Do not hide the failure or substitute a false pass. |
| Business and media facts | Confirm licensing scope with the relevant authority, model-specific specifications, publication rights/privacy and unresolved CCTV inclusions/policies | Do not infer authorization, installation/cabling/disk inclusion, stock, warranty, delivery or tax terms from a design package. |
| Live performance and search | Production cold-cache checks, real-user p75/INP and Search Console review after an approved release | Local lab measurements and valid metadata cannot guarantee field performance, indexing or rankings. |

The database/CRM question is resolved by the owner's email-only decision. Release and real test-mail permission remain separate; do not repeatedly ask for the same approval or treat this scope decision or silence as release approval.

## Matrix Disposition

| Original group | Local evidence | Remaining acceptance boundary |
| --- | --- | --- |
| NAV 01-10 | Navigation, query-aware current state, focus/Escape, missing APIs, links and enlarged text have scoped browser evidence | Native assistive technology and owner-approved language mapping/content |
| HERO 01-14 | Timing, manual override, visibility/pause, reduced effects, failures, small datasets and local layouts | Physical touch/reading experience and final visual sign-off |
| FORM 01-24 | Five services, 5/4 optional enums, contact rules, service drafts, errors, receipt handling and normalized tracking have contract/browser evidence | Actual inbox delivery and live tracking; durable deduplication is excluded by owner scope, and Chinese form extension is conditional/off, not a translated-form pass |
| PHOTO 01-14 | Shared count/size/pixel rules, header validation, format failures, previews, all EXIF orientations and partial-batch recovery | Physical phone pickers, low-memory devices and adversarial-resource testing |
| PRODUCT 01-12 | Price semantics, fixtures, filters, empty/invalid results, gallery and image-failure evidence | Stock/model/variant facts; optional search/compare are off, not unfinished core features |
| CCTV 01-06 | Equipment-only routing and removal of unverified planning/advice copy | Exact model documentation, inclusions, rights and licensing facts |
| MOBILE 01-08 | Narrow/desktop/tablet and root-font reflow tests; dock/header cases | Real soft keyboard, safe areas and OS/browser zoom |
| ACCESS 01-08 | Keyboard/fallback tests, forced colors, no-filter bound, 232 automated scans | Screen-reader/native review and automatically undecidable contrast |
| SEO 01-10 | Local HTML, canonical/schema, images, links, missing-page status and sitemap checks | Production crawl/index status, factual metadata and final language correspondence review |
| OPS 01-10 | Build/lint, scoped lab baseline, entry-chunk budget, tracked lifecycle cleanup and source/client audits | Deployed abuse safeguards, rights, physical/live verification, release approval and hosting cache/rollback behavior |

Conditional features in OPT-032 through OPT-045 remain off unless separately approved. Do not build payments, booking, new languages, chat, comparison tools or paid services merely to make the checklist longer. Prohibited effects and invented marketing claims remain excluded.

Continued local work after this gate was written is recorded in `continued-completion-20260920.md`: actual API acknowledgements now share the five-service browser receipt copy, all optional-field combinations have handler tests, mail recipient acceptance is checked, and responsive category/service selection feedback is implemented. These fixes do not replace the real-delivery, native-device or release gates above. Healthy-page no-JS tests do not resolve the separate actual server-failure no-JS limitation.

## Recovery Procedure

1. Keep the current preview checkpoint and its static assets together. This batch changes no database schema, product IDs, public URLs, service enum values or receipt-storage key.
2. The preceding checkpoint `96b4708` was exported to `output/rollback-96b4708.zip`, extracted into its own folder and clean-built using Webpack with existing local dependencies. This is an isolated local fallback build, not a hosting deployment snapshot and not a clean dependency reinstall.
3. On an approved production rollback, restore the matching code **and** static assets as one deployment. Keep the currently approved server secrets and contact destination in server configuration; never embed them in the archive or browser code.
4. Browser JS assets are hashed. Existing `/img` responses may cache for seven days and optimized images for at least one day. Changed image content at unchanged URLs needs an approved cache purge or versioned asset path; a code-only revert cannot invalidate every CDN/browser cache. Do not delete the active deployment's assets while clients may still reference them.
5. After any approved switch, verify home, catalogue, V5, X9, CCTV, installation-only, enquiry and receipt routes; check canonical/schema/contact values and image responses, then perform only the explicitly authorized operator test. Preserve real records and do not replay customer enquiries.

The local replay report is `output/rollback-verification.json` when its dedicated test has passed. A successful local replay does not waive any release gate above.
