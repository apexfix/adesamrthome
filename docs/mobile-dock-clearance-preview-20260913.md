# Native mobile contact clearance

Scoped implementation of the mobile fixed-contact/keyboard requirements in the adopted design document. Local preview only.

## Fix

The prior V5 test reproduced a real no-JavaScript edge case: nearest-edge browser scrolling placed the product enquiry link beneath the fixed contact dock. Manually centring the link worked, but was not a fix.

The root scroller now reserves 104px at the top and `6rem + max(10px, env(safe-area-inset-bottom))` at the bottom, only below 768px and only on pages containing the contact dock. Native scroll-into-view and anchor navigation can therefore account for the fixed surfaces without hydration. The bottom clearance scales with the root font size; it is a CSS allowance, not a measured assertion of physical keyboard geometry.

A separate CSS focus rule hides the dock while a focus-visible control in `main` or the site footer is active. It deliberately excludes the dock's own links so keyboard focus is not hidden. Existing JS primary-CTA visibility, form-exit delay, menu/lightbox exclusions, contact-page omission and safe-area positioning remain unchanged. No new script, dependencies, product content or prices.

## Evidence

- `node tests/mobile-dock-clearance.cjs`: 72 native scroll-and-unforced-click cases, four representative product/service types x three widths (360/390/430) x three modes (normal, JavaScript disabled, root font 200%) x Chromium/WebKit. Each link clears the fixed header, is reachable at its centre by hit testing and navigates to the correct prefilled enquiry URL without sending a message.
- The same suite has 18 focus layouts. It establishes keyboard modality, focuses the main enquiry link, uses actual Tab to the next main control, checks footer focus, then checks that the dock remains visible when its own link receives focus.
- `node tests/v5-local-images.cjs`: all 76 existing checks pass after removing the manual centre-scroll workaround. This includes the original no-JS navigation scenario with an ordinary direct click.
- `node tests/mobile-dock-browser.cjs`: six existing combinations pass, including primary CTA visibility, dock focus retention and form-exit navigation.
- `node tests/hero-browser.cjs`: 54 layout combinations pass; no reported overflow or missing next-section hint in its existing normal-font matrix.
- Production build and `git diff --check` pass.

Generated reports/screenshots are in `output/mobile-dock-clearance/`, `output/v5-local-images/` and `output/hero-verification/`. The 390px Chromium no-JS enquiry screenshot and large-root-font enquiry screenshot were visually inspected. None of these are physical-device or screen-reader certification.

## Remaining Issue Found

The large-root-font screenshot exposes an independent header issue: at 390px, the brand text can overflow and displace the menu control. The current test checks the enquiry target's clearance, not all header typography, and must not be interpreted as whole-page 200% text acceptance. Fix the responsive header and add explicit bounds/menu-reachability tests next.

Real iPhone soft keyboard, safe-area hardware, physical assistive technology, browser text-only zoom, older browsers without CSS `:has` and complete document acceptance remain open. Production has not been changed.
