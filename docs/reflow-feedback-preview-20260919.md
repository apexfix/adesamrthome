# Text reflow, enquiry feedback and photo orientation

Local preview only. No production deployment, real customer enquiry, billing, campaign, price or warranty changes.

## Changes

- M12: service-dependent model/photo fields enter over 180ms without hiding controls, delaying interaction or resetting the shared contact/message fields. Ordinary typing does not remount the fields. The existing deliberate service-switch clearing of product/photos is unchanged.
- Accepted inline and saved receipts share a 300ms success-icon entrance. Neutral direct visits and failed deliveries have no success icon. Existing live system/manual reduced-effects rules disable both animations; forced-color CSS also disables them. No new dependency, animation loop, timer or listener was added.
- Text reflow: content inherits emergency long-word wrapping, grid children may shrink within their tracks, and breadcrumb groups can wrap. Links and buttons are bounded by their containing block. This does not hide horizontal overflow or disable text enlargement.
- Three service-page image templates no longer derive an oversized mobile width from a desktop minimum height. Images retain their existing aspect ratio and desktop minimum heights.
- Gallery selectors cap their preferred minimum width at their container width. Product-detail prices use the existing 36px mobile / 48px wider-screen hierarchy and can wrap on exceptional text enlargement. Numeric prices and their meaning are unchanged.
- Added eight-orientation photo fixtures through the actual enquiry handler with mocked mail transport. Colored corners verify rotations and reflections, not merely swapped dimensions. The resulting JPEGs must not retain EXIF, ICC, IPTC, XMP, orientation or identifying fixture markers; public attachment filenames are neutral.

## Investigation

The initial 320px / 200% root-font audit reproduced real horizontal overflow on many legacy routes. The first capture attempt exceeded WebKit's 32767px screenshot dimension limit on a very long page, so the audit now captures viewport evidence and records measured geometry rather than attempting oversized full-page PNGs. This was a test capture limit, not a website error.

After the common reflow fix, a complete 232-layout run still recorded 20 failures: fixed image minimum heights, gallery selector minimum widths and two four-digit installed prices. The corresponding templates were then corrected. Intermediate evidence is retained locally in `output/site-text-resize/intermediate-20-issues.json`; the first partial baseline is `baseline-partial.json`.

An initial keyboard-focus assertion used mouse clicks. WebKit does not necessarily focus a button on mouse click, so the test now explicitly focuses and activates with Enter to test keyboard focus preservation. No production focus behavior was changed to satisfy that assertion.

## Verification Scope

The final enlarged-text audit passed **464 layouts with zero issues**: 57 sitemap routes plus the neutral receipt page, Chrome/WebKit, 320/1440px widths and 100/200% root font. It checks responses, visible H1 count, document horizontal extent, ordinary text/control boxes escaping the viewport, and uncaught browser errors. Intentional scrolling/clipped ancestors are excluded from the text-box check and require their dedicated gallery/rail tests. This is not a full text-clipping, contrast, screen-reader or physical-device audit.

`tests/enquiry-motion-browser.cjs` passed 14 grouped flows, and `tests/enquiry.test.cjs` passed all 22 tests, including the new eight-orientation API fixture. Scoped ESLint, production build and whitespace checks passed.

Additional regressions passed:

| Check | Verified result |
| --- | --- |
| Enquiry flow | 22 checks |
| Inline receipt/storage exceptions | 24 cases |
| No-JS enquiry / blocked or delayed scripts | 44 layouts |
| Receipt hydration / early keyboard | 96 loads across eight layouts |
| Gallery URL filters / form / history / no-JS | 80 real layouts and 16 empty-state fixture layouts |
| Real product layouts | 100 checks across ten products and both engines |
| Pricing contracts and server fixtures | 65 cases |
| Mobile dock enlargement and focus | 72 layouts plus two focus fixtures |
| Hero interaction | Both engines passed |
| URL/schema/image inventory | 58 pages, 206 internal links and 123 local images, zero issues |

Final review found that the initial forced-color animation cancellation selector had lower specificity than the field entrance selector. Matching its specificity fixed this before the final checkpoint. After that isolated forced-color change, a fresh production build, all 14 feedback cases (including two Chrome forced-palette cases) and the existing 12 forced-color layout checks passed. The 464 ordinary/reduced-motion layout checks and the larger regression suite above ran before this last forced-color-only selector correction. WebKit's six forced-color layout cases emulate media rules but do not apply a native forced palette; Chrome's six do. This distinction is retained in the raw results.

Visual inspection included the normal desktop home and V5 MAX detail, and the enlarged narrow About page. Local evidence is under `output/site-text-resize`, `output/enquiry-motion` and the existing per-suite output folders; it is not production monitoring data.

Photo tests exercise server normalization and mocked attachment delivery. They do not certify every phone picker, browser preview orientation, animation preflight, antivirus scanning or low-memory behavior.

## Remaining Gates

The full 116-case integration matrix is not declared passed. Physical iPhone keyboard/safe-area checks, actual assistive technology and complete contrast/forced-color coverage remain. The previously recorded actual Next no-JS runtime-error limitation is not resolved by these changes.

Durable enquiry storage, server idempotency and distributed abuse limits still require an approved storage provider/project and access/retention/cost decisions. Actual mail delivery and analytics acceptance are separate tests. Business licensing, equipment inclusions and asset rights need verified facts. Production release remains a separate approval gate; no push or deployment is part of this batch.
