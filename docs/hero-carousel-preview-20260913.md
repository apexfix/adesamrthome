# Homepage carousel preview

## Scope and release boundary

Implements the adopted black/gold package's three-service homepage carousel (M04) and a scoped mobile contact-dock improvement (M11). This is local preview work, not a production deployment or completion of the entire package.

The fixed H1 and main quote destination remain server-rendered. The primary button now says "Get a Quote". Supply/install, customer-owned-lock installation and equipment-only CCTV have distinct slide links. Installation-only remains first in the product grid. The removed large homepage camera showcase is not restored. Prices, product galleries, service terms, URLs and metadata are unchanged.

## Behavior

- Seven-second rotation and 650ms opacity transition; stable image, caption and control dimensions.
- Autoplay waits for usable media, page visibility, viewport intersection and standard visual effects. Hover, focus, touch and manual selection pause until explicit Play.
- Explicit Play works while the control remains focused. Reduced effects and background/offscreen conditions still take priority.
- Slow images retain the current image/caption until ready. Latest pending selection wins. Image failure uses an existing fallback; fallback failure retains a text stage and useful enquiry links.
- First image and enquiry links work without JavaScript. Inactive images are inert and hidden from accessibility APIs. Manual captions use polite announcements; automatic changes do not.
- Horizontal swipes change slides without cancelling vertical scrolling. All controls have accessible names and 44px targets.
- Mobile dock hides while the primary quote CTA is visible or the enquiry form has focus. Existing dock focus is preserved. A 120ms release guard prevents the dock appearing between pointer-down and pointer-up when leaving the form.

## Verification

Evidence directory: `output/hero-verification`. Generated evidence is not committed.

| Check | Observed result |
| --- | --- |
| Pure carousel state | 8 tests passed, including 0/1/2/3 slides and latest pending selection |
| Actual Next.js layout | 54 combinations passed: Chromium/WebKit, nine viewports, three slides; no horizontal overflow, fixed intro, usable media and next-section hint |
| Actual carousel interaction | Both engines passed timer, persistent pause, explicit Play, reduced effects, rapid selection and offscreen checks |
| StrictMode isolated harness | 14 cases passed: counts, slow media, image failure and fallback failure; actual component with test-only Next image/link adapters |
| Actual Next.js failure behavior | 8 cases passed: slow/broken/broken fallback/no JavaScript across both engines |
| Mobile contact dock | 6 combinations passed at 360/390/430px across both engines, including form exit and footer quote navigation |
| Navigation regression | 12 combinations passed |
| Reduced-effects regression | Final 24-case rerun passed |
| Enquiry regression | 22 checks passed; no real mail sent |
| URL/schema inventory | 58 pages, 198 internal links and 105 local SEO images; zero reported issues |

Product layout (100 combinations) and SEO content (40 checks) had passed earlier in this batch, before the final form-exit dock guard. Lint and the final production build (63 generated pages) passed. No full-package 116-case pass is claimed.

Visibility changes and swipe events in the interaction suite are synthetic; offscreen intersection and image network failures use actual browser behavior. Real iPhone keyboard, VoiceOver, hardware touch, enlarged text, field performance and production enquiry delivery remain unverified. Do not interpret local tests as Google indexing, ranking or CrUX results.

## Remaining document work

M01 navigation entrance, M02 compact navigation, M03 active pill, M05 scroll reveal, M06 product scrolling, M07 hover/press, M08 local highlight, M09 lightbox, M10 FAQ/steps and M12 form feedback still require individual specification audits and any missing implementation. Existing related functionality is not automatically a complete package pass. M11 coverage beyond the tested home/product primary-CTA selectors remains open. Durable enquiry storage, server idempotency and conversion deduplication retain their existing configuration boundaries.

## Local operation

Preview: `http://localhost:6650/`. The detached preview launcher disables SMTP credentials. No push, merge, deployment, billing change or customer email was performed in this batch.

See `hero-assets-20260913.md` for generated-image provenance.
