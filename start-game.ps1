# RulzLawyer D&D 3.5 Gaming System - Startup Script
# Enhanced version with comprehensive port cleanup and process management

# Color scheme for console output
$Host.UI.RawUI.BackgroundColor = "Black"
Clear-Host

Write-Host "===============================================" -ForegroundColor Green
Write-Host "🎮 RulzLawyer D&D 3.5 Gaming System" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""

# Function to test if a port is available
function Test-Port {
    param([int]$Port)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        return $true  # Port is in use
    }
    catch {
        return $false  # Port is available
    }
}

# Function to stop processes using a specific port
function Stop-ProcessOnPort {
    param([int]$Port)
    try {
        # Find processes using the port
        $processes = netstat -ano | findstr ":$Port "
        if ($processes) {
            $processes | ForEach-Object {
                $line = $_.Trim()
                if ($line -match "\s+(\d+)$") {
                    $processId = $matches[1]
                    Write-Host "🔄 Stopping process $processId on port $Port" -ForegroundColor Yellow
                    try {
                        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    }
                    catch {
                        # Process might already be stopped
                    }
                }
            }
        }
        
        # Also stop any node processes (backup cleanup)
        Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
        
        Write-Host "✅ Port cleanup complete" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️  Port cleanup warning: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Function to wait for port to become available
function Wait-ForPortCleanup {
    param([int]$Port, [int]$MaxWaitSeconds = 10)
    
    for ($i = 0; $i -lt $MaxWaitSeconds; $i++) {
        if (-not (Test-Port -Port $Port)) {
            return $true
        }
        Start-Sleep -Seconds 1
        Write-Host "." -NoNewline -ForegroundColor Gray
    }
    Write-Host ""
    return $false
}

# Main startup sequence
try {
    # Step 1: Port Cleanup
    Write-Host "Step 1: Port Cleanup" -ForegroundColor White
    Stop-ProcessOnPort -Port 3000

    # Step 2: Verify port availability
    Write-Host ""
    Write-Host "Step 2: Port Verification" -ForegroundColor White
    if (-not (Wait-ForPortCleanup -Port 3000)) {
        Write-Host "⚠️  Port 3000 still in use, attempting to continue..." -ForegroundColor Yellow
    } else {
        Write-Host "✅ Port 3000 is available" -ForegroundColor Green
    }

    # Step 3: Check game server file exists
    Write-Host ""
    Write-Host "Step 3: File Verification" -ForegroundColor White
    if (-not (Test-Path "game-server.js")) {
        Write-Host "❌ Error: game-server.js not found in current directory!" -ForegroundColor Red
        Write-Host "   Current directory: $(Get-Location)" -ForegroundColor Gray
        exit 1
    }
    Write-Host "✅ Found game-server.js" -ForegroundColor Green

    # Step 4: Start the server
    Write-Host ""
    Write-Host "Step 4: Starting Game Server" -ForegroundColor White
    Write-Host "🚀 Launching RulzLawyer D&D 3.5 Game Server..." -ForegroundColor Cyan

    # Show server info
    Write-Host ""
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host "🎮 Server Starting..." -ForegroundColor Cyan
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host "🔗 Main Interface: http://localhost:3000" -ForegroundColor Yellow
    Write-Host "👤 Character Creator: http://localhost:3000/character-creator.html" -ForegroundColor Yellow
    Write-Host "🏰 Adventure Engine: http://localhost:3000/adventure-engine.html" -ForegroundColor Yellow
    Write-Host "🎲 Dice Roller: http://localhost:3000/dice-roller.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Gray
    Write-Host "=======================================" -ForegroundColor Cyan
    Write-Host ""

    # Start the server
    node game-server.js

} catch {
    Write-Host ""
    Write-Host "❌ Error starting game server: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} finally {
    Write-Host ""
    Write-Host "🔄 Game server stopped" -ForegroundColor Yellow
    Write-Host "🧹 Cleaning up..." -ForegroundColor Gray
    Stop-ProcessOnPort -Port 3000
    Write-Host "✅ Cleanup complete" -ForegroundColor Green
}