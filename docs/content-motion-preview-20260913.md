# Content and product-card motion

Local preview checkpoint, 13 September 2026. This batch implements M05 on selected content groups, M07 on catalogue product cards and principal actions, and M08 on product-card information panels. It does not certify the full design package or every repeated card surface. No deployment, new imagery, prices, claims or customer messages.

## Implementation

- `RevealGroup` progressively animates off-screen service pathways, audience pathways and product groups on Home, Products, brand pages and the CCTV category page. Current-viewport children are left alone on mount, preserving the first screen and restored scroll positions.
- Each eligible child enters once with Y16 to Y0 and opacity 0 to 1 over 480ms. Stagger delay uses four slots at 0/70/140/210ms, capped rather than growing with a large list. HTML and CSS remain visible by default; there is no hidden state waiting indefinitely for an observer or script.
- Keyboard focus cancels a pending/active reveal for that item. Preference changes and unmount cancel animations and disconnect observers. The group updates when server-provided children change, including catalogue filtering. If animation creation fails, content retains its static presentation.
- Catalogue cards lift 4px over 220ms on fine-pointer hover and press to 0.98 scale over 140ms. Their CSS layout dimensions do not change. Product photos no longer magnify on hover, preserving the visible product composition.
- Principal hero actions, product-enquiry links, submit buttons and interactive glass links/buttons receive the 140ms press feedback. Disabled buttons are excluded. Reduced-effects styles remove the scale and lift, not just their transition duration. Other tools and repeated story/gallery cards are not represented as completely standardised by this batch.
- A low-opacity linear glass sheen follows desktop mouse position only inside a product card's text panel. It does not cover product photos, create decorative orbs, use sensors, run on touch devices, or add animation loops while idle. CSS transition is 160ms; pointer writes are coalesced to one animation frame. Pointer exit, visibility change, route change and preference change clear the active panel.

## Verification

| Command | Observed result |
| --- | --- |
| `pnpm build` | Passed; TypeScript and 63 generated pages |
| `pnpm lint` | Passed |
| `node tests/content-motion-browser.cjs` | 20 cases across Chrome/WebKit: 390/1440 widths, standard/reduced/no-JavaScript/failing-animation modes, mouse/touch-media behavior, bounded reveal timing, focus cancellation, fixed card dimensions, highlighter tracking/exit and reduced-effects suppression |
| `node tests/content-motion-navigation.cjs` | 2 cross-engine flows: actual quote press duration, catalogue query filter, card navigation, browser Back, pointer-state cleanup and manual reduced-effects toggle |
| `node tests/hero-browser.cjs` | 54 layouts passed; V5 MAX, X9, A$443 Dahua kit and next-section hint preserved |
| `node tests/seo-content-browser.cjs` | 40 responsive checks on 20 content pages passed |
| `node tests/visual-effects-browser.cjs` | 24 preference/fallback combinations passed |
| `node tests/site-inventory.cjs` | 58 pages, 198 internal links, 105 local SEO images; no issues |

The built CSS initially combined `transform: none` plus individual scale into a transform function. This removed the intended scale-property transition from the quote button. The redundant transform declaration and legacy glass-control press translation were removed; the test now observes the actual built-page scale and 140ms duration.

Evidence is in `output/content-motion-verification/` and the existing regression evidence directories. Desktop product-card glass screenshots were visually inspected: the warm highlight is confined to information areas and leaves the product image unchanged. No field performance or search ranking improvement is inferred from these checks.

## Remaining work

Story/gallery card feedback, other applicable content groups and the remaining form-motion/feedback specification still need review. Physical mobile hardware, assistive technology and full-package acceptance are not covered by these browser tests. This is intentionally not a global fade animation on every section.

During source inspection, `ProductCard` still uses `toFixed(0)` in price presentation. Existing catalogue prices are whole AUD amounts, so this batch does not change them, but document chapter 14's fractional-price requirement remains open. A shared minor-unit formatter and focused fractional/missing-price tests should address that separately without modifying catalogue amounts.
