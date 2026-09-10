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
#
# Usage:
#   ./scripts/strip-noncommercial-assets.sh --dry-run   # list what would go
#   ./scripts/strip-noncommercial-assets.sh             # actually remove
#
# The listing is worth having on its own: it is the only way to check which
# images carry the restriction without destroying them to find out.
set -euo pipefail

DRY_RUN=0
case "${1:-}" in
  --dry-run|-n) DRY_RUN=1 ;;
  "") ;;
  *) echo "Unknown argument: $1 (expected --dry-run or nothing)" >&2; exit 2 ;;
esac

cd "$(dirname "$0")/.."
REGISTRY="src/data/block-images.ts"

mapfile -t LINES < <(grep -nE 'require\(.*@noncommercial' "$REGISTRY" || true)
if [ ${#LINES[@]} -eq 0 ]; then
  echo "No non-commercial assets registered — nothing to do."
  exit 0
fi

if [ "$DRY_RUN" -eq 1 ]; then
  echo "Would remove ${#LINES[@]} non-commercial asset(s):"
else
  echo "Removing ${#LINES[@]} non-commercial asset(s):"
fi

for l in "${LINES[@]}"; do
  file=$(sed -E 's#.*require\("\.\./\.\./([^"]+)".*#\1#' <<<"$l")
  echo "  - $file"
  [ "$DRY_RUN" -eq 1 ] || rm -f -- "$file"
done

if [ "$DRY_RUN" -eq 1 ]; then
  echo
  echo "Dry run — nothing was deleted. Re-run without --dry-run to remove them."
  exit 0
fi

# Drop the marked registry lines.
sed -i -E '/require\(.*@noncommercial/d' "$REGISTRY"

echo
echo "Done. Verify with:  npx tsc --noEmit && npx expo export --platform web"
echo "Then update THIRD-PARTY-LICENSES.md to drop the CC BY-NC section."
