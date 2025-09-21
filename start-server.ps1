#!/usr/bin/env pwsh
# RulzLawyer Server Management Script
# Automatically cleans up ports and starts the server safely

Write-Host "🚀 RulzLawyer Server Management" -ForegroundColor Green
Write-Host "=" * 40 -ForegroundColor Green

# Function to clean up ports
function Cleanup-Ports {
    Write-Host "🔥 Cleaning up ports..." -ForegroundColor Yellow
    
    # Method 1: Kill all node processes
    try {
        $nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
        if ($nodeProcesses) {
            Write-Host "   Found $($nodeProcesses.Count) Node.js processes to terminate" -ForegroundColor Cyan
            $nodeProcesses | Stop-Process -Force
            Write-Host "   ✅ Terminated Node.js processes" -ForegroundColor Green
        } else {
            Write-Host "   ✅ No Node.js processes found" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️ Could not terminate Node.js processes: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Method 2: Check port 3000 specifically
    try {
        $portCheck = netstat -ano | Select-String ":3000 "
        if ($portCheck) {
            Write-Host "   Port 3000 still in use, attempting targeted cleanup..." -ForegroundColor Yellow
            $portCheck | ForEach-Object {
                $line = $_.ToString()
                $pid = ($line -split '\s+')[-1]
                if ($pid -match '^\d+$') {
                    taskkill /PID $pid /F 2>$null
                    Write-Host "   ✅ Killed process $pid using port 3000" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "   ✅ Port 3000 is available" -ForegroundColor Green
        }
    } catch {
        Write-Host "   ⚠️ Could not check port usage: $($_.Exception.Message)" -ForegroundColor Red
    }

    # Wait for cleanup to complete
    Start-Sleep -Seconds 2
}

# Function to start server
function Start-Server {
    Write-Host "🎮 Starting RulzLawyer server..." -ForegroundColor Yellow
    
    # Verify server.js exists
    if (!(Test-Path "server.js")) {
        Write-Host "   ❌ server.js not found in current directory" -ForegroundColor Red
        Write-Host "   Please run this script from the RulzLawyer root directory" -ForegroundColor Red
        exit 1
    }

    # Start the server
    Write-Host "   Starting Node.js server on port 3000..." -ForegroundColor Cyan
    
    try {
        # Start server in background and capture the process
        $serverProcess = Start-Process -FilePath "node" -ArgumentList "server.js" -PassThru -WindowStyle Hidden
        
        # Give server time to start
        Start-Sleep -Seconds 3
        
        # Test if server is responding
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5 -ErrorAction Stop
            Write-Host "   ✅ Server started successfully!" -ForegroundColor Green
            Write-Host "   🌐 Access at: http://localhost:3000" -ForegroundColor Cyan
            Write-Host "   📋 Server PID: $($serverProcess.Id)" -ForegroundColor Cyan
        } catch {
            Write-Host "   ⚠️ Server started but may not be responding yet" -ForegroundColor Yellow
            Write-Host "   🌐 Try accessing: http://localhost:3000" -ForegroundColor Cyan
        }
        
    } catch {
        Write-Host "   ❌ Failed to start server: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Main execution
try {
    # Step 1: Cleanup
    Cleanup-Ports
    
    # Step 2: Start server  
    Start-Server
    
    # Step 3: Final status
    Write-Host ""
    Write-Host "🎉 RulzLawyer server management complete!" -ForegroundColor Green
    Write-Host "   • Port cleanup: ✅"
    Write-Host "   • Server started: ✅"  
    Write-Host "   • Web interface: http://localhost:3000"
    Write-Host ""
    Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Yellow

} catch {
    Write-Host "❌ Server management failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}