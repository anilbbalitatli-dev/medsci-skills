#!/usr/bin/env bash
# Remove every reference image that is licensed for non-commercial use only.
#
# Run this before shipping the app commercially. Deleting the image files on
# their own is NOT enough: Metro resolves require() at build time, so a missing
# file breaks the bundle. This removes the registry lines and the files together.
#
# Entries are identified by the `@noncommercial` marker in
# src/data/block-images.ts. Cards whose image disappears fall back to the
# schematic sonoanatomy diagram, which is original work with no such restriction.
set -euo pipefail

cd "$(dirname "$0")/.."
REGISTRY="src/data/block-images.ts"

mapfile -t LINES < <(grep -nE 'require\(.*@noncommercial' "$REGISTRY" || true)
if [ ${#LINES[@]} -eq 0 ]; then
  echo "No non-commercial assets registered — nothing to do."
  exit 0
fi

echo "Removing ${#LINES[@]} non-commercial asset(s):"
for l in "${LINES[@]}"; do
  file=$(sed -E 's#.*require\("\.\./\.\./([^"]+)".*#\1#' <<<"$l")
  echo "  - $file"
  rm -f -- "$file"
done

# Drop the marked registry lines.
sed -i -E '/require\(.*@noncommercial/d' "$REGISTRY"

echo
echo "Done. Verify with:  npx tsc --noEmit && npx expo export --platform web"
echo "Then update THIRD-PARTY-LICENSES.md to drop the CC BY-NC section."
