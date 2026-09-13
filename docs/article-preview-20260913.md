# Article reading and sharing preview

Chapter 16 scoped implementation, 13 September 2026. This batch is local-only; no deployment, social post, customer message or clipboard operation was performed on the owner's behalf.

## Implementation

- Article sharing receives the server-generated public canonical URL and public title. It does not read the current URL, query parameters, hash, form state or uploaded media links.
- Native sharing runs only on button activation. Cancellation remains quiet. Unsupported/failed sharing attempts a clipboard copy; only fulfilled clipboard writes produce `Link copied.`. Rejected or unavailable clipboard access produces a neutral failure status and leaves the public article link accessible.
- Native share resolution is not described as a published/sent message. The API's completion point varies by platform. See [MDN share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) and [MDN writeText](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText).
- Pending actions disable both controls and use a synchronous duplicate guard. Navigation to another article resets state; a pending native share rejection after unmount does not trigger a clipboard write.
- Share/copy use labelled Lucide icon buttons with tooltips, 44px targets and a live status area. Server HTML and no-JS browsing retain a normal public article link, without nonfunctional scripted buttons.
- Related articles now use the existing glass/entrance/card-feedback patterns, contained full photos and complete wrapping titles. No automatic zoom crop or three-line truncation remains there.
- Inline Markdown images retain normal intrinsic-ratio display and gain a failure fallback. Span-only fallback markup remains valid inside Markdown paragraphs. Related-image failures use the existing shared gallery image component; detail links/titles remain usable.
- Long article headings wrap. Removed the generic assertion that every project-page image is actual field work; this does not establish the rights or privacy status of any underlying asset.

## Verification

- `pnpm build`: passed with TypeScript and 63 generated pages.
- Focused ESLint and whitespace validation: passed.
- `node tests/article-share-browser.cjs`: Chrome/WebKit native-success semantics, cancellation, native failure, unsupported sharing, pending clipboard acknowledgement, duplicate suppression, denied/missing clipboard, privacy-bearing query/hash exclusion, route change/back, keyboard Enter/focus, 320/390/768/1440px controls and no-JS public-link fallback passed.
- External OS sharing/clipboard interfaces were mocked for those tests. They verify payloads and state transitions in the real built app, not real delivery through iOS/Android/Facebook or real clipboard permissions. Physical-device confirmation remains outstanding.
- `node tests/article-layout-browser.cjs`: 288 layouts across all 12 articles, two engines, four widths and normal/failed-images/no-JS states. Verified readable body text, one H1, no page overflow, related titles below photos, contained imagery, no nested buttons, actual link destinations, inline image failure fallback and no runtime exceptions.
- The initial fault-injection harness used shifting image-index locators and timed out after fallbacks replaced images. Reproduced the stale locator directly, switched to stable element handles, then reran the complete suite successfully. No application error was suppressed to get the passing result.
- `node tests/seo-content-browser.cjs`: 40 checks across 20 pages passed.
- `node tests/site-inventory.cjs`: 58 pages, 200 internal links, 105 local SEO images; no reported issues.
- `node tests/content-motion-navigation.cjs`: two cross-engine navigation checks passed.
- Visually inspected mobile reading, related cards, WebKit inline-image failure, and copy-failure toolbar screenshots under `output/article-layout-verification` and `output/article-share-verification`.

## Remaining scope

This is not full chapter 16 or whole-site acceptance. Gallery filter URL/state improvements, verified publication permissions and privacy review, factual review of existing content, update reasons for editorial changes, native-device sharing, assistive technology and performance measurement remain open. Do not add review ratings, before/after transformations or customer identifiers without evidence. Existing prices, canonical article metadata, contact routes, product ordering and carousel choices are preserved.
