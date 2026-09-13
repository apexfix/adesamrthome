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
| Uploaded image contents | OPEN | Decode with a supported image library, limit decoded pixels, reject malformed data and normalize attachments. MIME/size checks alone are not deep verification. Avoid hand-rolled image parsing. |
| Durable enquiry acceptance | DESIGN REQUIRED | A Vercel function's local file or memory is not reliable storage. Select an approved durable store and retention/access policy before implementation. |
| Retry and idempotency | DEPENDS ON DURABLE STORE | Persist a stable request key and accepted enquiry; deduplicate across requests/instances. Do not treat the existing button guard as server-level deduplication. |
| Anti-spam | OPEN | Use validated limits and an approved persistent counter/challenge approach. Do not invent a reliable distributed limit using process memory. |
| Browser conversion reliability | OPEN | Needs robust accepted-enquiry IDs and deduplication, including blocked storage/scripts. No button click should count as an accepted lead. |
| CCTV policy and inclusions | OWNER FACTS REQUIRED | Do not add installation, cabling, disk, tax, delivery or warranty promises. Resolve wording before publishing new claims. |
| Product detail first-screen hierarchy | OPEN | Compare desktop/mobile layout; retain prices and scope before long manufacturer image sections. |
| Footer simplification | OPEN | Preserve useful service links and contact methods; measure layout before removing links. |
| Whole-site final URL/schema inventory | RELEASE CHECK | Regenerate after all approved changes. Local checks are not Google validation. |
| Performance | UNVERIFIED | Collect reproducible lab data and distinguish it from CrUX real-user p75. No invented scores or ranking gains. |
| Production release | NOT AUTHORIZED BY CURRENT CHECKLIST | Requires further authorization; release the reviewed batches together and perform an operator-only real enquiry test. |

## Durable enquiry design boundary

Before adding storage, specify the provider/project, access control, retention and deletion policy, attachment handling and expected costs. Store only fields needed to respond. Never write customer details into analytics or public artifacts. A proposed flow is: validate -> atomically persist request key and enquiry -> dispatch/retry operator email -> track delivery state -> return the existing accepted reference on retries. Customer acknowledgement failure must not erase a successfully accepted lead. This is a proposal, not implemented behavior.

Conflicting older preferences remain resolved conservatively: keep installation-only first in the product grid, and do not restore the large home camera showcase.
