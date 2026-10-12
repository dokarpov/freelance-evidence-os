#!/usr/bin/env python3
"""Static checks for the standalone product-concept site."""
from pathlib import Path
import re
root=Path(__file__).resolve().parents[1]
html=(root/"index.html").read_text()
css=(root/"styles.css").read_text()
js=(root/"script.js").read_text()
for name in ("styles.css","script.js","favicon.svg","og-cover.svg","site.webmanifest"):
    assert (root/name).exists(), f"Missing asset {name}"
ids=re.findall(r'\bid="([^"]+)"',html)
assert len(ids)==len(set(ids)), "Duplicate DOM id"
for label in ("data-country=\"es\"","data-country=\"de\"","data-country=\"fr\"","id=\"exportButton\"","id=\"trailToggle\""):
    assert label in html, f"Missing interaction: {label}"
assert "URL.createObjectURL" in js and "evidence-os-sample-" in js
assert "@media(max-width:650px)" in css
assert "prefers-reduced-motion" in css
assert "<meta name=\"description\"" in html
assert "not a live tax service" in html.lower()
print(f"PASS: {len(ids)} unique IDs; assets, responsive states, review and export present")
