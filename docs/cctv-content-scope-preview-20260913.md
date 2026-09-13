# CCTV Content Scope Review

Status: local preview only; not deployed. This is a copy correction, not legal clearance.

The owner raised concern about offering surveillance-system advice without the relevant licence. Removed the category page's camera-view planning and local-advice sections. Removed matching site-layout, camera-position, coverage and recording-plan service invitations from camera FAQs, both product descriptions, the equipment guide and its shared article CTAs, product metadata, contact form, shared FAQ CTA, confirmation page and acknowledgement email source.

Retained equipment model specifications, existing product URLs, A$443/A$590 prices and package contents. Smart-lock services were not changed in this scoped pass. Equipment supply eligibility and the owner's actual licence status remain unverified.

Official source reviewed on 2026-09-13:
https://www.cbs.sa.gov.au/documents/licence_categories_guide_security_and_investigation_agents.pdf

Pages 5-6 describe security-system advice, supply and installation licence categories. The supply exemption refers to not attending the premises for which the system is supplied in performing that supply function. It is not blanket clearance for advice or installation, nor proof that this business qualifies. Confirm the actual operating model with CBS before relying on an exemption.

Verification: production build passed. `tests/camera-content-scope.cjs` passed 24 route/viewport/engine cases across Chrome and WebKit, covering removed text, metadata, category prices, enquiry placeholder, horizontal overflow and page errors. Email source checked without sending. Screenshots saved under `output/camera-content-scope/`; mobile category screenshot inspected. No customer enquiry submitted.

Existing unfinished header enlargement changes remain separate from this content work. No claim is made here about completion of the broader website checklist.
