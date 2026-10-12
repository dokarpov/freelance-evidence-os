# Responsive and design QA — 2026-10-12

## Source-level defects identified
- Prototype uses text as small as 7–12px even in controls and interpretation details.
- 700px breakpoint forces a desktop-like two-column invoice/review surface into a narrow tablet.
- Only one-time reveal and ambient motion; little real scroll-contingent motion.
- Different CTA/hover transitions make the interface feel inconsistent.
- Tiny phones need a deliberate text/content rhythm rather than broad shrinking.

## Remediation committed
- Locked type, spacing, breakpoints, components and motion tokens in the existing palette.
- Mobile 320–699, tablet 700–1079, desktop 1080+; tablet document viewer remains stacked.
- Increased body, prototype field and actionable type sizes; minimum 44px targets.
- Coordinated hover behavior and scroll-linked document route / method / statement / closing motions.
- Semantic-group stagger and full reduced-motion escape; original synthetic scenarios remain untouched.
- Added automated multi-viewport interaction and layout tests in `tests/responsive.spec.js`.

## Validation protocol
`python3 tests/site_check.py` — structural checks. CI runs Playwright Chromium for 320/375/390/768/1024/1440 widths to check viewport overflow, hero text cropping, interactive content, country/regime switching, trail, export and reduced motion. A full-page PNG at each width is uploaded as a workflow artifact for manual visual comparison.

**Verification status:** updates and regression suite are checked into the GitHub working tree. This document does **not** claim that a real-device screenshot comparison or a full cross-browser visual review has passed. Review the latest GitHub Actions output and confirm on Safari/iOS before marking visual QA complete.


## Blocking regression: country underline (2026-10-12)
- User-provided 1360×696 screenshot: Germany is the active jurisdiction, France is hovered, and the coral underline escapes to the far right of the country selector.
- **Root cause (confirmed in CSS):** indicator is one-third of selector width, yet its horizontal translation multiplied the country index by 300% of the indicator width. This made Germany (index 1) move a whole selector width, outside the control. Correct translation is 100% of the indicator's own width per index.
- **Fix:** selector underline translation now uses 100% per step; mobile tab gaps removed for exact thirds; reduced-motion turns off the underline transition. No visual-system rebrand.
- **Regression coverage committed:** country/panel/ARIA/underline geometry at 320, 375, 390, 768, 1024, 1360, 1440 and 1920px; France hover while Germany selected; repeated / rapid switches; resize, scroll, keyboard, reload, France regime and reduced motion. Test suite is checked in, **but passing CI results are not yet independently confirmed**.
- **Live-browser spot check:** Published page visually passed the Germany→France hover case, France selection, and several switching sequences on a desktop-sized viewport. Mobile viewport and per-pixel measurements were not available in that live browser, and should not be treated as tested.
- **Release gate:** require the committed Playwright matrix to pass on CI and inspect screenshots on phone/tablet and Safari/iOS before claiming comprehensive cross-device QA.

## Change control
System documented in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md), timings and scene contract in [MOTION.md](MOTION.md). Future feature work should not silently change the identity or components.
