@echo off
setlocal
title Hebao Studio 200

set "HERE=%~dp0"
set "PROJ=%HERE%..\hebao-remotion"

if not exist "%PROJ%\package.json" goto NOPROJ
where npm >nul 2>nul
if errorlevel 1 goto NONODE

pushd "%PROJ%"
if errorlevel 1 goto NOPROJ

if exist "node_modules" goto RUN

echo.
echo  [!] 首次运行，正在安装依赖（约 2-5 分钟，只需一次）
echo.
call npm install
if errorlevel 1 goto NPMFAIL

:RUN
echo.
echo  正在启动出片台，首次启动要打包约 10-20 秒。
echo  就绪后会自动打开浏览器 http://127.0.0.1:8788
echo  关闭这个黑窗口即停止服务。
echo.
call npm run make
echo.
echo  [i] 出片台已停止。
goto END

:NOPROJ
echo.
echo  [x] 找不到出片台工程目录：
echo      %PROJ%
echo.
echo  出片台需要同级的 hebao-remotion 工程（含 Remotion 与 node_modules）。
echo  请确认它和本文件夹放在同一层目录下。
goto END

:NONODE
echo.
echo  [x] 没找到 Node.js / npm。
echo  请先安装 Node.js 18 以上版本：https://nodejs.org
echo  安装后重开这个窗口再试。
goto END

:NPMFAIL
echo.
echo  [x] 依赖安装失败，请把上面的报错发给技术同事。
echo.

:END
echo.
pause
popd
exit /b
