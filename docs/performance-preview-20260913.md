# Performance and sequential hero loading

Chapter 24, local preview only. This is not a field-performance, SEO ranking, production or whole-package acceptance claim.

## Implementation

The first hero image uses Next 16.1.1's `preload` API, without combining legacy `priority`, explicit high fetch priority or lazy loading. The installed `get-img-props.js` confirms that `preload` disables lazy loading and emits preload metadata. The remaining images have low fetch priority and mount only when their predecessor is ready, unless explicitly requested by the visitor. A manually loaded slide stays mounted. Failed primary and fallback images advance readiness to the existing text fallback rather than permanently blocking later slides.

Content stays V5 MAX A$1,350, X9 A$699, then the A$443 Dahua 5MP two-camera/recorder equipment kit. No price, service, gallery, metadata, layout, dependency or release configuration changes. This loading change adds no animation library. It does not prove the entire redesign's incremental JavaScript budget.

## Reproducible Lab

Run `node tests/performance-lab.cjs <label>` against the production-built preview on port 6650. The baseline was recorded from commit `3026e3c`; the follow-up includes the loading change above. Both used Chrome 152.0.7977.84, fresh contexts, disabled browser cache, blocked service workers and the existing local server image cache. No other browser suites ran during follow-up measurement.

- Mobile: 390 x 844, DPR 2, touch/mobile emulation. Desktop: 1440 x 1000, DPR 1.
- Network: 150ms latency, 200,000 bytes/s download, 93,750 bytes/s upload; CPU slowdown 4x.
- Three repetitions per route/profile, 18 runs per batch, observing eight seconds after navigation commit.
- LCP from PerformanceObserver; CLS uses maximum session-window aggregation, excludes recent-input shifts. Long-task excess is diagnostic, not Lighthouse TBT. No interactions means no INP measurement.
- Resource totals count completed CDP transfers inside the window, not all lifetime page traffic. The report's `pendingRequests` field means no loading-finished event was recorded; it can include unfinished or failed requests and is not proof of a live network operation.

LCP milliseconds, median (minimum-max):

| Profile / page | Baseline | Sequential loading | Follow-up CLS median |
| --- | --- | --- | --- |
| Mobile home | 1528 (1352-1700) | 1444 (1416-1696) | 0.001146 |
| Mobile products | 1180 (1152-1180) | 1208 (1208-1212) | 0 |
| Mobile V5 MAX | 1300 (1292-1308) | 1300 (1256-1416) | 0 |
| Desktop home | 1392 (1320-1512) | 1428 (1384-1432) | 0.000408 |
| Desktop products | 1700 (1648-1736) | 1704 (1652-1704) | 0 |
| Desktop V5 MAX | 1300 (1276-1304) | 1288 (1272-1312) | 0 |

No consistent speed gain is established: home ranges overlap, and unchanged pages also vary. The verified improvement is deterministic sequential loading and direct-selection bypass, not a measured production conversion or speed increase. Follow-up completed-transfer medians: mobile home 377,606 bytes, catalogue 285,359, V5 341,537; desktop home 431,725, catalogue 377,979, V5 356,989.

Sampled LCP candidates were the hero image on home, introductory text on mobile catalogue, an OLA product image on desktop catalogue and the main photo on V5 MAX. First repetitions recorded 4,734 bytes for the optimized hero image, 2,708 for the desktop catalogue LCP image and 10,019 for V5's optimized main image. These are transferred optimized responses, not original asset sizes or all-image totals. No web-font resources were observed. Home uses one image preload and no explicit high-priority image attribute; product detail retains its one explicit high-priority main image.

Raw generated evidence, intentionally outside the commit:

- `output/performance-verification/baseline/report.json`
- `output/performance-verification/sequential-loading/report.json`
- First-repetition desktop/mobile screenshots beside each report.
- `output/hero-verification/loading-results.json`

## Behavioral Verification

- New real-Next browser test: six cases across Chromium/WebKit. Holds the first image until hydration, verifies a single preload/non-lazy first image, holds X9 to prevent background CCTV loading, checks direct CCTV selection and persistence, and aborts both X9/fallback without blocking CCTV or enquiry links.
- Existing interaction suite passed both engines: timer, pause/play, focus, visibility, reduced effects, rapid selection and synthetic swipe behavior.
- Existing failure suite passed eight cases: slow image, broken image, broken fallback and no JavaScript across both engines.
- Existing layout suite passed 54 combinations: nine viewports, three slides, Chromium/WebKit; no horizontal overflow or missing next-section hint. Follow-up mobile home and desktop CCTV screenshots were visually inspected.
- Eight pure carousel state tests passed. Focused ESLint and production build passed.

## Remaining Scope

Production cold-origin/CDN behavior, real-user p75 LCP/INP/CLS, physical devices and incremental motion-JS gzip attribution remain unverified. Current V5 gallery still references 13 Shopify images in `src/lib/localProducts.ts`; the local V5 folder contains installation photos, not local copies of those exact gallery sources. The warm local image cache cannot establish independence from that origin. Localizing appropriate source assets and verifying their failure behavior remains a separate next action. Catalogue below-fold image traffic, longer-session shifts, complete API failure behavior and full-package acceptance also remain open. No production deployment or real enquiry was performed.

Subsequent source-inventory correction: the lab observed 13 V5 image requests, but the configured gallery contains 18 images. All 18 were subsequently localized in the separate `v5-local-images-preview-20260913.md` batch. The measurements above predate that migration and must not be reused as post-migration performance evidence.
