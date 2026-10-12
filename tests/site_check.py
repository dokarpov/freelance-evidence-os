#!/usr/bin/env python3
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
h=(p/'index.html').read_text()
css=(p/'styles.css').read_text()
js=(p/'script.js').read_text()
assert all((p/n).exists() for n in ['index.html','styles.css','script.js','rilatu-logo.svg','favicon.svg','og-cover.svg','site.webmanifest'])
ids=re.findall(r'\bid="([^"]+)"',h)
assert len(ids)==len(set(ids)), 'Duplicate IDs'
for attr in ['data-country="income"','data-country="rental"','data-country="residency"','data-record="contract"','data-record="invoice"','data-record="payment"','id="trailToggle"','id="exportButton"']:
    assert attr in h, attr
assert 'Rilatu' in h and 'src="rilatu-logo.svg' in h
assert 'Archivo' in css and 'Instrument Serif' not in css and 'Manrope' not in css and 'Fraunces' not in css
assert not any(s in h for s in ['✳','✓','＋','●','🛫','📄'])
assert 'prefers-reduced-motion' in css and 'IntersectionObserver' in js
assert 'URL.createObjectURL' in js and 'rilatu-sample-' in js
assert 'min-width:700px' in css and 'max-width:699px' in css
assert 'not a document verification service' in h.lower()
print('PASS: Rilatu assets, purpose-based evidence scenarios, export and reduced motion')

assert 'id="exportFeedback"' in h and 'aria-live="polite"' in h
assert 'Sample JSON download requested' in js
assert 'var(--route,0) * 100%' in css, 'selector underline must move one item per index'
assert 'var(--route,0) * 300%' not in css, 'out-of-bounds selector underline regression'

assert 'COMPONENT SYSTEM v1.0' in css and '--type-body' in css
assert 'max-width:1079px' in css and 'min-width:1080px' in css
assert '--tap-target:44px' in css and '--motion-slow' in css
assert 'Consistent per-group stagger' in js and 'paintScroll' in js
assert 'motionPreference' in js
for doc in ['DESIGN_SYSTEM.md','MOTION.md','QA_REPORT.md','tests/responsive.spec.js']:
    assert (p/doc).exists(), doc
print('PASS: design tokens, component freeze, tablet layout and scroll animation contract')

assert 'id="recordInspector"' in h and 'id="trailGap"' in h
assert 'id="stepTitle"' in h and 'id="demoNext"' in h and 'class="guided-progress"' in h
assert 'LINKED EVIDENCE v1.2' in css
assert 'requires-independent-review' in js and 'independently_verified:false' in js
assert 'country\u2014tax' not in h
print('PASS: connected-source reviewer journey, simulated rather than certified outputs')

assert 'github.com/dokarpov/rilatu' not in h, 'do not publicize private source repository'
assert '<svg class="mark"' not in h, 'old placeholder mark must stay retired'
logo=(p/'rilatu-logo.svg').read_text()
assert 'fill-rule="evenodd"' in logo and 'viewBox="0 0 760 216"' in logo, 'approved wordmark must use vector outlines'
assert 'scripts/build_site.py' and (p/'scripts/build_site.py').exists()
print('PASS: approved vector wordmark, no public repository link, private-to-public build script')

# Exact path simplicity contract for the approved geometric wordmark.
assert (p/'rilatu-logo.svg').read_text().count('<path') == 8, 'wordmark uses exactly eight shape paths'
assert len((p/'rilatu-logo.svg').read_text()) < 1800, 'wordmark contains unnecessary traced contour points'
assert ' C' in (p/'rilatu-logo.svg').read_text(), 'logo must use cubic Bezier curves'
print('PASS: minimal geometric Bezier identity')
