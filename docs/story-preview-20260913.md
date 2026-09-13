# Story and guide browsing

Local preview work for chapter 16 and the applicable M05/M06/M07/M08 surfaces. Not deployed; the full document remains incomplete.

## Changes

- Home and product-page related-story rails now have labelled previous/next controls, native horizontal scrolling, mouse dragging with click suppression after a drag, and keyboard access. The rail is manual, not an auto-rotating carousel. It reuses the existing gallery scroll hook and its reduced-effects scroll policy.
- Story cards use a stable container-relative width with a partial-next-card hint on small screens. Full titles and existing category/suburb information sit below the photo instead of being truncated over it. Metadata is not fabricated when absent.
- Existing case photographs use `object-contain` in stable 4:3 frames; guide covers also use contain. No door handles or long lock bodies are cropped to fill thumbnails. No new photographs, AI replacements or altered case claims were introduced.
- Story and blog-list images share the existing GalleryImage failure treatment. Inside a link, the fallback has no retry button or other nested interactive control. The title and destination survive image failure. Empty story arrays render no rail; single-entry rails have no redundant next/previous controls.
- Blog cards now use the same restrained card movement and text-panel glass highlight as product cards, with progressive entrance and reduced-effects fallbacks. Photo hover zoom was removed. Existing article text, order, pinned door-compatibility article, dates, schemas and destinations are preserved.
- Story and article links do not eagerly prefetch every linked page. Source content remains server-rendered.
- A missing ResizeObserver now falls back to scroll/window-resize measurements in the shared scroll hook. Testing exposed an unguarded observer in the header; that path now keeps the static active-link treatment instead of throwing and replacing the page with recovery UI.

## Evidence

- Production build succeeded, generating 63 pages. Focused ESLint and whitespace checks passed.
- `node tests/story-browser.cjs`: 120 layout checks across home, V5 MAX product and blog pages; Chrome/WebKit; 320/390/768/1440px; standard/reduced/no-JavaScript/broken-image/no-ResizeObserver modes. Covers full title layout, contained page width, no nested controls, image loading/failure, next/previous controls, dragging without navigation, keyboard article activation and return. Final run had no page errors.
- `node tests/story-ssr.cjs`: actual component output for zero, one, two and six entries, long unbroken titles, absent metadata and absent images.
- `node tests/story-edge-browser.cjs`: 11 cases across both engines for the above fixture layouts and manual effects reduction, plus Chrome touch emulation proving vertical page scrolling and horizontal story scrolling do not open an article. No physical device claim.
- `node tests/gallery-controls-browser.cjs`: 30 existing gallery-control cases passed after the shared scroll-hook change.
- `node tests/navigation-motion-browser.cjs`: 12 existing navigation groups passed after the header fallback change.
- `node tests/seo-content-browser.cjs`: 40 checks across 20 pages passed.
- `node tests/site-inventory.cjs`: 58 pages, 200 internal links, 105 local SEO images; no issues.
- Screenshots and reports are under `output/story-verification`. Final mobile/desktop rail screenshots were inspected after changing the photo fit to contain.

## Boundaries

This does not complete chapter 16's archive-wide privacy/permission review, new case taxonomy/filtering, article sharing controls, before/after comparisons or physical assistive-technology checks. No claim is made that all existing photos have fresh publication authorization. It does not complete the full twelve-motion system, final performance gates, durable enquiries or the package-wide acceptance cases. Do not replace those remaining requirements with this narrower test evidence.
