@echo off
echo 🚀 RulzLawyer Quick Server Start
echo =====================================
echo.

echo 🔥 Cleaning up ports...
powershell -Command "Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force" 2>nul
timeout /t 2 /nobreak >nul

echo 🎮 Starting server...
echo 🌐 Access at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

node server.js