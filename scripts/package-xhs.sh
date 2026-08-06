#!/bin/bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
output_dir="$project_dir/artifacts"
artifact="$output_dir/my-ai-lineup-xhs.zip"

mkdir -p "$output_dir"
rm -f "$artifact"

cd "$project_dir/dist/xhs"
zip -qr "$artifact" . -x '*.DS_Store' '*.map'

echo "小红书离线包：$artifact"
