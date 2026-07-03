$ErrorActionPreference = 'Stop'
$BackendDir = "$PSScriptRoot"

Write-Host "🔨  Building backend..." -ForegroundColor Cyan
Remove-Item "$BackendDir\tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue

$proc = Start-Process -FilePath "node" `
  -ArgumentList "`"$BackendDir\node_modules\typescript\bin\tsc`" -p `"$BackendDir\tsconfig.json`"" `
  -WorkingDirectory $BackendDir -Wait -PassThru -NoNewWindow
  
if ($proc.ExitCode -ne 0) {
  Write-Host "❌  Build failed" -ForegroundColor Red
  exit 1
}

Write-Host "✅  Build complete" -ForegroundColor Green
Write-Host "🚀  Starting API on http://localhost:3001" -ForegroundColor Cyan

node "$BackendDir\dist\main.js"
