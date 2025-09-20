#!/bin/bash

# This script uses Chrome's headless mode to capture the og-image
# Make sure dev server is running first: npm run dev

echo "Capturing og-image..."

# Use Chrome in headless mode to capture screenshot
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --headless \
  --disable-gpu \
  --screenshot=example/dist/og-image.png \
  --window-size=1200,630 \
  --default-background-color=0 \
  http://localhost:5173/og-image

echo "✅ Saved to example/dist/og-image.png"