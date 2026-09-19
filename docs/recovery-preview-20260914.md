# Runtime recovery preview

Local preview only, 14 September 2026. No deployment, customer message or billing action.

## Changes

- Product source errors now propagate to the error boundary instead of being converted to a missing-product response. An actual absent product still follows the existing not-found path.
- Shared route/global recovery uses bounded black/gold typography, 48px native navigation actions and the central business contact details. Reload, home and catalogue links do not depend on a functioning client router. No exception details are displayed.
- The normal sales dock and spacer are hidden when recovery provides its own contact actions. Global recovery has its own inline presentation and keyboard outline, independent of the main stylesheet.

## Verification

- `tests/product-error-contract.cjs`: six checks passed, including exact source-error propagation for page and metadata, missing products, and a valid product. The source-error test failed against the previous catch-and-notFound implementation.
- `tests/recovery-browser.cjs`: 56 cases passed across Chrome/WebKit at 320, 390, 768 and 1440px. Static global/shell recovery was checked with normal/enlarged root fonts and without scripts. A real React rendering exception exercised the actual route error component. Checks include wrapping, targets, focus, native navigation and shared header images/clearance. These isolated fixtures are not claims about framework delivery without scripts.
- `tests/recovery-next-browser.cjs`: eight production Next fixture cases passed across both engines, page/root failures and 320/1440px. The fixture imports the actual app layout and error boundaries. All responses were HTTP 500, recovery was visible, native reload returned to a healthy page after removal of the injected fault, and browser page-error lists were empty. Synthetic server errors are expected test output.
- Optional `--nojs` probe failed on its first Chrome/page/320px case: the framework did not expose visible recovery HTML. Later no-JS cases, including root failures, were not reached. This remains OPEN, despite the static component working without scripts. Do not interpret the eight normal-script cases as resolving this limitation.
- Production root and nested fixture builds passed. The final root route table excludes the fixture `/fail` route, and an HTTP request to the main preview `/fail` returned 404 without fixture content.
- Product pricing regression: 65 checks passed. Final site inventory reported no issues across 57 sitemap URLs plus the receipt page, 206 internal links and 123 local SEO images. Scoped ESLint and diff whitespace checks passed.

Screenshots and detailed JSON evidence are in `output/recovery` and `output/recovery-next`; generated artifacts are not committed. Test fixture build output is ignored. No injected failure route is added to the real app.

## Remaining boundaries

Actual Next server failure delivery without scripts is unresolved. Physical assistive technology, browser translation interference, production failures/telemetry and full-site acceptance remain unverified. No new error-reporting service or sensitive error logging was introduced. Release still requires authorization.

20 September source follow-up: the installed Next 16.1.1 `getErrorRSCPayload` creates a production `__next_error__` seed with an empty body and supplies the global error component separately for the client router. This explains why changing only the visible recovery component does not address the existing no-JS fixture failure. No framework/vendor patch or false-success fallback was made. Healthy-page no-JS category/control checks in `continued-completion-20260920.md` do not supersede the runtime-failure result above.
