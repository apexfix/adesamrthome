# Homepage and navigation preview - 13 September 2026

Preview branch: `fix/enquiry-preview-20260913`. Previous batch: `9ebe8cc`. No production deployment.

## Changes and reasons

- `src/components/Header.tsx`: expose Smart Locks, Installation Only and CCTV Kits in desktop navigation. Keep Gallery direct; retain All Products, brands, Stories, About and Contact under More. Mobile navigation retains the complete link list. The brand remains a home link.
- `src/components/HeroCarousel.tsx`: focus the home headline on Adelaide smart lock supply and installation. Explain customer-supplied locks, make the free door check the primary enquiry action, retain browsing, installation-only and camera-kit links. No new service claims or changed prices.
- `src/app/page.tsx`: align the home title, Open Graph and Twitter titles with the visible supply-and-install heading. Preserve canonical and existing language alternates.
- `src/app/globals.css`: desktop header links use a 48px minimum target; hide the fixed mobile contact dock while a quote input/select/textarea has focus. Keep the existing document spacer so hiding the dock does not move the page layout.
- `tests/navigation-browser.cjs`: regression coverage for direct service links, keyboard operation, menu closing, hero actions and form-focus behavior.
- `tests/enquiry-browser.cjs`: mock the enquiry fetch inside the test page, leaving browser navigation requests outside routing. Use a fresh page for each independent viewport check instead of repeatedly resizing and replacing one page. The mock serializes the real FormData and returns controlled success/failure responses; no enquiry reaches SMTP.

## Evidence and limitations

Before: `output/navigation-verification/before-390.png` and `before-1440.png`.
After: `output/navigation-verification/chromium-after-390.png` and `chromium-after-1440.png`, plus WebKit counterparts. Desktop and mobile screenshots inspected.

Navigation tests cover Chromium and WebKit at widths 360, 390, 430, 768, 1100 and 1440: 12 combinations. They test service links, touch target dimensions, no horizontal overflow, keyboard Enter/Escape, focus return, outside-click dismissal, section scrolling and the enquiry prefill. Mobile focus tests confirm the dock hides and reappears. See `output/navigation-verification/results.json`.

The 20-page SEO regression and 40 responsive checks passed. WebKit translation-mutation regression passed for home, products, contact and service switching. A real iPhone keyboard and assistive technologies are still untested; simulated focus behavior is not a substitute for those checks.

Build, lint, 11 isolated API tests and the final revised enquiry browser suite passed. The revised suite retains explicit browser-error assertions; raw results are in `output/enquiry-verification/results.json`.

Enquiry regression runs reported WebKit prefetch cancellation during rapid repeated page replacement, and one intermediate run reported a hydration mismatch. Changing network interception alone did not resolve the cancellation. Independent layout cases now use separate pages, matching the SEO and navigation test approach. No browser error is suppressed. These test changes are not a production CORS or hydration fix; consult the regenerated enquiry results for the final run.

## Preview and rollback

`http://localhost:6650/` or, on the same network, `http://192.168.50.126:6650/`. Preview SMTP remains disabled. Prices, product order and the removed large home camera section are unchanged.

This is a separate commit on the existing preview branch. Revert that commit if necessary; do not reset unrelated work. Neither this batch nor the preceding two batches have been pushed to production.
