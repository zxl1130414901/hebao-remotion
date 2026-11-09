#!/bin/bash
# 全量渲染 u01–u65（1080×1920 / 60fps / 482 帧）
cd "$(dirname "$0")/.."
OUT="${OUT_DIR:-F:/workbuddy/贺报-通用版-65/videos}"
LOG="out/render65.log"
mkdir -p "$OUT"
: > "$LOG"
for i in $(seq 1 65); do
  id=$(printf "u%02d" "$i")
  s=$(date +%s)
  if npx remotion render src/u/index.ts "$id" "$OUT/$id.mp4" --log=error >/dev/null 2>&1; then
    echo "$id OK $(( $(date +%s) - s ))s" >> "$LOG"
  else
    echo "$id FAIL" >> "$LOG"
  fi
done
echo ALLDONE >> "$LOG"
