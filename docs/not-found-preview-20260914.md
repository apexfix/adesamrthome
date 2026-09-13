# Missing-page recovery

Local preview only, 14 September 2026. No deployment, customer messages or live account changes.

## Implementation

- Added a server-rendered black/gold 404 page with native home, catalogue and SMS destinations. Retains the shared navigation/footer and does not imply that missing content means no stock.
- The 404 page supplies its own recovery actions; hide the sales contact dock and its spacer on this page, including without scripts. Normal-page dock rules are otherwise unchanged.
- Enlarged-font testing reproduced narrow button overflow. Bounded flexible labels, fixed icon dimensions and fixed horizontal button padding allow wrapping without clipping.
- With scripts disabled, the first implementation exposed an existing unknown-product path failure: the response carried recovery content only in the client payload, leaving no visible recovery main. Products, brands, articles and service areas all enumerate their full locally bundled slugs at build time. Setting `dynamicParams = false` for these four routes rejects unlisted paths before on-demand rendering. Publishing a new locally bundled slug requires a rebuild; there is no external live CMS in this repository.

Framework reference: [Next.js generateStaticParams and unspecified paths](https://nextjs.org/docs/app/api-reference/functions/generate-static-params#disable-rendering-for-unspecified-paths). Behavior was verified against the installed Next 16.1.1 production build, not inferred solely from documentation.

## Verification

- Production build and ESLint for the five touched TSX pages passed.
- `tests/not-found-browser.cjs`: 80 cases passed across Chrome/WebKit, five invalid route families, four normal widths, two enlarged-root-font widths and two no-JS widths. Every case returned HTTP 404, exposed noindex, displayed the recovery heading/links, cleared the header and had no horizontal overflow. Main actions remain at least 48px tall. Returning home was exercised with and without scripts; no SMS was sent.
- `tests/site-inventory.cjs`: 57 sitemap pages plus the receipt page, 206 internal links and 123 local SEO images checked with no reported issues. Existing catalogue/article/brand/suburb pages remain available.
- Desktop, narrow and enlarged-action screenshots saved under `output/not-found`; Chrome desktop and enlarged buttons visually inspected.
- The existing mobile-dock regression reported a focused-link visibility failure on a normal product page. Added failure context to that assertion without weakening it. Follow-up outcome is recorded below; do not interpret the 404 tests as proving all normal-page dock behavior.

The diagnostic rerun passed all 72 route checks and 18 focus layouts without an application change to normal-page dock behavior. The earlier failure remains unexplained/intermittent, not fixed by a green rerun. Dedicated focus-transition and enlarged fixed-dock geometry investigation remains on the ledger.

## Remaining boundaries

Runtime error and global error recovery are separate from missing URLs. Their failure injection, retry behavior and no-JS/blocked-script behavior remain open. The product page still has a catch-and-notFound branch for unexpected data failures and needs separate error-contract verification. Current data access is local, not a failing external service.

No ranking improvement, Google re-crawl, physical screen-reader/keyboard coverage or full error-state acceptance is claimed.

Follow-up, 14 September: the product source-error contract and normal-script route/global recovery have now been tested and updated separately. See `recovery-preview-20260914.md`; actual framework recovery without scripts remains open.
