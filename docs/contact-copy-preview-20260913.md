# Contact Copy Fallback

Status: local preview only; chapter 09 contact fallback implemented for the shared footer and enquiry sidebar.

Phone and email remain native links with visible, selectable contact details. Each now has a 48px icon copy control with hover/keyboard tooltip and live status. Values come from the shared business configuration. Clipboard success is reported only after writeText resolves; missing API and permission rejection produce an error indicator/status, with retry available. Pending calls are guarded against duplicates and late results do not update an unmounted component. No copy control claims to detect whether an SMS/email app exists.

Server-rendered copy buttons remain disabled until enhancement; no-JS visitors retain the original readable contact links. Native application handlers are not opened by the copy control. No analytics, contact submission, permissions request or new dependency was introduced.

Evidence:
- Production build and focused ESLint passed.
- `tests/contact-copy-browser.cjs`: 24 layouts across Chrome/WebKit, four widths, normal/root-font-200%/no-JS; four stable 48px targets per contact page, tooltip horizontal containment and readable footer details. Two grouped clipboard flows exercise sidebar and footer phone/email values, pending calls, duplicate prevention, denial/retry, absent API and SPA navigation during an unresolved copy. Clipboard is mocked; the user's actual clipboard was not touched.
- `tests/enquiry-nojs-browser.cjs`: all 44 cases passed after integrating copy controls.
- `tests/mobile-dock-clearance.cjs`: 72 route cases and 18 focus layouts passed after integrating copy controls.
- Mobile footer screenshot inspected in `output/contact-copy/chromium-footer.png`; remaining evidence in the same directory.

Limits: native OS clipboard permission dialogs/handlers and physical screen-reader behavior are not certified by the mocked tests. Whole-site redesign and release acceptance remain open.
