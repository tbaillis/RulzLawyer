@echo off
REM RulzLawyer D&D 3.5 Gaming System Startup Script (Windows Batch)
echo.
echo ############################################
echo #    RulzLawyer D&D 3.5 Gaming System     #
echo ############################################
echo.

echo [INFO] Cleaning up any existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

echo [INFO] Starting RulzLawyer Gaming Server...
echo [INFO] Server will be available at: http://localhost:3000
echo.
echo Available Gaming Interfaces:
echo - Character Creator: http://localhost:3000/character-creator.html
echo - Adventure Engine:  http://localhost:3000/adventure-engine.html  
echo - Dice Roller:       http://localhost:3000/dice-roller.html
echo - Main Dashboard:    http://localhost:3000
echo.

cd /d "%~dp0"

REM Start server and wait briefly
start /B node game-server.js
timeout /t 4 >nul

echo [SUCCESS] RulzLawyer D^&D 3.5 Gaming System is running!
echo [INFO] Access the game at: http://localhost:3000
echo.
echo Choose an interface to open:
echo 1) Character Creator (D^&D 3.5 character creation wizard)
echo 2) Adventure Engine (Campaign and encounter management)  
echo 3) Dice Roller (Advanced D^&D dice rolling system)
echo 4) Main Dashboard (Complete gaming interface)
echo 5) None (just run server)
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" start http://localhost:3000/character-creator.html
if "%choice%"=="2" start http://localhost:3000/adventure-engine.html
if "%choice%"=="3" start http://localhost:3000/dice-roller.html
if "%choice%"=="4" start http://localhost:3000
if "%choice%"=="5" echo Server running at http://localhost:3000

echo.
echo [RUNNING] Server is active at http://localhost:3000
echo [INFO] Press Ctrl+C to stop the server
echo [INFO] Close this window to stop the server
pause >nul