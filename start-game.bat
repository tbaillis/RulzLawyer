@echo off
REM RulzLawyer D&D 3.5 System - Batch Launcher
REM Complete D&D 3.5 Character Creator and Adventure Engine System
REM Version 2.0.0

setlocal EnableDelayedExpansion

REM Default configuration
set "GAME_MODE=full"
set "GAME_PORT=3000"
set "DEBUG_MODE=false"
set "PRODUCTION_MODE=false"
set "WEB_MODE=false"
set "SCRIPT_NAME=RulzLawyer D&D 3.5 System"
set "VERSION=2.0.0"
set "LAUNCHER_SCRIPT=game-launcher.js"

REM Parse command line arguments
:parse_args
if "%~1"=="" goto start_game
if /I "%~1"=="--help" goto show_help
if /I "%~1"=="-h" goto show_help
if /I "%~1"=="--debug" (
    set "DEBUG_MODE=true"
    shift & goto parse_args
)
if /I "%~1"=="--production" (
    set "PRODUCTION_MODE=true"
    shift & goto parse_args
)
if /I "%~1"=="--web" (
    set "WEB_MODE=true"
    shift & goto parse_args
)
if /I "%~1"=="--mode" (
    set "GAME_MODE=%~2"
    shift & shift & goto parse_args
)
if /I "%~1"=="--port" (
    set "GAME_PORT=%~2"
    shift & shift & goto parse_args
)
shift & goto parse_args

:show_help
echo.
echo 🎮 %SCRIPT_NAME% - Batch Launcher v%VERSION%
echo =============================================================
echo.
echo USAGE:
echo   start-game.bat [options]
echo.
echo OPTIONS:
echo   --mode ^<mode^>        Game mode to start (default: full)
echo   --debug              Enable debug mode with inspector
echo   --production         Run in production mode
echo   --port ^<port^>        Specify port number (default: 3000)
echo   --web                Enable web interface
echo   --help, -h           Show this help message
echo.
echo AVAILABLE MODES:
echo   full                Complete game system (default)
echo   server              Server only
echo   character-creator   Character creation system
echo   combat              Combat system
echo   spells              Spell system
echo   epic                Epic level system
echo   portrait            AI portrait generator
echo   adventure           Adventure engine
echo   test                Integration tests
echo.
echo EXAMPLES:
echo   start-game.bat                          # Start full game
echo   start-game.bat --debug                 # Start with debugging
echo   start-game.bat --mode server --debug   # Start server with debugging
echo   start-game.bat --production            # Start in production mode
echo   start-game.bat --mode test             # Run integration tests
echo.
goto end

:start_game
echo.
echo 🎮 %SCRIPT_NAME%
echo ⚔️  Epic Level D&D 3.5 Adventure System
echo 🎭 AI Portraits ^| 🗡️ Tactical Combat ^| ✨ 400+ Spells ^| 🏛️ Divine Ascension
echo ===============================================================================
echo.

REM Validate Node.js installation
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    goto error_exit
)

for /f %%i in ('node --version 2^>nul') do set "NODE_VERSION=%%i"
echo ✅ Node.js detected: %NODE_VERSION%

REM Check if game launcher exists
if not exist "%LAUNCHER_SCRIPT%" (
    echo ❌ Error: Game launcher script not found: %LAUNCHER_SCRIPT%
    echo Please ensure you're running this script from the RulzLawyer root directory
    goto error_exit
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ Error: package.json not found
    echo Please ensure you're running this script from the RulzLawyer root directory
    goto error_exit
)

REM Check for node_modules
if not exist "node_modules" (
    echo ⚠️  Warning: node_modules not found. Running npm install...
    call npm install
    if errorlevel 1 (
        echo ❌ Error: Failed to install dependencies
        goto error_exit
    )
    echo ✅ Dependencies installed successfully
)

REM Stop any existing Node.js processes
echo 🛑 Stopping existing Node.js processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo ✅ Existing processes stopped

REM Set environment variables
if "%PRODUCTION_MODE%"=="true" (
    set "NODE_ENV=production"
    echo 🚀 Production mode enabled
) else (
    set "NODE_ENV=development"
)

set "PORT=%GAME_PORT%"
echo 🌍 Server will start on port: %GAME_PORT%

if "%DEBUG_MODE%"=="true" (
    set "DEBUG=rulzlawyer:*"
    echo 🔍 Debug mode enabled
)

REM Build command arguments
set "NODE_ARGS="
set "SCRIPT_ARGS=--mode=%GAME_MODE%"

if "%DEBUG_MODE%"=="true" (
    if not "%PRODUCTION_MODE%"=="true" (
        set "NODE_ARGS=--inspect"
        set "SCRIPT_ARGS=!SCRIPT_ARGS! --debug=true"
    )
)

if "%WEB_MODE%"=="true" (
    set "SCRIPT_ARGS=!SCRIPT_ARGS! --web=true"
    echo 🌐 Web interface enabled
)

REM Display startup information
echo.
echo 🎯 Starting RulzLawyer in '%GAME_MODE%' mode...
echo 📝 Environment: %NODE_ENV%
echo 🔌 Port: %GAME_PORT%
if "%DEBUG_MODE%"=="true" echo 🐛 Debug: Enabled
if "%WEB_MODE%"=="true" echo 🌐 Web Interface: Enabled
echo.

REM Start the game system
if defined NODE_ARGS (
    node %NODE_ARGS% %LAUNCHER_SCRIPT% %SCRIPT_ARGS%
) else (
    node %LAUNCHER_SCRIPT% %SCRIPT_ARGS%
)

if errorlevel 1 (
    echo ❌ Error starting RulzLawyer system
    goto error_exit
)

echo.
echo 🎮 RulzLawyer system has stopped.
echo Thank you for playing! May your adventures be epic! ⚔️
echo.
goto end

:error_exit
echo.
echo ❌ RulzLawyer failed to start. Please check the error messages above.
echo.
pause
exit /b 1

:end
endlocal