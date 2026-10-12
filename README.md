# Rilatu

**Proof should travel.**

An evidence-integrity research concept for people who need to share a defensible claim without handing over every original document.

[Product website](https://dokarpov.github.io/rilatu/) · [Try the evidence lifecycle](https://dokarpov.github.io/rilatu/demo.html)

## What the demo shows

A freelancer needs to demonstrate one matched payment to a landlord. The guided scenario follows three user decisions:

1. **Connect:** inspect a synthetic agreement, invoice and matched payment; distinguish the fact each one supports from the assumption it cannot establish.
2. **Issue:** preview a recipient-bound claim containing selected information rather than entire source files.
3. **Verify:** run a simulated status check, reverse the supporting payment and see the claim become stale when checked again.

This is a **browser simulation of product logic**, not the actual cryptographic implementation. It contains no signing keys, bank connections, real document verification or private evidence records. It does not certify continuous income or recipient acceptance.

The separately maintained private product engineering experiments cover signed selective-disclosure attestations, source revisions and persistent invalidation. Their private source is not published here.

## Website structure

- `index.html` — concise product proposition and scenario entry
- `demo.html`, `demo.css`, `demo.js` — the interactive, synthetic proof lifecycle
- `styles.css`, `proof-preview.css` — landing design system and product preview
- `rilatu-logo.svg`, `favicon.svg`, `og-cover.svg` — geometric vector identity
- `tests/proof-lifecycle.spec.js` — responsive end-to-end acceptance suite
- `scripts/build_site.py` — allowlisted static deployment

Run `python3 -m http.server 8765` to preview locally. CI runs structural checks, JavaScript syntax and Playwright acceptance tests across eight widths.

**Status:** exploratory prototype. The website makes no claim of production use, issuer trust, patent novelty or product–market fit.
