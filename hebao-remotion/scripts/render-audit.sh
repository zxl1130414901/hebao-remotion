#!/bin/bash
# 批量渲染经典模板审计版（0.5 缩放）——用法: ./scripts/render-audit.sh <list-file> <worker-tag>
cd "$(dirname "$0")/.."
LIST="$1"
TAG="${2:-w}"
mkdir -p "out/audit81"
while read -r id; do
  [ -z "$id" ] && continue
  out="out/audit81/${id}.mp4"
  if [ -f "$out" ] && [ -s "$out" ]; then
    echo "[$TAG] SKIP $id"
    continue
  fi
  echo "[$TAG] RENDER $id ..."
  npx remotion render "$id" "$out" --concurrency=2 --timeout=120000 --scale=0.5 --image-format=jpeg --log=error
  code=$?
  if [ $code -ne 0 ]; then
    echo "[$TAG] FAIL $id (exit $code)"
  fi
done < "$LIST"
echo "[$TAG] ALL DONE"
