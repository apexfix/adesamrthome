# Reduced visual effects preview

Scope: the manual reduced-effects setting from the black/gold reference package. Local preview only; no push, production deployment, price change or customer message.

## Implementation

- A native checkbox in the footer, with a stable accessible name and a minimum 44px label target. Footer stays a server component; only the setting is client-side.
- Default presentation preserves the existing glass navigation, control surfaces, product photos and static homepage hero. No new animation library or autoplay was added.
- Manual reduction uses opaque dark surfaces, removes backdrop blur and decorative transitions/animation, and disables image hover enlargement. The light form/control surface remains white, not an unreadable dark background with dark text.
- Installation-photo arrow scrolling reads the current preference and uses instant scrolling when reduced. The photo overlay uses an opaque background in this mode.
- System reduced-motion or reduced-transparency preferences take precedence. CSS supports them before JavaScript loads and without JavaScript. Live media-query changes update the control; its separate system-preference description does not change the checkbox's name.
- The boolean manual preference is stored in `ade-reduce-visual-effects`. It contains no contact or enquiry information. Other open tabs receive preference changes through storage events.
- Read/write storage failures fall back to an in-memory preference for the current tab. Persistence across a reload is not promised when storage is blocked.
- Manual saved preferences apply when the client setting subscribes after hydration. No claim of flash-free manual restoration before hydration; no inline bootstrap or cookie was introduced. Without JavaScript, the manual control is omitted and system CSS preferences still work.
- The mobile contact bar's existing bottom spacer now matches the black footer instead of exposing the white body background. Its size and destinations did not change.

## Verification

Browser automation uses the existing local Playwright fallback because agent-browser was unavailable in the earlier environment check. Chrome and WebKit are browser engines, not substitutes for a real iPhone test.

`tests/visual-effects-browser.cjs` covers 24 combinations: two engines, 390/1440px widths, and normal storage, blocked reads/writes, blocked writes only, malformed stored value, system reduced motion, and no-JavaScript system reduction. It checks computed opaque/blurred styles, keyboard toggling, label bounds, same-origin tab sync, reload and navigation persistence, live system motion changes, actual photo-scroll arguments and photo-overlay styles. The mobile spacer must match the footer background.

Additional regression commands: `pnpm lint`, `pnpm build`, `node tests/navigation-browser.cjs`, `node tests/product-layout-browser.cjs`, `node tests/enquiry-browser.cjs`, `node tests/site-inventory.cjs`, and `git diff --check`. Results and screenshots are in the corresponding `output/*-verification` folders and `output/site-inventory/after/report.json`.

Final preview results: lint/build passed (63 generated pages); 24 effects combinations, 12 navigation combinations, 100 product layout checks and 22 enquiry browser checks passed. The inventory checked 58 pages, 198 internal links and 105 local SEO image URLs with no reported issues. Desktop Chrome and mobile WebKit screenshots were visually inspected; the mobile bottom white band is no longer present. No real SMTP message was sent.

This is not the reference package's complete 116-case suite. System transparency's CSS/JavaScript path is implemented but not separately OS-emulated by this suite. Real-device screen-reader behavior, device energy usage, slow-hydration rendering and field performance remain unverified. The package's broader hero carousel/design work and durable enquiry storage remain separate checklist items.
