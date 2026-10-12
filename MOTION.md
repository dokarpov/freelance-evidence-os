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
- **Hover:** links move 3px; source paper scales 1.035 with a slight rotation; question rows move 12px; steps rise 7px. Hover is never essential to understand or operate a feature.
- **Content entrance:** opacity 0 → 1 and Y 24px → 0, once per section, stagger 85ms across semantic siblings. Every item remains in the document and readable without JS.
- **Scroll-linked:** requestAnimationFrame + passive scroll observer; map the visible scene progress to restrained CSS custom properties: hero shift max ~12px, route vector max ~24px, handoff route max ~16px, statement line and closing heading max ~45px. No scroll hijacking, pinned panels or wheel interception.
- **Ambient motion:** existing flight-path and document movements stay on their current timing; no extra competing loops.
- **Country switching:** animated underline; dynamic text switches as a coherent single panel. Evidence trail toggles separately.
- **Reduction:** `prefers-reduced-motion:reduce` disables entrance/parallax/hover motion and leaves all informational content fully visible; JS listens for runtime preference changes.

## Implementation
CSS definitions live in `styles.css`. The observer/parallax runtime lives in `script.js`. Do not insert competing animation libraries or per-component timings.

## Performance/accessibility checks
- Update scroll values in one animation frame only while each scene is visible.
- Preserve layout geometry; animate transforms/translate and opacity, not width/height.
- Don't block anchors, tab focus, input, country switching, or download actions behind transitions.
- Check at 320, 375, 390, 768, 1024, 1440px. Reduced motion and keyboard activation are mandatory.
