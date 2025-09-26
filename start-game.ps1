# RulzLawyer D&D 3.5 System - PowerShell Launcher
# Complete D&D 3.5 Character Creator and Adventure Engine System
# Version 2.0.0

param(
    [string]$Mode = "full",
    [switch]$Debug = $false,
    [switch]$Production = $false,
    [string]$Port = "3000",
    [switch]$Web = $false,
    [switch]$Help = $false
)

# Script configuration
$ScriptName = "RulzLawyer D&D 3.5 System"
$Version = "2.0.0"
$LauncherScript = "game-launcher.js"

# Display help information
if ($Help) {
    Write-Host ""
    Write-Host "🎮 $ScriptName - PowerShell Launcher v$Version" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    Write-Host ""
    Write-Host "USAGE:" -ForegroundColor Yellow
    Write-Host "  .\start-game.ps1 [options]"
    Write-Host ""
    Write-Host "OPTIONS:" -ForegroundColor Yellow
    Write-Host "  -Mode <mode>        Game mode to start (default: full)"
    Write-Host "  -Debug              Enable debug mode with inspector"
    Write-Host "  -Production         Run in production mode"
    Write-Host "  -Port <port>        Specify port number (default: 3000)"
    Write-Host "  -Web                Enable web interface"
    Write-Host "  -Help               Show this help message"
    Write-Host ""
    Write-Host "AVAILABLE MODES:" -ForegroundColor Yellow
    Write-Host "  full                Complete game system (default)"
    Write-Host "  server              Server only"
    Write-Host "  character-creator   Character creation system"
    Write-Host "  combat              Combat system"
    Write-Host "  spells              Spell system"
    Write-Host "  epic                Epic level system"
    Write-Host "  portrait            AI portrait generator"
    Write-Host "  adventure           Adventure engine"
    Write-Host "  test                Integration tests"
    Write-Host ""
    Write-Host "EXAMPLES:" -ForegroundColor Yellow
    Write-Host "  .\start-game.ps1                      # Start full game"
    Write-Host "  .\start-game.ps1 -Debug               # Start with debugging"
    Write-Host "  .\start-game.ps1 -Mode server -Debug  # Start server with debugging"
    Write-Host "  .\start-game.ps1 -Production          # Start in production mode"
    Write-Host "  .\start-game.ps1 -Mode test           # Run integration tests"
    Write-Host ""
    exit 0
}

# Display banner
Write-Host ""
Write-Host "🎮 $ScriptName" -ForegroundColor Cyan
Write-Host "⚔️  Epic Level D&D 3.5 Adventure System" -ForegroundColor Magenta
Write-Host "🎭 AI Portraits | 🗡️ Tactical Combat | ✨ 400+ Spells | 🏛️ Divine Ascension" -ForegroundColor Green
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host ""

# Validate Node.js installation
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Node.js not found"
    }
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if game launcher exists
if (-not (Test-Path $LauncherScript)) {
    Write-Host "❌ Error: Game launcher script not found: $LauncherScript" -ForegroundColor Red
    Write-Host "Please ensure you're running this script from the RulzLawyer root directory" -ForegroundColor Yellow
    exit 1
}

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: package.json not found" -ForegroundColor Red
    Write-Host "Please ensure you're running this script from the RulzLawyer root directory" -ForegroundColor Yellow
    exit 1
}

# Check for node_modules
if (-not (Test-Path "node_modules")) {
    Write-Host "⚠️  Warning: node_modules not found. Running npm install..." -ForegroundColor Yellow
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            throw "npm install failed"
        }
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } catch {
        Write-Host "❌ Error: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
}

# Stop any existing Node.js processes
$existingProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($existingProcesses) {
    Write-Host "🛑 Stopping existing Node.js processes..." -ForegroundColor Yellow
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host "✅ Existing processes stopped" -ForegroundColor Green
}

# Build command arguments
$nodeArgs = @()
$scriptArgs = @()

# Add debug inspector if requested
if ($Debug -and -not $Production) {
    $nodeArgs += "--inspect"
    Write-Host "🔍 Debug mode enabled - Inspector running on default port" -ForegroundColor Cyan
}

# Add script arguments
$scriptArgs += "--mode=$Mode"

if ($Debug -and -not $Production) {
    $scriptArgs += "--debug=true"
}

if ($Production) {
    $env:NODE_ENV = "production"
    Write-Host "🚀 Production mode enabled" -ForegroundColor Green
} else {
    $env:NODE_ENV = "development"
}

if ($Web) {
    $scriptArgs += "--web=true"
    Write-Host "🌐 Web interface enabled" -ForegroundColor Cyan
}

# Set port
$env:PORT = $Port
Write-Host "🌍 Server will start on port: $Port" -ForegroundColor Cyan

# Set debug environment
if ($Debug) {
    $env:DEBUG = "rulzlawyer:*"
}

# Display startup information
Write-Host ""
Write-Host "🎯 Starting RulzLawyer in '$Mode' mode..." -ForegroundColor Yellow
Write-Host "📝 Environment: $($env:NODE_ENV)" -ForegroundColor Gray
Write-Host "🔌 Port: $Port" -ForegroundColor Gray
if ($Debug) {
    Write-Host "🐛 Debug: Enabled" -ForegroundColor Gray
}
if ($Web) {
    Write-Host "🌐 Web Interface: Enabled" -ForegroundColor Gray
}
Write-Host ""

# Start the game system
try {
    if ($nodeArgs.Count -gt 0) {
        Start-Process -FilePath "node" -ArgumentList ($nodeArgs + $LauncherScript + $scriptArgs) -NoNewWindow -Wait
    } else {
        Start-Process -FilePath "node" -ArgumentList ($LauncherScript + $scriptArgs) -NoNewWindow -Wait
    }
} catch {
    Write-Host "❌ Error starting RulzLawyer system: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🎮 RulzLawyer system has stopped." -ForegroundColor Yellow
Write-Host "Thank you for playing! May your adventures be epic! ⚔️" -ForegroundColor Cyan
Write-Host ""