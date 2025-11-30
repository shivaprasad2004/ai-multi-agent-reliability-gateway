@echo off
echo ========================================
echo   REBUILDING FRONTEND WITH FIXES
echo ========================================
echo.

echo Step 1: Stopping frontend...
docker-compose stop frontend
echo.

echo Step 2: Rebuilding frontend (this may take 2-3 minutes)...
docker-compose build --no-cache frontend
if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo.

echo Step 3: Starting frontend...
docker-compose up -d frontend
echo.

echo ========================================
echo   FRONTEND REBUILT
echo ========================================
echo.
echo Next steps:
echo   1. Wait 30 seconds for frontend to start
echo   2. Clear browser cache (Ctrl+F5)
echo   3. Go to: http://localhost:3000/login
echo   4. Click "Register" - you should see Name field
echo.
pause

