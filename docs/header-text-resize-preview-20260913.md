# Header Text Enlargement

Status: scoped local preview, not deployed.

The brand could overflow a narrow header at a doubled root font size and displace the menu trigger. It now wraps inside a shrinkable text area while the original logo and 48px menu trigger keep fixed dimensions. The menu uses available viewport height, retains uncompressed rows and scrolls internally. The homepage reserves the expanded header height when scrolling contracts the header padding; ResizeObserver updates the allowance after content size or viewport changes. A root-font-aware CSS allowance remains when scripts or ResizeObserver are unavailable.

Verification:
- Production build and focused ESLint passed.
- `tests/header-text-resize.cjs`: 56 layouts across Chrome and WebKit, widths 320/390/640/768/1099/1100/1440, root font 100/200%, scripts on/off. Checked header containment, brand text, heading separation and 48px trigger. With scripts enabled, checked menu bounds, native focus scrolling to the last link, hit testing, Escape focus recovery and stable hero padding after contraction.
- WebKit's focus call can return before compositor hit testing reflects the scroll. The test waits up to 1.5 seconds for the focused link to be wholly inside the menu and hit-testable. It does not force a click or manually scroll the link into position. The prior immediate-sample failure was intermittent and not proof of a persistent obstruction.
- Navigation motion regression passed 12 groups; hero regression passed 54 layouts with the following section still visible at default text size.
- Screenshots: `output/header-text-resize/`. Inspected the 320px/200% screenshot; the brand is taller but full text and controls remain visible.

Limits: root-font enlargement is a specific stress test, not native OS text scaling, real browser zoom or physical iPhone testing. Other pages and complete text-enlargement acceptance remain open. No customer enquiry or external message sent.
