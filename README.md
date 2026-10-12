# Freelance Evidence OS

**Paperwork doesn't respect borders. Proof should travel with it.**

[**Live experience**](https://dokarpov.github.io/freelance-evidence-os/) · [Interactive demo](https://dokarpov.github.io/freelance-evidence-os/#demo) · [Creator](https://github.com/dokarpov)

An animated, interactive product concept for keeping freelance documents, country-specific questions and human review traceable.

## What to explore

- A kinetic document journey: evidence in flight, country-agnostic source preserved.
- Spain / Germany / France review contexts with animated route transitions.
- French micro-BNC / real-regime comparison.
- Decision provenance and a downloadable synthetic JSON review.
- Responsive editorial interface with vector details, keyboard controls, and reduced-motion support.

## Product boundary

This is a **concept and synthetic demo**, not a functioning tax system. No receipt upload, account, database, tax computation, filing, or compliant storage is provided. The sample never invents a VAT deduction or treats one expense as simultaneously deductible in three countries.

## Technical notes

Static HTML, CSS, JavaScript. No JS framework, runtime dependency, animation library or build step. Styles use two typefaces (Manrope and Instrument Serif), vector-only marks, CSS keyframe choreography, IntersectionObserver reveal, and pointer motion only for fine pointers.

- `index.html`: narrative, accessible controls and SEO
- `styles.css`: responsive layout, design tokens, bespoke animation
- `script.js`: review scenarios and downloadable synthetic evidence
- `tests/site_check.py`: lightweight structural tests

To run locally: `python3 -m http.server 8000`

[Live site](https://dokarpov.github.io/freelance-evidence-os/) · [GitHub Pages setup](https://github.com/dokarpov/freelance-evidence-os/settings/pages)

_2026 · Independent concept. No real user financial data._
