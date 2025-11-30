@echo off
REM AI Multi-Agent Reliability Gateway - Startup Script (Windows)

echo.
echo 🚀 Starting AI Multi-Agent Reliability Gateway...
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo 📦 Building and starting services...
docker-compose up --build -d

echo.
echo ⏳ Waiting for services to be healthy...
timeout /t 10 /nobreak >nul

echo.
echo 🎉 Services are starting!
echo.
echo 📍 Access points:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:4000
echo    MySQL: localhost:3306
echo.
echo 🔑 Default credentials:
echo    Email: admin@example.com
echo    Password: Admin123
echo.
echo 📊 View logs: docker-compose logs -f
echo 🛑 Stop services: docker-compose down
echo.
pause

