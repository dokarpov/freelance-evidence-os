# Rilatu

**Proof should travel.**

[Live site](https://dokarpov.github.io/rilatu/) · [Interactive demo](https://dokarpov.github.io/rilatu/#demo) · [Source](https://github.com/dokarpov/rilatu)

Rilatu is an **evidence-first research prototype** for independent professionals. Instead of generating a black-box verdict, the interface links the supporting records, shows what they can demonstrate and exposes what is still missing.

## The interactive story

The demo uses **three synthetic sources** in a single freelance work record:

1. Client agreement: Studio North, €3,200 per month, April–September 2026.
2. April invoice SN-048: €3,200 billed.
3. Matching payment reference SN-048: €3,200 received on 6 May 2026.

Users can inspect each record, then switch between **Income**, **Rental**, and **Residency** to see how different recipients ask different questions about the *same evidence*. The provenance trail explains known facts and gaps. JSON export creates only a local synthetic sample.

**Scope:** one matched payment does not prove a stable income history. None of the examples authenticates documents, confirms eligibility, advises on taxes or immigration, or guarantees a third party will accept the result. No uploads, backend, user data or real bank connections.

## Design and motion

The existing identity system is frozen in [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) and [MOTION.md](MOTION.md): Archivo, warm ivory, dark ink and vermilion; responsive editorial layout, real evidence-sheet anatomy, restrained hover/scroll motion and reduced-motion support.

The previous €340 three-country tax demo was retired because it obscured the evidence OS proposition. The new UX introduces an explicit Connect → Reuse → Explain story and purpose-based review with visible next actions.

**Logo asset status:** the existing SVG favicon/header mark is still a temporary arrow. The user approved logo concept #3 in an earlier design review, but its actual vector file is not present in this repository or the currently accessible working files. Do not invent a new mark or label the arrow final. Replace favicon, header mark and Open Graph identity only when the approved vector source has been recovered.

## Structure

- `index.html` — site and synthetic evidence journey
- `styles.css` — locked typography/layout tokens, document components and animation
- `script.js` — source inspection, purpose switching, trail, JSON export and scroll scenes
- `favicon.svg`, `og-cover.svg` — existing vectors (logo replacement pending)
- `tests/site_check.py` — structural checks
- `tests/responsive.spec.js` — Chromium interactions, indicator alignment and viewport matrix (320–1920px)
- `QA_REPORT.md` — verified tests and release gates

To preview locally: `python3 -m http.server 8765`, then open `http://127.0.0.1:8765/`.

Run structural checks: `python3 tests/site_check.py`.
Run the Playwright suite with a running local server: `npx playwright test tests/responsive.spec.js` (Chromium dependency required).

**Stage:** interactive research concept, not a production service or evidence verification engine.
