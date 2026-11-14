#!/bin/bash
# Render the PNG app icons from the SVG sources with headless Chrome, which draws
# SVG gradients and paths correctly (ImageMagick's built-in SVG renderer does not).
# Run from the repo root:  bash words-src/build/icons/render.sh
set -euo pipefail

CHROME="${CHROME:-/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta}"
[ -x "$CHROME" ] || CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=static/words/icons
FULL=words-src/build/icons/full-bleed.svg
TMP=$(mktemp -d)

render() { # svg size output
  printf '<!doctype html><style>html,body{margin:0;background:transparent}img{display:block;width:%spx;height:%spx}</style><img src="file://%s">' \
    "$2" "$2" "$PWD/$1" > "$TMP/page.html"
  "$CHROME" --headless --disable-gpu --hide-scrollbars --default-background-color=00000000 \
    --force-device-scale-factor=1 --window-size="$2,$2" \
    --screenshot="$PWD/$3" "file://$TMP/page.html" 2>/dev/null
  echo "wrote $3"
}

render "$OUT/icon.svg" 512 "$OUT/icon-512.png"
render "$OUT/icon.svg" 192 "$OUT/icon-192.png"
render "$FULL" 512 "$OUT/maskable-512.png"
render "$FULL" 180 "$OUT/apple-touch-icon.png"
rm -rf "$TMP"
