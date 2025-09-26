#!/usr/bin/env pwsh

# RulzLawyer D&D 3.5 System - Simple Start Script
# This script helps start the game in VS Code with or without debugging

Write-Host "🎮 RulzLawyer D&D 3.5 System - Simple Start" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

$choice = Read-Host @"
Choose how to start the server:
1. 🐛 Debug Mode (with breakpoints and debugging)
2. 🚀 Production Mode (faster, no debugging)
3. 📋 Show available endpoints

Enter your choice (1-3)
"@

switch ($choice) {
    "1" {
        Write-Host "Starting in DEBUG mode..." -ForegroundColor Yellow
        Write-Host "✅ This will start VS Code debugging session" -ForegroundColor Green
        Write-Host "✅ You can set breakpoints in simple-server.js" -ForegroundColor Green
        Write-Host "✅ Use VS Code Simple Browser to test: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        Write-Host "Opening VS Code and starting debugging..." -ForegroundColor Yellow
        code .
        Start-Sleep 2
        code --command "workbench.action.debug.selectandstart"
    }
    "2" {
        Write-Host "Starting in PRODUCTION mode..." -ForegroundColor Yellow
        Write-Host "✅ Server will run without debugging" -ForegroundColor Green
        Write-Host "✅ Use VS Code Simple Browser to test: http://localhost:3000" -ForegroundColor Green
        Write-Host ""
        node simple-server.js
    }
    "3" {
        Write-Host "Available Endpoints:" -ForegroundColor Green
        Write-Host "  🏠 http://localhost:3000          - Main game page"
        Write-Host "  ❤️  http://localhost:3000/api/health  - Health check"
        Write-Host "  📊 http://localhost:3000/api/status   - Server status"
        Write-Host "  🧪 http://localhost:3000/test        - Test page"
        Write-Host ""
        Write-Host "💡 Note: Use VS Code's Simple Browser (not PowerShell/curl)" -ForegroundColor Yellow
        Write-Host "   PowerShell HTTP clients cause Node.js to exit on Windows" -ForegroundColor Yellow
    }
    default {
        Write-Host "Invalid choice. Please run the script again and choose 1, 2, or 3." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🎲 Happy adventuring!" -ForegroundColor Magenta