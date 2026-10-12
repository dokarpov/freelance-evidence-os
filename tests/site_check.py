#!/usr/bin/env python3
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
h=(p/'index.html').read_text()
css=(p/'styles.css').read_text()
js=(p/'script.js').read_text()
assert all((p/n).exists() for n in ['index.html','styles.css','script.js','favicon.svg','og-cover.svg','site.webmanifest'])
ids=re.findall(r'\bid="([^"]+)"',h)
assert len(ids)==len(set(ids)), 'Duplicate IDs'
for attr in ['data-country="income"','data-country="rental"','data-country="residency"','data-record="contract"','data-record="invoice"','data-record="payment"','id="trailToggle"','id="exportButton"']:
    assert attr in h, attr
assert 'Rilatu' in h and 'https://dokarpov.github.io/rilatu/' in h
assert 'Archivo' in css and 'Instrument Serif' not in css and 'Manrope' not in css and 'Fraunces' not in css
assert not any(s in h for s in ['✳','✓','＋','●','🛫','📄'])
assert 'prefers-reduced-motion' in css and 'IntersectionObserver' in js
assert 'URL.createObjectURL' in js and 'rilatu-sample-' in js
assert 'min-width:700px' in css and 'max-width:699px' in css
assert 'not a live tax service' in h.lower()
print('PASS: Rilatu assets, mobile-first breakpoints, scenarios, evidence export, vector branding and reduced motion')

assert 'id="exportFeedback"' in h and 'aria-live="polite"' in h
assert 'Sample JSON download requested' in js
assert 'var(--route,0) * 100%' in css, 'country underline must move one tab width per index'
assert 'var(--route,0) * 300%' not in css, 'out-of-bounds country underline regression'

assert 'COMPONENT SYSTEM v1.0' in css and '--type-body' in css
assert 'max-width:1079px' in css and 'min-width:1080px' in css
assert '--tap-target:44px' in css and '--motion-slow' in css
assert 'Consistent per-group stagger' in js and 'paintScroll' in js
assert 'motionPreference' in js
for doc in ['DESIGN_SYSTEM.md','MOTION.md','QA_REPORT.md','tests/responsive.spec.js']:
    assert (p/doc).exists(), doc
print('PASS: design tokens, component freeze, tablet layout and scroll animation contract')
