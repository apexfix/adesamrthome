# Enquiry confirmation preview, 19 September 2026

## Scope

Local preview only. No deployment, live enquiries, analytics-account changes,
customer messages, prices, warranties or advertising changes. The user resumed
work without remaining-usage polling. No credits were redeemed.

## Implementation

- Keep a minimal, versioned session receipt containing only a validated accepted
  reference and known service. No customer contact details or photos are stored
  in this receipt. It is a current-tab convenience, not server-authenticated or
  durable acceptance.
- Direct visits, malformed values and denied browser storage show neutral enquiry
  details with native SMS/email links, never an invented successful submission.
- Accepted receipts keep their reference across reloads and provide service-specific
  next steps. Equipment enquiries do not request security-system planning or door
  photographs. URL parameters cannot replace the saved reference/service.
- The initial server and browser render use the same neutral content. The page
  needs no request-time data, so it now renders synchronously; browser receipt
  storage is read only after hydration. The experimental request-time connection
  and loading boundary were removed.
- If receipt/context storage or analytics fails after acceptance, retain the inline
  accepted reference and remove the form rather than inviting duplicate submission.
- Hide the sales contact dock on receipt surfaces, retain accessible native contact
  actions, and register late-arriving process steps with observer cleanup.

## Investigation record

An intermittent React hydration #418 was reproduced on receipt reload/changed-query
navigation. The development trace expected the root `#site-content` wrapper but
encountered its child or a Suspense marker. One passing run was not sufficient:
earlier 36-case and 96-load passes were followed by another failure.

The same current async-page implementation failed a production Webpack comparison
on a portfolio-project receipt reload. Therefore this is not established as a
Turbopack-only problem. No framework versions, package scripts or global layout/
header behavior were changed to hide it. No error filters or hydration-warning
suppression were added. Global Suspense experiments were discarded because they
hid useful content without JavaScript.

The synchronous-page version passed 36 development flows (20 reloads per accepted
flow, 400 reloads total) and 36 production flows (five reloads per accepted flow).
However, the subsequent early-keyboard hydration test still failed at Chrome
320px, normal scripts, reload 7. Static rendering alone did not fix the problem.

The next scoped change places a stable keyed React Fragment between the existing
`#site-content` DOM wrapper and its route children. The installed React reconciler
unwraps an unkeyed top-level Fragment but retains a keyed Fragment as its own
reconciliation unit. This separates route-child suspension/replay from claiming
the wrapper. It adds no DOM, loading fallback or client-only rendering and does
not suppress recoverable errors. The root cause remains an inference from the
trace and local reconciler code, not a confirmed upstream diagnosis.

## Final verification

The final production Turbopack build succeeds and identifies the receipt as a
static route. Scoped ESLint and whitespace checks pass. No dependency or package
script changes were needed.

| Check | Final result |
| --- | --- |
| `enquiry-receipt.cjs` | 20 parser/copy checks passed. |
| `lead-conversion.cjs` | 23 conversion-contract checks passed. |
| `enquiry-confirmation-hydration.cjs` | Two complete consecutive post-change runs passed: 96 loads each, Chrome/WebKit, 320/1440px, normal/delayed scripts, immediate keyboard interaction; no page errors. |
| `enquiry-confirmation-browser.cjs` | 36 cases passed, with five reloads for each of 20 accepted flows. URL tampering, neutral/blocked-storage/no-JS visits, no duplicate conversions, 100/200% text size and 48px contact targets checked. |
| `enquiry-receipt-browser.cjs` | 24 storage/receipt-storage/analytics-failure cases passed; one mocked POST, focused inline reference, removed form, released private photo URLs, no dock/overflow/page errors. |
| `enquiry-nojs-browser.cjs` | 44 no-JS/blocked/delayed-script layouts passed. |
| `navigation-motion-browser.cjs` | 12 navigation groups passed. |
| `process-step-browser.cjs` | 32 cases passed, including late insertion/removal and reduced/no-JS behavior. |
| `site-inventory.cjs` | 57 sitemap URLs plus receipt = 58 pages; 206 internal links, 123 local images; no reported issues. |

An initial inline-receipt regression run failed its immediate focus assertion.
The component applies focus in an effect after committing the receipt DOM; the
test now waits for that actual focus condition with a one-second bound, then
retains the original strict focus assertion. It does not add a fixed sleep or
force focus. The complete 24-case run then passed; no production focus behavior
was changed to accommodate the test.

Mobile Chrome installation-only and desktop WebKit equipment receipt screenshots
were visually reviewed: readable references, service-specific copy, non-overlapping
layout and no post-submission sales dock. Evidence remains under
`output/enquiry-confirmation`, `output/enquiry-receipt`, `output/enquiry-nojs`,
`output/navigation-motion-verification` and `output/site-inventory/after`.

The reproduced root-wrapper error did not recur in these final runs. This is a
scoped local mitigation, not proof against every framework hydration failure or
validation on a physical iPhone. Earlier failures above remain part of the record.

## Remaining boundaries

Durable storage, server idempotency, actual mail delivery, physical phone and
assistive-technology acceptance, complete-site performance, the remaining design
matrix and production release authorization remain open. This work is not a
claim that SEO or the full design package is complete.
