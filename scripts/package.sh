#!/bin/bash
set -e

# Clean up previous package
rm -rf package.zip dist-temp

# Build the project
npm run build

# Rename output HTML to index.html
mv dist/index.live.html dist/index.html

# Copy relevant files to a temp directory, including dist/
rsync -av \
  --include='dist/' \
  --exclude-from='.gitignore' \
  ./ ./dist-temp

# Create zip from temp directory
cd dist-temp
zip -r ../package.zip .
cd ..

# Clean up
rm -rf dist-temp

echo "✅ Package created: package.zip"
