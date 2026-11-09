#!/usr/bin/env bash
# 批量渲染贺报成片
# 用法：bash render_all.sh [起始编号] [结束编号]   例如 bash render_all.sh 9 65
# 工程路径可用 PROJ 覆盖；输出目录固定为本脚本同级的 videos/
set -u
PROJ=${PROJ:-F:/workbuddy/hebao-remotion}
SELF="$(cd "$(dirname "$0")" && pwd)"
OUT="$SELF/videos"
mkdir -p "$OUT"
cd "$PROJ" || { echo "找不到工程目录: $PROJ"; exit 1; }

START=${1:-1}; END=${2:-115}
IDS=""
for i in $(seq "$START" "$END"); do
  if [ "$i" -le 65 ]; then IDS="$IDS $(printf 'u%02d' "$i")"; else IDS="$IDS u$i"; fi
done

# 改过样式先清打包缓存，否则会命中旧产物（静帧是新的、成片是旧的）
rm -rf node_modules/.cache/remotion node_modules/.cache/webpack 2>/dev/null

# render65.mjs：单次打包 + 每 4 支重启浏览器（复用 Chrome 会累积内存直到 OOM）
OUT_DIR="$OUT" node tools/render65.mjs $IDS
echo "全部完成，输出目录：$OUT"
