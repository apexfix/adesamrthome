# Enquiry forced-color controls

Local preview only, 14 September 2026.

## Reproduced issue and change

In Chrome forced-color emulation at 320px, only the selected service had a border. Switching services changed row sizes and positions by 4px relative to the selector container. Measurements deliberately exclude upstream heading changes when the service changes.

The forced-color rule now gives every service a stable 3px system-color border, with a double border for selection and a separate dashed keyboard focus outline. Upload, submit and remove controls receive explicit system-color boundaries. Normal black/gold styles are unchanged. This respects the user's forced-color mode rather than disabling color adjustment.

## Verification

- `tests/enquiry-forced-colors.cjs`: 12 cases across Chrome/WebKit, light/dark preferences and 320/390/1440px. Selector geometry stays unchanged while cycling all five services, at both normal and 200% root font. Selection style, keyboard activation, focus outlines, upload/submit boundaries and horizontal fit checked.
- Six Chrome cases applied the forced system palette. Six WebKit cases matched the media query but did NOT apply that palette; their scope is CSS media/layout only. The JSON report records this distinction. Neither is a physical Windows accessibility-theme test.
- The narrow Chrome dark selector screenshot was visually inspected. Evidence is in `output/enquiry-forced-colors/after`.
- Existing ordinary dark-form suite: 72 cases passed after the change. Production build and diff whitespace checks passed.

## Limits

This is the enquiry control group, not full-site ACCESS-05 acceptance. Other navigation/gallery controls, real system themes, screen readers and physical devices remain open. No application content, product price, business claim or production state was changed.
