# 六神占卜应用启动脚本
Write-Host "正在启动六神占卜应用..." -ForegroundColor Green
Write-Host ""
Write-Host "服务器将在 http://localhost:8001 启动" -ForegroundColor Yellow
Write-Host "按 Ctrl+C 可以停止服务器" -ForegroundColor Yellow
Write-Host ""

# 检查Python是否安装
try {
    $pythonVersion = python --version 2>&1
    Write-Host "检测到Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "错误：未找到Python，请先安装Python" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

# 启动HTTP服务器
Write-Host "启动服务器中..." -ForegroundColor Green
Write-Host ""

try {
    python -m http.server 8001
} catch {
    Write-Host "启动服务器失败" -ForegroundColor Red
    Read-Host "按任意键退出"
}