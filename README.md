# Freelance Evidence OS

**Paperwork doesn’t respect borders. Your evidence shouldn’t disappear between them.**

A responsive, interactive concept for a document-first workspace that connects freelance source documents, country-specific review questions and a transparent evidence trail.

**[Explore the live concept](https://dokarpov.github.io/freelance-evidence-os/)** · [Creator](https://github.com/dokarpov)

## Why it exists

Freelancers receive invoices and supporting documents through multiple channels. Before a qualified accountant can review a cross-border case, someone must establish **what the source actually says**, **what context is missing**, and **which interpretation requires confirmation**.

This is a concept of that missing evidence layer—not a tax-filing or tax-calculation service.

## Try the prototype

1. Open the [interactive demo](https://dokarpov.github.io/freelance-evidence-os/#demo).
2. Switch between Spain, Germany and France.
3. Within France, compare **micro-BNC** and **régime réel** income-tax review scenarios.
4. Open the provenance trail and download a **synthetic JSON evidence review**.

A real source document does not acquire a new VAT rate just because a user changes the country. The prototype purposely highlights uncertainty rather than inventing a tax result.

## What is real

- Responsive editorial landing page and interactive evidence-review simulation
- Scenario switching with accessible button states
- Visible unresolved fields and source references
- Locally generated sample JSON export
- No backend, API keys, sign-in or customer data

**What is not claimed:** valid tax advice, live classification, actual receipt ingestion, an integrated accountant workflow, GDPR certification, or verified demand/revenue.

## Run locally

Open `index.html`, or run `python3 -m http.server 8000` in this directory.

The site has no build step. Root-relative external dependencies are avoided, so it can run on GitHub Pages.

## Deploy to GitHub Pages

In **Settings → Pages**, choose **Deploy from a branch → main → /(root)** and save. The target URL is:

https://dokarpov.github.io/freelance-evidence-os/

If Pages is not enabled, that URL will return 404 until deployment completes.

## Structure

- `index.html` — content, accessible demo markup and SEO
- `styles.css` — responsive typography, layouts, motion and visual system
- `script.js` — synthetic review states, provenance and JSON export
- `favicon.svg`, `og-cover.svg`, `site.webmanifest` — brand and metadata
- `tests/site_check.py` — lightweight structural regression checks

## Tax references

Official reference reading (not a substitute for qualified advice):

- [EU cross-border VAT](https://europa.eu/youreurope/business/finance-and-tax/vat/cross-border-vat/index_en.htm)
- [AEAT: deductible input VAT](https://sede.agenciatributaria.gob.es/Sede/iva/que-iva-soportado-puedo-deducir/que-puedo-deducir.html)
- [BMF: Umsatzsteuer application](https://www.bundesfinanzministerium.de/Web/DE/Themen/Steuern/Steuerarten/Umsatzsteuer/Umsatzsteuer_Anwendungserlass/umsatzsteuer_anwendungserlass.html)
- [DGFiP: micro-entrepreneur actual expenses](https://www.impots.gouv.fr/professionnel/questions/je-suis-micro-entrepreneur-puis-je-deduire-des-charges)

© 2026 · Independent concept. No real client data is included.
