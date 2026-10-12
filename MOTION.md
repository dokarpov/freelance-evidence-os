# Rilatu motion system — v1.0 (locked)

The metaphor is **a continuing trail of evidence**. Movement must clarify relationships or hierarchy, not create a carnival.

## Motion tokens
| Token | Duration | Use |
|---|---|---|
| `--motion-fast` | 180ms | link/color confirmation |
| `--motion-mid` | 380ms | hover lift, arrow travel, selection |
| `--motion-slow` | 760ms | editorial movement |
| `--motion-ease` | cubic-bezier(.22,1,.36,1) | gentle settle |
| `--motion-entrance` | cubic-bezier(.16,1,.3,1) | content reveal |

## Behaviors
- **Hover:** links move 3px; record sheet elevates slightly without altering document facts; question rows move 12px; steps rise 7px. Hover is never essential to understand or operate a feature.
- **Content entrance:** opacity 0 → 1 and Y 24px → 0, once per section, stagger 85ms across semantic siblings. Every item remains in the document and readable without JS.
- **Scroll-linked:** requestAnimationFrame + passive scroll observer; map the visible scene progress to restrained CSS custom properties: hero shift max ~12px, route vector max ~24px, handoff route max ~16px, statement line and closing heading max ~45px. No scroll hijacking, pinned panels or wheel interception.
- **Ambient motion:** existing flight-path and document movements stay on their current timing; no extra competing loops.
- **Purpose switching:** animated underline (one own-width per index); purpose/review facts and next actions switch coherently; connected source sheets remain unchanged. Evidence trail toggles separately.
- **Reduction:** `prefers-reduced-motion:reduce` disables entrance/parallax/hover motion and leaves all informational content fully visible; JS listens for runtime preference changes.

## Implementation
CSS definitions live in `styles.css`. The observer/parallax runtime lives in `script.js`. Do not insert competing animation libraries or per-component timings.

## Performance/accessibility checks
- Update scroll values in one animation frame only while each scene is visible.
- Preserve layout geometry; animate transforms/translate and opacity, not width/height.
- Don't block anchors, tab focus, input, country switching, or download actions behind transitions.
- Check at 320, 375, 390, 768, 1024, 1440px. Reduced motion and keyboard activation are mandatory.

## Evidence-specific motion v1.2
- **Connect → Reuse → Explain:** three small staggered content entrances, 110ms interval after section becomes visible; no artificial autoplay that changes user choices.
- **Source inspection:** paper-edge accent and restrained lift on hover. Click updates the factual inspector message without moving the record stack or obscuring text.
- **Purpose change:** selected-tab underline and a brief review-panel transition with a subtle source-edge emphasis; all review labels, status and missing evidence update synchronously.
- **Guardrails:** no scroll blocking, no cloned document illustrations that imply forged records, no hover-only critical information. Reduced motion disables entrance, parallax, pulse and transitions.

## Guided interaction rules v2.0
Only real buttons and links respond to hover; information-only question rows, orientation text and process steps remain visually stable. Purpose choice moves to source inspection, explicit Next moves to review, and Back remains predictable. No pointer-follow parallax on non-interactive hero art. Reduced-motion keeps all three guided stages legible and does not remove the active selection state. Interactive states must survive rapid click, keyboard, resize and refresh without geometry errors.
