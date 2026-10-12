# Rilatu

**Proof should travel.**

[**Live experience**](https://dokarpov.github.io/rilatu/) · [**Try the interactive review**](https://dokarpov.github.io/rilatu/#demo) · [Source](https://github.com/dokarpov/rilatu)

Rilatu explores a missing evidence layer for freelancers working across borders: **the original document stays intact while country-specific questions, assumptions and reviewer decisions become traceable.**

## Try it

Switch the synthetic €340 invoice between Spain, Germany and France, compare the French income-tax regimes, open the provenance trail and export a sample JSON review.

The demo shows *alternative review contexts*, not three deductions. It never invents a VAT rate.

## Design and implementation

A custom kinetic editorial experience, intentionally without generic UI cards, fake metrics or claims of product-market fit.

- **Type:** one family, Archivo; no decorative italics
- **Palette:** warm paper, charcoal ink, signal vermilion; no green
- **Visual language:** drawn route lines, flying documents, provenance labels, no emoji
- **Motion:** staggered type entrance, continually travelling evidence, scroll reveals, country transitions and pointer responsiveness
- **Access:** keyboard-operable controls, reduced-motion fallback, mobile-first CSS
- **Build:** static HTML, CSS and vanilla JavaScript; no framework or build step

## Scope

Research concept only. No document upload, customer data, user account, financial backend, live classification, tax calculation or filing functionality. The tax treatment of a real expense depends on facts not supplied by the synthetic invoice and requires qualified human review.

## Files

`index.html` — editorial landing page and accessible interactive prototype  
`styles.css` — responsive design system and motion  
`script.js` — scenario switching, provenance, JSON export and accessibility  
`favicon.svg`, `og-cover.svg` — original vector brand assets  
`tests/site_check.py` — structural verification

Run locally: `python3 -m http.server 8000`.

GitHub Pages serves the repository root at [dokarpov.github.io/rilatu](https://dokarpov.github.io/rilatu/).

© 2026 · Independent product concept.
