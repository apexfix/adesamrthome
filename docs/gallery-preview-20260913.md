# Product and installation image browsing

Local preview checkpoint, 13 September 2026. Not deployed. This batch implements the shared image-viewing flow in document chapter 14 and the case-gallery lightbox portion of M09, plus photo/thumbnail scrolling from M06. It is not acceptance of the entire design package or its 116 supplied integration cases.

## Implemented

- Product main images, product installation photos and `/gallery` case photos use a shared native modal dialog. All three preserve the actual opener, including Safari mouse clicks that do not normally focus buttons.
- Previous/next buttons and arrow keys wrap within the relevant photo collection. Case-gallery navigation respects the selected existing model filter. Single-image products omit navigation controls.
- Native modal isolation, explicit Tab/Shift+Tab wrapping, Escape, close button and blank-edge dismissal. Background interaction and the mobile contact dock are unavailable while a lightbox is open. Body overflow and padding values are restored on close/unmount, as is the opener's focus without scrolling the page.
- 240ms opacity entry/exit, with immediate reduced-effects behavior. Closing does not depend on image completion or an animation event.
- Two-times image enlargement with native scrollable panning and a reset control. The enlarged region is keyboard-focusable; arrow keys there pan the image instead of selecting a different photo. Changing photos resets zoom.
- Current-image loading status, meaningful missing-image fallback and an explicit retry button inside the lightbox. Thumbnail and main-image failures do not introduce nested buttons or collapse their fixed dimensions. Empty product media has a non-interactive fallback; an empty installation strip is omitted.
- Only the current enlarged image is rendered in the dialog. Thumbnail and product image collections remain separate from long specification images. No new image assets, captions, product specifications, business claims or prices were introduced.
- Photo strips and product thumbnails use scroll snap with button alternatives and edge-disabled controls. Mouse dragging does not accidentally open images; native touch retains horizontal photo scrolling, vertical page scrolling and pinch zoom. Smooth button scrolling is browser-controlled rather than a guaranteed 400ms duration; reduced effects uses instant scrolling.
- Product gallery components are keyed by product slug so route changes clear image state and run modal cleanup. Browser-back navigation while the modal is open was exercised through a client-side catalogue-to-product transition.

## Evidence

Run against the built local preview at `http://localhost:6650/`:

| Verification | Result |
| --- | --- |
| `pnpm build` | Passed, 63 generated pages; TypeScript passed |
| `pnpm lint` | Passed |
| `node tests/gallery-browser.cjs` | 10 cases, Chrome and WebKit; 320/390/844-landscape/1440 widths, plus single-image products |
| `node tests/gallery-edge-browser.cjs` | 8 cases across both engines: broken images, pending high-resolution request, JavaScript disabled, mouse drag/dismiss/history cleanup |
| `node tests/gallery-controls-browser.cjs` | 30 cases: all seven existing case filters at 320/1440 in both engines, zoom/pan/focus and two successful failure-retry recoveries |
| `node tests/gallery-touch-browser.cjs` | Chromium emulated touch: vertical page movement and horizontal photo movement, neither gesture opened a photo |
| Empty-media SSR fixture | Product fallback and omitted empty installation strip passed |
| `node tests/product-layout-browser.cjs` | 100 responsive checks across 10 products and two engines |
| `node tests/visual-effects-browser.cjs` | 24 combinations passed |
| `node tests/site-inventory.cjs` | 58 pages, 198 internal links and 105 local SEO image URLs; no issues |

The empty-media fixture is built using `pnpm dlx esbuild@0.28.2 tests/fixtures/gallery-empty.jsx --bundle --platform=node --packages=external --jsx=automatic --alias:@=./src --outfile=output/gallery-verification/empty.bundle`, then executed with `node output/gallery-verification/empty.bundle`. The bundle is test output, not a shipped asset.

Screenshots and JSON results are in `output/gallery-verification/`. Product and case-gallery screenshots at mobile and desktop widths were visually inspected: controls remain separate from images/captions, complete images are contained and no viewport overflow was observed. Existing product-layout and reduced-effects evidence folders were refreshed.

## Findings addressed during verification

- Native modal focus isolation alone allowed Tab to leave the image controls, so explicit wrapping was added.
- Safari pointer activation did not always focus the original photo button; opening now focuses that actual trigger before mounting the modal.
- Browser-computed `touch-action: manipulation` is equivalent to the explicitly declared `pan-x pan-y pinch-zoom`; the test accepts either serialization and a separate touch-gesture test verifies the intended behavior.
- Slow-image tests start interception after initial page hydration; this isolates the enlarged-image request from unrelated page loading. Tests confirm a request was actually held before asserting the dialog remains closable.

## Remaining boundaries

- Physical iPhone/Android testing, VoiceOver/TalkBack, OS keyboard behavior and large accessibility text remain unverified. WebKit automation is not a physical Safari device test.
- Older browsers without native dialog support have not been verified. No claim of a fallback for such browsers is made.
- Photo rights and a full privacy review of the existing installation archive are not established by these interaction tests. This batch reuses existing catalogue/case assets and adds no customer photos.
- M06 is covered for photo/thumbnail rails, not an unimplemented homepage product rail. Other motions, case content/editorial changes and full-package acceptance remain on the implementation ledger.
- Durable enquiry storage, deduplication, anti-spam and production analytics remain separate open items. No real enquiries were sent and no production settings changed.
