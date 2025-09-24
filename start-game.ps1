Param(
    [int]$Port = 3000,
    [string]$HostName = 'localhost',
    [int]$WaitSeconds = 3
)

# Ensure script runs from repository root
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptDir

Write-Output "Starting RulzLawyer start script in: $scriptDir"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Error "Node.js not found in PATH. Please install Node.js or add it to PATH."
    exit 1
}

# Start the server in the background
$serverCmd = 'server-enhanced.js'
Write-Output "Launching server: node $serverCmd"
$proc = Start-Process -FilePath node -ArgumentList 'server-enhanced.js' -PassThru -NoNewWindow

Write-Output "Waiting $WaitSeconds second(s) for server to initialize..."
Start-Sleep -Seconds $WaitSeconds

 $healthUrl = "http://$HostName`:$Port/health"
Write-Output "Checking health endpoint: $healthUrl"

try {
    $resp = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 10
    Write-Output "Health endpoint returned:" 
    $resp | ConvertTo-Json -Depth 6 | Write-Output
    Write-Output "Server started successfully (Process Id: $($proc.Id))"
} catch {
    Write-Warning "Unable to reach health endpoint. The server may still be starting or failed to start."
    Write-Output "Server process info:" 
    Write-Output ("  Id: {0}" -f $($proc.Id))
    try { Write-Output ("  StartTime: {0}" -f $proc.StartTime) } catch {}
    Write-Output "To view logs, run: Get-Process -Id $($proc.Id) | Format-List *"
}

Write-Output "To stop the server: Stop-Process -Id $($proc.Id) -Force"
