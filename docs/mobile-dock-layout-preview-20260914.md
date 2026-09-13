# Mobile contact dock: reflow and native focus

Local preview only, 14 September 2026. No deployment or messages sent.

## Evidence and changes

- The 72-layout baseline reproduced overflowing controls in all 48 enlarged-font cases. The email target was 44px, so none of the 72 cases met the full 48px target-and-containment check. Baseline geometry is saved under `output/mobile-dock-layout/before`.
- Constrained grid tracks, fixed outer spacing/icon sizes, wrapping labels and a 48px email target keep all three destinations within the dock. The form action now uses the short visible label `Get quote`; its contextual accessible name and existing destination retain the camera/door-photo distinction. SMS uses an accessible name containing its visible `Text us` label.
- Native `:focus-within` now prevents primary-CTA/form flags from hiding a focused dock. Removed the redundant React focus-state mirror. Menu/lightbox/error-page exclusions remain higher-priority hiding conditions. Two explicitly synthetic stale-flag fixtures failed before and pass after; these fixtures test the guard, not the exact timing of the previous intermittent failure.
- A ResizeObserver keeps native-scroll clearance and the bottom spacer aligned with the visible dock height. Hidden states retain the last measured height. Without scripts, a font-relative fallback remains; all tested no-JS layouts had enough clearance.

## Verification

- Production build and MobileContactBar ESLint passed on final source.
- `tests/mobile-dock-layout.cjs`: 72 final cases pass in Chrome/WebKit, widths 320/360/390/430, normal/200% root font/200% no-JS, on home, V5 and CCTV routes. 430px cases use a shorter 480px viewport. All controls fit their dock, meet 48px targets and have sufficient bottom space; accessible names contain visible labels. Both stale-flag focus fixtures pass. Normal and enlarged Chrome screenshots visually inspected.
- `tests/mobile-dock-clearance.cjs`: 72 real product/native-scroll/click checks and 18 focus layouts passed without weakening the prior focused-link assertion.
- `tests/mobile-dock-browser.cjs`: six home primary-CTA, dock focus, form focus and enquiry-navigation combinations passed.
- `tests/visual-effects-browser.cjs`: 24 combinations passed.
- The latter three regressions ran immediately before the final SMS accessible-name/aria-hidden-only refinement; the final 72-case layout/name suite and build ran afterwards. No layout or behavior edits followed those regressions.

The first baseline runner was stopped after an independent probe proved that requestAnimationFrame did not fire in its no-JS browser context. The runner now skips animation-frame waits in that mode and uses synchronous geometry reads; its corrected baseline completed before rebuilding the app. That was a test waiting bug, not a reported site defect.

## Limits

The earlier normal-page intermittent focus failure's exact event ordering was not reproduced. The native guard, real focus regressions and controlled stale flags provide scoped evidence, not proof against every race. Physical keyboards, iOS visual viewport/safe area, VoiceOver/TalkBack, OS text scaling and whole-site performance/CLS remain unverified. Preserve the broader design/release checklist.
