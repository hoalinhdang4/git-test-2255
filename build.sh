#!/bin/bash

echo "========================================"
echo "  Building Production Version"
echo "========================================"
echo ""

# Create dist directory
if [ -d "dist" ]; then
    echo "[CLEAN] Removing old dist folder..."
    rm -rf dist
fi

echo "[CREATE] Creating dist folder..."
mkdir -p dist/public/js
mkdir -p dist/public/styles
mkdir -p dist/public/meta
mkdir -p dist/public/fonts

# Check if dependencies are installed
if ! command -v terser &> /dev/null; then
    echo "[ERROR] Terser not found! Installing..."
    npm install -g terser
fi

if ! command -v javascript-obfuscator &> /dev/null; then
    echo "[ERROR] javascript-obfuscator not found! Installing..."
    npm install -g javascript-obfuscator
fi

echo ""
echo "========================================"
echo "  Step 1: Obfuscating JavaScript"
echo "========================================"
echo ""

echo "[1/4] Obfuscating config.js..."
javascript-obfuscator public/js/config.js --output dist/public/js/config.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true

echo "[2/4] Obfuscating utils.js..."
javascript-obfuscator public/js/utils.js --output dist/public/js/utils.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64 --unicode-escape-sequence true

echo "[3/4] Obfuscating modal.js..."
javascript-obfuscator public/js/modal.js --output dist/public/js/modal.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64

echo "[4/4] Obfuscating app.js..."
javascript-obfuscator public/js/app.js --output dist/public/js/app.js --compact true --control-flow-flattening true --dead-code-injection true --string-array true --string-array-encoding base64

echo ""
echo "========================================"
echo "  Step 2: Copying CSS"
echo "========================================"
echo ""

echo "[CSS] Copying CSS files..."
cp public/styles/*.css dist/public/styles/

echo ""
echo "========================================"
echo "  Step 3: Copying Assets"
echo "========================================"
echo ""

echo "[COPY] Copying images..."
cp public/*.{png,jpg,gif,svg} dist/public/ 2>/dev/null || :

echo "[COPY] Copying meta folder..."
cp -r public/meta/* dist/public/meta/ 2>/dev/null || :

echo "[COPY] Copying fonts..."
if [ -d "public/fonts" ]; then
    cp -r public/fonts/* dist/public/fonts/ 2>/dev/null || :
fi

echo "[COPY] Copying other files..."
cp public/robots.txt dist/public/ 2>/dev/null || :

echo ""
echo "========================================"
echo "  Step 4: Copying HTML Files"
echo "========================================"
echo ""

echo "[HTML] Copying HTML files..."
cp required.html dist/required.html
cp index.html dist/index.html

echo ""
echo "[VERCEL] Copying Vercel config..."
cp dist-vercel.json dist/vercel.json

echo ""
echo "========================================"
echo "  Build Complete!"
echo "========================================"
echo ""
echo "Production files are ready in: dist/"
echo ""
echo "Folder structure:"
echo "  dist/"
echo "  ├── required.html"
echo "  ├── robot.html"
echo "  └── public/"
echo "      ├── js/ (obfuscated)"
echo "      ├── styles/"
echo "      ├── meta/"
echo "      └── assets"
echo ""
echo "You can now deploy the 'dist' folder!"
echo ""

