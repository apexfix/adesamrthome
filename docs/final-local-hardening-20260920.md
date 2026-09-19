# Local hardening and service-theme completion

Date: 20 September 2026, Adelaide. Branch: `fix/enquiry-preview-20260913`.
Starting checkpoint: `96b4708`. This report describes local work only, not production acceptance or a Google ranking result.

## Changes

- Unified the remaining service, suburb, audience and Chinese landing-page surfaces with the existing black/gold theme. Kept real product-image backgrounds, existing imagery, prices, copy, service scope, URLs and metadata. Seven source files have an AST-based content-preservation check against the starting checkpoint. Chinese service sections now use unframed rows; actions have consistent small corners and header clearance.
- Corrected low-contrast secondary text on dark pages and inappropriate heading/landmark structure in the contact form. The header glass base is stronger over bright imagery. Its no-filter fallback also applies in the scrolled state.
- Added explicit current-navigation, carousel and thumbnail boundaries in forced colors. Retained manual controls and solid surfaces when browser observation/animation APIs are absent.
- Cleaned up the validation-feedback timeout when leaving the form. Route-loop checks cover observed listeners, media listeners, observer targets and that pending timeout, not arbitrary heap leaks.
- Added bounded PNG/WebP animation-header checks before browser decoding and before server normalization. Still images continue through format/dimension checks and authoritative server decoding. APNG and animated WebP are rejected; this is not antivirus or a complete hostile-file sandbox.
- Bounded the entire enquiry body to 4,000,000 bytes, including multipart overhead, while retaining the 3,500,000-byte prepared-photo policy. Streamed counting applies with missing or understated Content-Length. Malformed bodies return a recoverable validation error. Raw SMTP exception objects are no longer logged.
- Cleaned lint configuration for CommonJS tests and generated output without suppressing application rules. Added reproducible grouped regressions.

## Verified Evidence

Generated evidence remains under `output/` and is not committed with customer data or browser profiles.

| Check | Result / scope | Evidence |
| --- | --- | --- |
| Production build | Next 16.1.1/Turbopack build passed, 63 generated entries | Preview build ID `V-y1itIMpVdtxlQ0-5RNL` |
| Full repository ESLint | Zero errors/warnings after source changes; generated output excluded | `output/full-lint.json` |
| Contract regression group | 15 suites passed, including 26 actual-handler/contract cases with mocked SMTP | `output/final-regressions/contracts.json` |
| Existing/new browser regression group | 16 suites passed before the final service-only class changes | `output/final-regressions/browser.json` |
| Photo orientation/animation | 36 browser cases and two mixed-batch flows, Chrome/WebKit; no live submission | `output/photo-safety/results.json` |
| Observer fallbacks | Four browser flows with observation and animation APIs removed | `output/observer-fallback/results.json` |
| Route cleanup | Twelve route loops; no growth in tracked listeners or detached observer targets | `output/lifecycle/results.json` |
| Header text over glass | Twelve conservative black/white compositing and authored no-filter fallback cases | `output/glass-contrast/results.json` |
| Site forced colors | Eight cases, both engines and narrow/desktop layouts | `output/site-forced-colors/` |
| Automated accessibility | 232 scans, zero violations/page errors after final service changes | `output/site-accessibility/final/results.json` |
| Service content preservation | Seven sources differ only in className values | `tests/service-theme-content.cjs` |
| Service appearance | 56 cases across Chrome/WebKit, 320/1440 widths, normal/200% root font | `output/service-theme/results.json` |
| Final acceptance regression group | Five suites passed after the service-theme changes, including 22 enquiry checks | `output/final-regressions/acceptance.json` |
| Whole-site root-font reflow | 464 layouts, zero recorded issues | `output/site-text-resize/results.json` |
| Final local SEO inventory | 58 pages, 206 internal links and 123 local SEO images; zero issues | `output/site-inventory/after/report.json` |
| Homepage component-entry script bound | 36,491 bytes gzip across four deduplicated chunks | `output/client-bundle-audit/results.json` |
| Static client bundle scan | 23 JS files, no matched SMTP configuration names, nodemailer or private-key headers | `output/client-bundle-audit/results.json` |
| Local recovery rehearsal | 393 archived blobs verified and 16 old/current page checks passed | `output/rollback-verification.json` |

