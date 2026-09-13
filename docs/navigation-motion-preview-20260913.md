# Navigation motion and state preview

Implements the adopted document's navigation entrance (M01), compact scrolling header (M02), desktop active indicator (M03) and chapter 09 menu behavior. Local preview only; no production deployment, route deletion or price changes.

## Implemented

- Initial header entrance: -6px to 0 over 320ms. Completion or cancellation retires the animation, so changing reduced-effects preferences does not replay it. System reduction displays immediately.
- At scrollY > 32, the internal header changes from 72px desktop / 68px phone to 64px over 220ms. Its fixed outer footprint remains reserved; content position is unchanged. Backdrop blur is not continuously animated while scrolling.
- The active desktop item has a measured gold background that moves/resizes over 220ms. ResizeObserver and font readiness remeasure actual labels. Existing static selected styling is the fallback before measurement. The indicator is decorative and cannot receive input.
- Pathname and category query are handled independently. Unknown query state is not guessed. Camera products cannot inherit a generic smart-lock highlight. Product route classification comes from the server's actual local product catalogue; only the small route/section mapping reaches the header.
- Current destination and ancestor section use page/location semantics respectively. The More button receives a visual section indicator and its actual destination retains aria-current within the dropdown.
- A small Suspense-wrapped query observer preserves server-rendered header links. Route and query changes close menus, including back/forward, while leaving URL filters unchanged.
- Mobile menus are non-modal: no focus trap, aria-modal or page scroll lock. Escape returns focus; outside clicks and focus exit close menus. Crossing the 1100px breakpoint closes menus and transfers focus from disappearing controls to visible navigation.
- Phone links and menu toggle are at least 48px high; long menus scroll internally and stay within a short landscape viewport. The fixed contact dock hides while the mobile menu is open.
- Menu surfaces use a 96% dark base beneath the restrained glass highlight. Visual WebKit inspection found background headlines too legible with the previous translucent base. System/manual reduced-effects mode still replaces these surfaces with solid backgrounds.

## Evidence

`output/navigation-motion-verification/results.json` records 12 passing browser groups across Chromium and WebKit: desktop active mapping/motion/history, four mobile sizes, and a JavaScript-disabled desktop navigation check. It includes real same-path query changes, back/forward with brand filters, resizing while focused, changed label metrics, 48px targets, short-screen last-link reachability and manual/system reduced menu surfaces. Desktop and phone/landscape screenshots were inspected. This is not a claim of testing every possible route or assistive technology.

`tests/navigation-state.test.cjs`: 16 passing route/category cases. Existing navigation: 12 combinations passed. Header-related regression before the last entrance-retirement adjustment: hero 54, mobile dock 6, reduced-effects 24. The final hero content rerun also passed 54 layouts and both engines' carousel interaction checks. Final build generated 63 pages and lint passed. The final local URL/schema inventory passed 58 pages, 198 links and 105 SEO images after the featured-image replacement; rerun inventory before release.

Real iPhone keyboard/VoiceOver, enlarged-text coverage beyond the tested changed label, absent protocol-handler copy feedback, unsupported-browser fallback and final full-package acceptance remain open. Mobile menu behavior requires JavaScript; useful service links remain in the page/footer without it. No full 116-case package pass is claimed.

## User-directed carousel override

During this batch the user explicitly requested V5MAX and X9 in the homepage carousel. This supersedes the package's previous service/camera slide selection, not the established carousel interaction rules.

1. Lockin V5 MAX: A$1,350 with standard installation; links to `/products/lockin-v5-max-smart-lock`.
2. Lockin X9: A$699 with standard installation; links to `/products/lockin-x9-smart-lock`.
3. Installation only: user-supplied poster, with accessible caption distinguishing 6068 A$350 and compact A$200; links to `/products/smart-lock-installation-only-service`.

Kaadas and camera imagery is no longer in the homepage rotation. Their products/categories and retained source files are not deleted. The generic H1/main enquiry button remain fixed. Prices in the product catalogue were not changed. The provided poster's A$350 is not advertised as a V5MAX package price. See the appended asset provenance in `hero-assets-20260913.md`.

Final featured-slide checks: 54 layouts include expected product names, prices, destinations and absence of Kaadas/CCTV carousel images; 8 actual Next.js slow/error/no-JavaScript cases passed. The independent 0/1/2/3 harness retains its old sample images intentionally and is not evidence of current product selection.
