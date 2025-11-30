@echo off
echo ========================================
echo   STARTING AI GATEWAY APPLICATION
echo ========================================
echo.

REM Check Docker
echo [1/5] Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not in PATH
    echo Please install Docker Desktop from https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running
    echo Please start Docker Desktop and wait for it to fully start
    pause
    exit /b 1
)
echo Docker is running
echo.

REM Stop existing containers
echo [2/5] Stopping existing containers...
docker-compose down >nul 2>&1
echo Done
echo.

REM Build and start
echo [3/5] Building and starting containers...
echo This may take 2-3 minutes on first run...
docker-compose up --build -d
if errorlevel 1 (
    echo ERROR: Failed to start containers
    echo Check Docker Desktop is running and has enough resources
    pause
    exit /b 1
)
echo Containers started
echo.

REM Wait for services
echo [4/5] Waiting for services to initialize (60 seconds)...
echo Please wait, this is normal...
timeout /t 60 /nobreak >nul
echo Done
echo.

REM Check status
echo [5/5] Checking service status...
docker-compose ps
echo.

echo ========================================
echo   STARTUP COMPLETE
echo ========================================
echo.
echo Checking if services are ready...
echo.

REM Test backend
echo Testing backend...
curl -s http://localhost:4000/health >nul 2>&1
if errorlevel 1 (
    echo WARNING: Backend not responding yet, wait 30 more seconds
) else (
    echo Backend is responding
)
echo.

echo ========================================
echo   ACCESS YOUR APPLICATION
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:4000
echo.
echo Login: admin@example.com / Admin123
echo.
echo ========================================
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo.
pause

