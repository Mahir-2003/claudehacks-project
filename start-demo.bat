@echo off
REM Badgers Register - Quick Start Script (Windows)

echo 🦡 Badgers Register - Quick Start
echo ════════════════════════════════════════
echo.

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend/ directory not found
    echo    Please run this script from the project root
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

REM Check if .env exists
if not exist "backend\.env" (
    echo ⚠️  Warning: backend\.env file not found
    echo    Creating from .env.example...
    copy backend\.env.example backend\.env
    echo.
    echo ⚡ ACTION REQUIRED: Add your Anthropic API key to backend\.env
    echo    Edit backend\.env and add: ANTHROPIC_API_KEY=sk-ant-api03-...
    echo.
    pause
)

echo 🚀 Starting Backend Server...
echo ════════════════════════════════════════
echo.

cd backend
echo Starting server... (Press Ctrl+C to stop)
echo.

REM Start the server
call npm start

echo.
echo Server stopped.
pause
