#!/usr/bin/env python3
from pathlib import Path
import re
p=Path(__file__).resolve().parents[1]
h=(p/'index.html').read_text()
d=(p/'demo.html').read_text()
js=(p/'demo.js').read_text()
css=(p/'demo.css').read_text()
for file in ['index.html','styles.css','proof-preview.css','demo.html','demo.css','demo.js','rilatu-logo.svg','favicon.svg','og-cover.svg','site.webmanifest']:
    assert (p/file).exists(),file
for source in [h,d]:
    ids=re.findall(r'\bid="([^"]+)"',source)
    assert len(ids)==len(set(ids)), 'duplicate element IDs'
assert 'href="demo.html"' in h and 'class="proof-story"' in h
assert 'legacy-demo' not in h and 'trailToggle' not in h
assert 'github.com/dokarpov/rilatu' not in h
for key in ['contract','invoice','payment']:
    assert f'data-source="{key}"' in d
for attr in ['id="reversePayment"','id="verifyNow"','id="restart"']:
    assert attr in d
assert 'STALE / DO NOT RELY' in js and 'CURRENT / SIMULATED' in js
assert 'SIMULATED ATTESTATION' in d and 'NOT CRYPTOGRAPHICALLY SIGNED' in d
assert 'prefers-reduced-motion' in css
logo=(p/'rilatu-logo.svg').read_text()
assert logo.count('<path')==8 and len(logo)<1800
print('PASS: evidence lifecycle, clear simulation limits, vector branding, and public site assets')
