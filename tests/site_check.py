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
for attr in ['data-country="es"','data-country="de"','data-country="fr"','data-regime="micro"','data-regime="real"','id="trailToggle"','id="exportButton"']:
    assert attr in h, attr
assert 'Rilatu' in h and 'https://dokarpov.github.io/rilatu/' in h
assert 'Archivo' in css and 'Instrument Serif' not in css and 'Manrope' not in css and 'Fraunces' not in css
assert not any(s in h for s in ['✳','✓','＋','●','🛫','📄'])
assert 'prefers-reduced-motion' in css and 'IntersectionObserver' in js
assert 'URL.createObjectURL' in js and 'rilatu-demo-' in js
assert 'min-width:700px' in css and 'max-width:699px' in css
assert 'not a live tax service' in h.lower()
print('PASS: Rilatu assets, mobile-first breakpoints, scenarios, evidence export, vector branding and reduced motion')
