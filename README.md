# Rilatu

**Proof should travel.**

[Live site](https://dokarpov.github.io/rilatu/) · [Interactive demo](https://dokarpov.github.io/rilatu/#demo) · [Source](https://github.com/dokarpov/rilatu)

Rilatu is an **evidence-first research concept** for freelancers working across borders. Keep an original document intact; make country-specific questions, missing information and reviewer reasoning traceable.

## Explore the prototype

Switch one **synthetic** €340 invoice among Spain, Germany and France. Compare French micro-BNC vs régime réel, inspect the provenance trail and export a local sample JSON record.

These are *alternative review contexts*, **not three deductions**. The demo has no uploads or backend and makes no tax calculation, eligibility determination or filing.

## Design (stable v1.0)

Archivo only · warm paper / charcoal / vermilion · editorial strokes and flight-path imagery · no green, generic cards or emoji.

- [Design system and component freeze](DESIGN_SYSTEM.md)
- [Motion patterns and reduced-motion contract](MOTION.md)
- [Responsive QA report and validation status](QA_REPORT.md)

The site includes consistent hover states, semantic stagger, scroll-linked movement, a stacked tablet workspace and legible interactive controls.

## Structure

`index.html` — website and synthetic demo  
`styles.css` — locked type/layout/component tokens, responsive styles and motion  
`script.js` — scenario switching, source trail, sample JSON export and scroll scenes  
`favicon.svg`, `og-cover.svg` — vector identity  
`tests/site_check.py` — structural validation  
`tests/responsive.spec.js` — Chromium viewport, accessibility and interaction checks

Run locally: `python3 -m http.server 8765` then visit `http://127.0.0.1:8765/`.

Run local structural checks: `python3 tests/site_check.py`.
GitHub Actions also runs a Playwright Chromium matrix at 320, 375, 390, 768, 1024 and 1440px.

**Stage:** interactive research prototype. Not tax, legal or accounting advice. No claims of validated demand or PMF.

© 2026 · Independent product concept.
