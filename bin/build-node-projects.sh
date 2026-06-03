#!/usr/bin/env bash
set -euo pipefail

CUR_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$CUR_DIR/../gutenberg/blocks"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Root directory not found: $ROOT_DIR" >&2
  exit 1
fi

mapfile -t projects < <(
  find "$ROOT_DIR" \
    -path '*/node_modules/*' -prune -o \
    -name package.json -type f -print0 | \
  xargs -0 -n1 dirname | sort -u
)

if [[ ${#projects[@]} -eq 0 ]]; then
  echo "No Node projects found under: $ROOT_DIR"
  exit 0
fi

for project in "${projects[@]}"; do
  echo "==> Processing: $project"
  (
    cd "$project"
    npm install
    npm run build
    #rm -rf node_modules
  )
done

echo "Done. Processed ${#projects[@]} projects."
