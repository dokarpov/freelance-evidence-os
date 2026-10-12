#!/usr/bin/env python3
"""Build a public static site from a private Rilatu repository.

Only explicit static assets are copied. No .git, .github, tests,
notes, scripts, or internal markdown files are published.
"""
from pathlib import Path
import os
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
FILES = (
    "index.html", "styles.css", "script.js", "rilatu-logo.svg",
    "favicon.svg", "og-cover.svg", "site.webmanifest", "robots.txt",
)
if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()
for name in FILES:
    source = ROOT / name
    if not source.is_file():
        raise SystemExit(f"Required public asset missing: {name}")
    shutil.copy2(source, DIST / name)

html = (DIST / "index.html").read_text(encoding="utf-8")
site_url = os.environ.get("PUBLIC_SITE_URL", "").strip().rstrip("/")
if site_url:
    if not site_url.startswith("https://"):
        raise SystemExit("PUBLIC_SITE_URL must be https://")
    html = html.replace("https://dokarpov.github.io/rilatu", site_url)
else:
    # A private GitHub Pages URL is not a usable canonical URL.
    html = re.sub(r'<link rel="canonical"[^>]*>\s*', "", html)
    html = re.sub(r'<meta property="og:url"[^>]*>\s*', "", html)
    html = re.sub(r'<meta property="og:image"[^>]*>\s*', "", html)
    html = html.replace('"url":"https://dokarpov.github.io/rilatu/"', '"url":""')
(DIST / "index.html").write_text(html, encoding="utf-8")

assert not (DIST / ".github").exists()
assert not (DIST / "tests").exists()
print("Rilatu static dist ready:", ", ".join(sorted(p.name for p in DIST.iterdir())))
