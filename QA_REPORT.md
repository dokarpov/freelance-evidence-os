# Rilatu quality audit — 12 October 2026

## Why the former demo was replaced
The original €340 invoice moving through Spain/Germany/France was difficult to understand as a Freelancer Evidence OS product and implied a tax comparison before the core problem was visible.

**New demonstration:** one agreement, one billed month and one matching bank record; click any source, select Income / Rental / Residency, inspect the exact missing evidence, open the provenance trail, and optionally export synthetic JSON. The source data never changes when the purpose changes.

## Interaction and presentation
- Shared document anatomy, typography and motion tokens remain in the existing Archivo/paper/charcoal/vermilion design system.
- First-scroll Connect → Reuse → Explain editorial story; staggered reveals with reduced-motion fallback.
- On record hover: restrained translation, better contrast and visible selected-record state; on click: inspect its factual meaning.
- Purpose selector: synchronized accessible pressed state, title, known facts, requirements, next steps and indicator.
- Purpose-change animation and subtle active-source pulse; text remains readable and controls remain operable during motion.
- No misleading automatic eligibility, tax or authenticity claims. The status explicitly reads **Linked, not certified**.

## Previously reported underline bug
The source CSS used an indicator that was 1/3 of its three-tab container but translated it by 300% of its *own* width per index, causing Germany's indicator to escape the selector. Fixed to 100% per index; mobile selector gaps removed. This correction also applies to the new purpose tabs.

A live-browser spot-check of the **intermediate former tax demo** verified the underline stays aligned through Spain/Germany/France and French regime switching at desktop size. That browser check **does not validate** the subsequently rewritten linked-evidence demo.

## Test coverage committed
`tests/responsive.spec.js` covers 320, 375, 390, 768, 1024, 1360, 1440 and 1920px; overflow, minimum control sizes, source invariance, purpose-state geometry, record inspection, trail, rapid interactions, resize, keyboard, reload, export and reduced motion.

`tests/site_check.py` checks source structure, documented design/motion tokens, scenario markup and synthetic data restrictions.

**Verification status:** source changes and tests have been pushed to the GitHub main branch. The new end-to-end Chromium suite has **not been independently run to completion in this session**. No claim is made that all mobile and cross-browser viewports pass. The full matrix, Safari/iOS and screenshots are release gates.

## Logo
The selected **logo #3** source/vector has not been recovered from the available repository or conversation working directory. The old header/fav SVG remains, and cannot truthfully be presented as the approved final vector. Replacement is pending receipt or recovery of that exact asset; do not improvise a new identity.

## Regression policy
Any change to purpose controls, indicator, record components, motion or typography must pass the full viewport/interaction suite and a visual review at 375, 768, 1360 and 1920px. A CSS-only patch that suppresses visible overflow without correcting alignment is not acceptable.
