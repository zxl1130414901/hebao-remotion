#!/bin/bash
# 对 out/audit81/*.mp4 密集抽帧：每套均匀抽 24 帧 → 6x4 拼图 tile
# 用法: ./scripts/dense-tiles.sh [只处理指定 id]
cd "$(dirname "$0")/.."
mkdir -p out/audit81/tiles out/audit81/frames
ONLY="$1"
for mp4 in out/audit81/*.mp4; do
  id=$(basename "$mp4" .mp4)
  if [ -n "$ONLY" ] && [ "$id" != "$ONLY" ]; then continue; fi
  tile="out/audit81/tiles/${id}_tile.jpg"
  if [ -f "$tile" ] && [ -s "$tile" ]; then echo "SKIP $id"; continue; fi
  fdir="out/audit81/frames/$id"
  rm -rf "$fdir"; mkdir -p "$fdir"
  # 24 帧均匀覆盖 0..481（隔 20 帧取 1 帧）
  ffmpeg -y -loglevel error -i "$mp4" -vf "select='not(mod(n\,20))',scale=540:960,tile=6x4" -frames:v 1 -q:v 4 "$tile"
  echo "TILE $id"
done
echo "TILES DONE"
