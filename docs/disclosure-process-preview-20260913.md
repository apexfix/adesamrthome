# FAQ and process motion (M10)

Local preview batch, 13 September 2026. This implements the M10 FAQ expansion and process-number highlight behaviors from the adopted design document. It does not certify the other motion items or the complete site-design acceptance audit. No deployment or business-data changes.

## FAQ behavior

Homepage questions now use server-rendered native `details`/`summary`, matching the service, brand, suburb and CCTV pages. The first homepage answer starts open. Multiple answers can remain open for comparison. Every question and answer remains in the HTML and keeps its existing wording and FAQPage JSON-LD; no new SEO claims were added.

Only explicitly marked `data-faq` disclosures receive a progressive 220ms height animation. Footer navigation disclosures retain their original native behavior. The enhancement is one delegated click listener rather than per-question React state, and it also handles native keyboard activation. Genuine links or form controls inside a summary retain their actions.

Opening sets the native open state immediately, so answer availability does not depend on an animation-completion callback. Closing keeps the answer in the open disclosure for the short transition and then closes it natively. Rapid toggles replace the active transition from its current height; they do not queue animations. Completed or cancelled animations restore the prior overflow style, leaving normal automatic height. Route changes and reduced-effects changes settle pending transitions and remove listeners. Missing or failing animation support falls back to the requested native state.

## Process behavior

The existing numbered process sequences on the shared audience-service template, installation-only page, Airbnb page, suburb pages, About and receipt page receive a one-time reading highlight as they enter view. Existing titles, numbers, order and descriptions are untouched. Supply-page feature icons are not relabelled as process steps.

This changes only the number's colour and restrained text glow over 220ms. It never hides content, moves the layout, advances an enquiry, reports a booking status or adds `aria-current="step"`. The viewport observer disconnects on route/preference changes. JavaScript-disabled and reduced-effects views retain their original static presentation.

## Verification

- `pnpm build`: passed, TypeScript and all 63 generated pages.
- `pnpm lint`: passed.
- `node tests/disclosure-browser.cjs`: 48 cases across Chrome/WebKit and 390/1440 widths, covering ten page/template destinations. Checks include real 220ms animation timing, native open state, keyboard close and focus, rapid reversal, restored geometry, FAQ/JSON-LD text agreement, no-JavaScript use, reduced effects, live preference change and a deliberately failing animation API.
- `node tests/process-step-browser.cjs`: 28 cases across both engines. Six representative sequences at two widths, geometry/text preservation, one-time highlighting, system reduction, client-side route cleanup and no-JavaScript static content.
- `node tests/hero-browser.cjs`: 54 layouts passed. V5 MAX, X9 and the A$443 Dahua kit remain the homepage slides.
- `node tests/visual-effects-browser.cjs`: 24 existing preference/fallback combinations passed.
- `node tests/site-inventory.cjs`: 58 pages, 198 internal links and 105 local SEO image URLs; no issues.

Screenshots and JSON results are in `output/disclosure-verification/`. Mobile homepage FAQ and desktop process screenshots were visually inspected for legibility, spacing and separation of controls from answers. Existing hero and inventory evidence was refreshed.

## Remaining boundaries

Physical-phone assistive technology and large accessibility-text testing are not established by these browser checks. The tests exercise representative templates, not every combination on every URL or all 116 supplied integration cases. Field performance and search ranking are not proven by successful build or inventory results.

M05 scroll entrances, M07 card/button feedback, M08 local highlights and the remaining M12 form transitions still require their own implementation and verification. Durable enquiry acceptance, deduplication, anti-spam and approved production configuration remain open on the main ledger.
