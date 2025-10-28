@echo off
echo 正在启动六神占卜应用...
echo.
echo 服务器将在 http://localhost:8001 启动
echo 按 Ctrl+C 可以停止服务器
echo.

REM 检查Python是否安装
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 错误：未找到Python，请先安装Python
    pause
    exit /b 1
)

REM 启动HTTP服务器
echo 启动服务器中...
python -m http.server 8001

pause