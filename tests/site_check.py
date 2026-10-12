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

# Design-system regressions
assert "Manrope" in html and "Instrument+Serif" in html, "Expected exactly two web-font families"
assert "Space+Mono" not in html and "DM+Sans" not in html
assert not any(symbol in html for symbol in ("✳", "✓", "＋", "●")), "Use vector marks rather than emoji-like glyphs"
assert not any(symbol in js for symbol in ("✳", "✓", "＋", "●")), "Do not inject pictograms at runtime"
assert "flight-field" in html and "paper-flight-a" in css
assert "IntersectionObserver" in js and "prefers-reduced-motion" in css
assert "@media(max-width:550px)" in css and ".country span.mono{display:none}" in css
print("PASS: motion system, vector iconography, and mobile country switcher")
