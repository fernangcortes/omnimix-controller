@echo off
title OmniMix Controller
echo.
echo  ██████╗ ███╗   ███╗███╗   ██╗██╗███╗   ███╗██╗██╗  ██╗
echo  ██╔═══██╗████╗ ████║████╗  ██║██║████╗ ████║██║╚██╗██╔╝
echo  ██║   ██║██╔████╔██║██╔██╗ ██║██║██╔████╔██║██║ ╚███╔╝
echo  ██║   ██║██║╚██╔╝██║██║╚██╗██║██║██║╚██╔╝██║██║ ██╔██╗
echo  ╚██████╔╝██║ ╚═╝ ██║██║ ╚████║██║██║ ╚═╝ ██║██║██╔╝ ██╗
echo   ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═══╝╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═╝
echo.
echo  Starting OmniMix...
echo.
if not exist "node_modules" (
    echo [OmniMix] Installing dependencies...
    call npm install
    echo.
)
if exist "dist" (
    echo [OmniMix] Starting in PRODUCTION mode...
    set NODE_ENV=production
    node server.mjs
) else (
    echo [OmniMix] Starting in DEVELOPMENT mode...
    echo  -- API:      http://localhost:3001
    echo  -- Frontend: http://localhost:5173
    timeout /t 2 >nul
    start "" "http://localhost:5173"
    start "OmniMix API" /MIN cmd /c "node server.mjs"
    call npm run dev
)
pause
