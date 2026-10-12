# Rilatu design system — v1.0 (locked)

This is the approved source of truth for the *existing* visual direction. Improvements should fix defects and improve usability **without** introducing a second type family, drifting from the user-approved brighter orange, decorating UI with generic cards, or replacing the approved vector wordmark.

## Foundations
- Typeface: **Archivo** only, weights 400/500/600/700/800/900; fallback Arial, sans-serif. No decorative italics.
- Colors (CSS variables): paper `#fffaf6`, off-white `#fffefa`, ink `#21201e`, secondary `#706960`, hairlines `#d8d0c5`, bright orange `#ff8048`, dark surface `#211f1d`.
- Editorial layout: horizontal rules, generous whitespace, genuine document surfaces, route drawings; no shadow-card grids.
- Container: mobile 28–36px total horizontal gutter, tablet 64px, desktop up to 1400px.
- Breakpoints: **320–699px mobile**, **700–1079px tablet**, **1080px+ desktop**. No fixed-width documents overflowing small screens.

## Type tokens
Defined in `styles.css` at `COMPONENT SYSTEM v1.0`.

| Token | Size | Use |
|---|---|---|
| `--type-xs` | 11–12px | metadata only, with readable contrast |
| `--type-sm` | 13–14px | compact buttons, labels, prototype details |
| `--type-body` | 15–17px | body, descriptive text, FAQ |
| `--type-lead` | 18–22px | introductory body |
| Display rules | fluid clamp | marketing headings; never crop intentional copy |

Small printed text on decorative *mock documents* is allowed; functional controls and actual interpretation text must use the accessible token minimums. Text may wrap naturally. Avoid all-caps for body copy.

## Component catalogue
- **Site header**: path-based `rilatu-logo.svg` in the approved lettering; one CTA; sparse navigation. Favicon is a crop of the same original letter shape.
- **Hero**: 3-line statement and SVG/document flight artwork; existing tone, no generic screenshots.
- **Section index**: numeral + descriptor, consistent letter-spacing and color.
- **Question rows**: static editorial rules and labels, never hover, translate or imply clickability.
- **Workspace**: three connected synthetic source sheets and a purpose-specific evidence review. Mobile/tablet = one column; full desktop = two. Source values are immutable as purpose changes.
- **Purpose selector**: three real buttons (Income / Rental / Residency), `aria-pressed`, 44px minimum target, synchronized review content and animated underline.
- **Record inspector / evidence trail / export**: preserve keyboard operation, selected state, readable provenance, clear limits of verification and status announcements. Do not introduce a tax regime selector or claim official acceptance.
- **Steps and FAQ**: noninteractive steps remain still; FAQ uses native clickable details/summary.
- **Closing CTA**: uses the brighter approved orange palette with legible foreground text.

## Stable rules
1. Do not alter this palette, type family, logo or component anatomy without a specific visual review and explicit approval.
2. Add UI using existing tokens first; avoid hard-coded sizes/colors unless illustrating synthetic paperwork.
3. Every new component must be inspected at 320, 375, 390, 768, 1024 and 1440px, including long text.
4. Never hide broken layouts with clipping of functional controls.
5. Interactions must be accessible by keyboard; `prefers-reduced-motion` must show all content without animations.
6. Claims, tax interpretations and demo boundaries must stay factual and explicitly labelled synthetic.

This freeze stabilizes the system, **not** defects: accessibility, layout or functionality fixes are still permitted.

## Evidence interaction v1.2
- A narrative sequence opens the workspace: Connect → Reuse → Explain. These are clear reading cues, not autonomous scrolling controls.
- Each selected record shows a visible paper-edge accent; the inspector explains the record's exact contribution and limits.
- Each selected purpose updates the review label, headline, facts, checks, missing evidence and next action as a single coherent state.
- The indicator remains inside the three-tab row and tracks precisely the selected tab (100% of its own width per step, no arbitrary offsets).
- The review must never claim that one matching payment proves continuous income, official authenticity, immigration eligibility or rental acceptance.
- Maintain the same color/type/spacing foundations. Do not rebrand the site or replace an approved logo with a guessed one.

## Guided demonstration v2.0
The demo uses a three-step progressive flow: **Choose → Inspect → Review**. Only one decision is visible at a time, while the underlying source facts remain unchanged. Active controls must have a distinct outcome. No hover, translation, underline or pointer affordance may imply clickability on static editorial rows or explanations. Use bright orange `#ff8048` against cleaner warm paper `#fffaf6` (dark ink stays primary for small text). Product motion changes state, not merely appearance. Navigation CTAs must not duplicate destinations or publicly expose repository links.

## Approved identity (2026-10-12)
The user's supplied raster was traced into a real vector-outline `rilatu-logo.svg` (no embedded bitmap and no font dependency). The header, `favicon.svg` and `og-cover.svg` share this lettering. Do not resurrect the old arrow SVG. Public source links are forbidden on the website. A private GitHub repository and public compiled site have separate access rules.

## Geometric vector simplification
The approved `rilatu.` identity uses **8 glyph/subglyph outline paths** composed from deliberate straight segments and cubic Bézier curves; no traced pixel-staircase contours or font dependencies. `favicon.svg` shares the exact `r` outline; `og-cover.svg` uses the same glyph paths. Keep the original width, silhouette, and geometric rhythm at mobile header size.
