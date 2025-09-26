# RulzLawyer Quick Start Scripts
# Convenient shortcuts for common operations

# Start game in debug mode
function Start-RulzLawyerDebug {
    .\start-game.ps1 -Debug
}

# Start game in production mode
function Start-RulzLawyerProduction {
    .\start-game.ps1 -Production
}

# Start specific game modes
function Start-CharacterCreator {
    .\start-game.ps1 -Mode character-creator -Debug
}

function Start-CombatSystem {
    .\start-game.ps1 -Mode combat -Debug
}

function Start-SpellSystem {
    .\start-game.ps1 -Mode spells -Debug
}

function Start-EpicSystem {
    .\start-game.ps1 -Mode epic -Debug
}

function Start-PortraitSystem {
    .\start-game.ps1 -Mode portrait -Debug
}

function Start-AdventureSystem {
    .\start-game.ps1 -Mode adventure -Debug
}

# Run tests
function Test-RulzLawyer {
    .\start-game.ps1 -Mode test
}

# Stop all game processes
function Stop-RulzLawyer {
    Write-Host "🛑 Stopping all RulzLawyer processes..." -ForegroundColor Yellow
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
    Write-Host "✅ All processes stopped" -ForegroundColor Green
}

# Install dependencies
function Install-RulzLawyerDependencies {
    Write-Host "📦 Installing RulzLawyer dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    }
}

# Quick health check
function Test-RulzLawyerHealth {
    Write-Host "🏥 RulzLawyer Health Check" -ForegroundColor Cyan
    Write-Host "=" * 30 -ForegroundColor Gray
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        } else {
            Write-Host "❌ Node.js: Not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ Node.js: Not found" -ForegroundColor Red
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
        } else {
            Write-Host "❌ npm: Not found" -ForegroundColor Red
        }
    } catch {
        Write-Host "❌ npm: Not found" -ForegroundColor Red
    }
    
    # Check files
    if (Test-Path "game-launcher.js") {
        Write-Host "✅ Game launcher: Found" -ForegroundColor Green
    } else {
        Write-Host "❌ Game launcher: Missing" -ForegroundColor Red
    }
    
    if (Test-Path "package.json") {
        Write-Host "✅ Package.json: Found" -ForegroundColor Green
    } else {
        Write-Host "❌ Package.json: Missing" -ForegroundColor Red
    }
    
    if (Test-Path "node_modules") {
        Write-Host "✅ Dependencies: Installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Dependencies: Not installed" -ForegroundColor Yellow
    }
    
    # Check core system files
    $coreFiles = @(
        "code-repository\server\multi-user-server-architecture.js",
        "code-repository\src\character\character-sheet-renderer.js",
        "code-repository\src\spells\advanced-spell-manager.js",
        "code-repository\src\epic\epic-level-manager.js",
        "code-repository\src\portrait\character-portrait-generator.js"
    )
    
    $missingFiles = 0
    foreach ($file in $coreFiles) {
        if (-not (Test-Path $file)) {
            $missingFiles++
        }
    }
    
    if ($missingFiles -eq 0) {
        Write-Host "✅ Core system files: Complete" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Core system files: $missingFiles missing" -ForegroundColor Yellow
    }
    
    Write-Host ""
    if ($missingFiles -eq 0) {
        Write-Host "🎮 RulzLawyer is ready to launch! 🚀" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Some issues detected. Please review the above." -ForegroundColor Yellow
    }
}

# Display available functions
function Show-RulzLawyerCommands {
    Write-Host ""
    Write-Host "🎮 RulzLawyer PowerShell Commands" -ForegroundColor Cyan
    Write-Host "=" * 40 -ForegroundColor Gray
    Write-Host ""
    Write-Host "GAME LAUNCHERS:" -ForegroundColor Yellow
    Write-Host "  Start-RulzLawyerDebug        - Start in debug mode"
    Write-Host "  Start-RulzLawyerProduction   - Start in production mode"
    Write-Host ""
    Write-Host "SYSTEM MODULES:" -ForegroundColor Yellow
    Write-Host "  Start-CharacterCreator       - Character creation system"
    Write-Host "  Start-CombatSystem          - Combat system"
    Write-Host "  Start-SpellSystem           - Spell system"
    Write-Host "  Start-EpicSystem            - Epic level system"
    Write-Host "  Start-PortraitSystem        - AI portrait generator"
    Write-Host "  Start-AdventureSystem       - Adventure engine"
    Write-Host ""
    Write-Host "UTILITIES:" -ForegroundColor Yellow
    Write-Host "  Test-RulzLawyer             - Run integration tests"
    Write-Host "  Stop-RulzLawyer             - Stop all processes"
    Write-Host "  Install-RulzLawyerDependencies - Install npm packages"
    Write-Host "  Test-RulzLawyerHealth       - System health check"
    Write-Host "  Show-RulzLawyerCommands     - Show this help"
    Write-Host ""
}

# Export functions
Export-ModuleMember -Function *

Write-Host "🎮 RulzLawyer PowerShell utilities loaded!" -ForegroundColor Green
Write-Host "Type 'Show-RulzLawyerCommands' to see available commands." -ForegroundColor Cyan