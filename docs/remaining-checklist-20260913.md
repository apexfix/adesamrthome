# Remaining implementation checklist

This is an implementation ledger, not a claim that SEO work or ranking improvements are complete. Updated 13 September 2026.

| Item | Status | Next action / boundary |
| --- | --- | --- |
| Public crawl, URL and metadata baseline | Audit recorded | Use evidence in the original `outputs/seo-audit-2026-09-13` folder; production has not received preview changes. |
| Prices and visible contact information | Audited; preserved | Production SMTP environment and inbox remain unverified. |
| CCTV form validation and service switching | Fixed in preview | Mock SMTP and browser regression pass; no real customer messages. |
| Contact requirements and receipts | Fixed in preview | Name, suburb, mobile OR email; equipment-specific receipt. |
| Analytics free-text product leakage | Fixed for explicit event payloads | Actual GA4/Meta settings, automatic URL collection and delivery not audited. |
| Unverified installation count and default limited-stock claims | Removed in preview | Add counts only with evidence; ask for current stock before adding availability claims. |
| Installer-page draft copy | Rewritten in preview | Do not merge competing pages without query/conversion/backlink evidence. |
| Homepage routing and direct service navigation | Implemented in current preview | See navigation batch evidence. |
| Mobile focus / fixed contact dock | Implemented in preview | Real iPhone keyboard, text enlargement and screen-reader testing remain open. |
| Uploaded image contents | IMPLEMENTED IN PREVIEW | Real decoding and JPEG normalization via sharp, strict format/size/pixel checks, metadata removal and animated WebP rejection tested. See photo-validation batch. Not antivirus or distributed abuse protection. |
| Durable enquiry acceptance | STORAGE CONFIGURATION REQUIRED | This round found no database dependency, adapter or configured local storage credentials; only `.env.example` is present. Do not assume this proves anything about production secrets. A Vercel function's local file or memory is not reliable storage. Select an approved durable store and retention/access policy before implementation; continue independent checklist items meanwhile. |
| Retry and idempotency | DEPENDS ON DURABLE STORE | Persist a stable request key and accepted enquiry; deduplicate across requests/instances. Do not treat the existing button guard as server-level deduplication. |
| Anti-spam | OPEN | Use validated limits and an approved persistent counter/challenge approach. Do not invent a reliable distributed limit using process memory. |
| Browser conversion reliability | OPEN | Needs robust accepted-enquiry IDs and deduplication, including blocked storage/scripts. No button click should count as an accepted lead. |
| CCTV policy and inclusions | OWNER FACTS REQUIRED | Do not add installation, cabling, disk, tax, delivery or warranty promises. Resolve wording before publishing new claims. |
| Product detail first-screen hierarchy | IMPLEMENTED IN PREVIEW | All ten product pages now use a shared heading/media/price/enquiry hierarchy. Both engines at five widths pass; prices, scopes and prefill retained. See product-layout batch. Real-device accessibility and field performance remain unverified. |
| Footer simplification | IMPLEMENTED IN PREVIEW | SMS/email precede navigation on mobile; secondary links use native disclosure lists. All previous footer destinations retained and tested. No pages deleted or redirected. |
| Whole-site final URL/schema inventory | PREVIEW INVENTORY PASSED | 57 sitemap URLs plus the noindex receipt page, 198 internal links and 105 local SEO image URLs checked. Corrected shared category Product markup and installed-package entity identity. Re-run after further changes and before release; not Google validation. See site-inventory batch. |
| Performance | UNVERIFIED | Collect reproducible lab data and distinguish it from CrUX real-user p75. No invented scores or ranking gains. |
| Production release | NOT AUTHORIZED BY CURRENT CHECKLIST | Requires further authorization; release the reviewed batches together and perform an operator-only real enquiry test. |

## Durable enquiry design boundary

Before adding storage, specify the provider/project, access control, retention and deletion policy, attachment handling and expected costs. Store only fields needed to respond. Never write customer details into analytics or public artifacts. A proposed flow is: validate -> atomically persist request key and enquiry -> dispatch/retry operator email -> track delivery state -> return the existing accepted reference on retries. Customer acknowledgement failure must not erase a successfully accepted lead. This is a proposal, not implemented behavior.

Conflicting older preferences remain resolved conservatively: keep installation-only first in the product grid, and do not restore the large home camera showcase.

## New reference package

The black/gold liquid-glass v4 package was received during the next inventory round. Its full Markdown was read and source references compared to the current preview. See `black-gold-package-intake-20260913.md`. It is reference material, not release authorization or evidence that the included 116 integration cases passed on this website. Do not overwrite already completed preview work with its older baseline examples.