The first accessibility baseline had 164 failing route/engine/width combinations; an intermediate pass had 48. The final 232 scans have no automated violations, but **all still contain color-contrast items that axe cannot decide automatically**, especially imagery/transparent surfaces. Targeted glass calculations and inspected screenshots supplement, not erase, this manual-review requirement. Forced-color WebKit results emulate CSS media behavior, not a physical OS palette. Root-font enlargement is not OS/browser zoom. No WCAG certification is claimed.

The 36,491-byte budget counts the containers associated with ten homepage motion/form/control entry modules, including their shared/non-motion application code. It is a conservative container bound below the 60KB target, **not** a measurement of all first-load JavaScript or a before/after isolated motion delta. Framework/bootstrap, other routes, interaction-only imports and HTTP overhead are outside that figure. The literal secret scan cannot prove production secrets or all possible PII are absent.

Selected desktop/mobile service and Chinese-page screenshots were visually inspected. Main text is readable, navigation does not overlap headings, and the desktop bands and phone actions remain within their viewports. No new media, claims or tracking configuration were introduced.

Recovery hash verification permits only recorded CRLF-to-LF conversion for valid text when matching Git blob identities; binary assets must match byte-for-byte. The first raw-hash probe exposed Git's Windows archive text conversion and failed on `.env.example`; the revised verifier reports these conversions rather than pretending all exported bytes are identical. The isolated fallback was built with Webpack because its local dependencies are shared outside the archive directory. It returned the same key-page metadata, schemas and contact links as the current Turbopack preview. Its temporary loopback server was stopped after checking; the current preview remains on 6650.

## Current Load Lab

The final local build was measured after all other browser suites finished, with three repetitions per page/profile (18 runs). The existing protocol uses fresh contexts, disabled browser cache, 150ms latency, 200,000 bytes/s download and 4x CPU slowdown; server image cache was already warm. Results are current-build diagnostics, **not** a controlled before/after improvement claim, Lighthouse score, production measurement or INP result.

| Page | Mobile LCP median (min-max), ms | Desktop LCP median (min-max), ms | Mobile / desktop CLS median |
| --- | --- | --- | --- |
| Home | 1200 (1172-1248) | 1168 (1164-1184) | 0.001146 / 0.000408 |
| Products | 1036 (1028-1104) | 1344 (1276-1428) | 0 / 0 |
| V5 MAX | 1080 (1076-1128) | 1128 (1084-1136) | 0 / 0 |

No page errors were observed. Each eight-second observation window ended with some requests lacking a loading-finished record (one to five); these can be unfinished or failed and are not counted as zero bytes of total lifetime traffic. Existing lab limitations, including no interactions and no production cold cache, still apply. Report and inspected home screenshots: `output/performance-verification/final-local-20260920/report.json`. The older pre-local-image numbers must not be reused as current performance.

## Reproduce

Use the existing dependency runtime and the mail-disabled production preview on port 6650.

- `node tests/preview-regressions.cjs contracts`
- `node tests/preview-regressions.cjs browser`
- `node tests/preview-regressions.cjs acceptance`
- `node tests/site-accessibility-browser.cjs` with `AXE_PATH` pointing to axe-core 4.10.3; the local copy was downloaded from the npm package and its tarball SHA512 checked against registry metadata.
- `node tests/client-bundle-audit.cjs` after building.

The header preflight follows the format documentation at https://www.w3.org/TR/png-3/ and https://developers.google.com/speed/webp/docs/riff_container. Automated accessibility tooling: https://github.com/dequelabs/axe-core. No production mail, customer follow-up, billing, ad, CRM-stage, conversion-setting or deployment changes were performed.

## Release Boundary

See `release-readiness-20260920.md`. Passing local checks is not permission to publish. Durable enquiry storage/server idempotency, physical-device acceptance and the previously reproduced Next no-JS runtime-error limitation remain unresolved. Do not label the supplied 116-case integration matrix fully passed.
