#!/bin/bash
# 贺报出片台 · 双击运行（macOS / Linux）
# 工程目录与本文件夹同级：贺报-通用版-200 与 hebao-remotion 并列
# Finder 双击时 PATH 很短，nvm / homebrew 装的 node 常常找不到，先补上
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
[ -s "$HOME/.nvm/nvm.sh" ] && . "$HOME/.nvm/nvm.sh" >/dev/null 2>&1

cd "$(dirname "$0")" || exit 1
PROJ="../hebao-remotion"

fail() {
  echo ""
  echo "  [x] $1"
  echo ""
  read -r -p "按回车关闭窗口…" _
  exit 1
}

[ -f "$PROJ/package.json" ] || fail "找不到工程目录 ../hebao-remotion（需与本文件夹同级）"
command -v npm >/dev/null 2>&1 || fail "没找到 npm，请先安装 Node.js 18+：https://nodejs.org"

cd "$PROJ" || fail "进不去工程目录"

if [ ! -d node_modules ]; then
  echo ""
  echo "  [!] 首次运行，正在安装依赖（约 2-5 分钟，只需一次）"
  echo ""
  npm install || fail "依赖安装失败，请把上面的报错截图发过来"
fi

echo ""
echo "  正在启动出片台，首次启动要打包约 10-20 秒。"
echo "  就绪后会自动打开浏览器 http://127.0.0.1:8788"
echo "  关闭这个窗口即停止服务。"
echo ""
npm run make

echo ""
read -r -p "出片台已停止，按回车关闭窗口…" _
