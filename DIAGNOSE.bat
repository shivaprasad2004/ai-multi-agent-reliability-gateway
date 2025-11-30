@echo off
echo ========================================
echo   DIAGNOSING CONNECTION ISSUES
echo ========================================
echo.

echo [1/6] Checking Docker...
docker --version
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    pause
    exit /b 1
)
echo Docker is installed
echo.

echo [2/6] Checking if Docker is running...
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running. Please start Docker Desktop.
    pause
    exit /b 1
)
echo Docker is running
echo.

echo [3/6] Checking container status...
docker-compose ps
echo.

echo [4/6] Checking frontend container...
docker ps -a | findstr frontend
echo.

echo [5/6] Checking frontend logs (last 20 lines)...
docker-compose logs --tail=20 frontend
echo.

echo [6/6] Checking backend logs (last 20 lines)...
docker-compose logs --tail=20 backend
echo.

echo ========================================
echo   DIAGNOSIS COMPLETE
echo ========================================
echo.
echo If containers are not running, try:
echo   docker-compose up --build -d
echo.
echo If port 3000 is in use, check:
echo   netstat -ano ^| findstr :3000
echo.
pause

