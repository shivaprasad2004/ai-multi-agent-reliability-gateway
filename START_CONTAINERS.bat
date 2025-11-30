@echo off
echo ========================================
echo   STARTING AI GATEWAY CONTAINERS
echo ========================================
echo.

echo Starting all containers...
docker-compose up -d

echo.
echo Waiting 10 seconds for containers to start...
timeout /t 10 /nobreak

echo.
echo Checking container status...
docker-compose ps

echo.
echo ========================================
echo   CONTAINERS STARTED
echo ========================================
echo.
echo Wait 30-60 seconds for services to fully initialize
echo Then refresh Docker Desktop to see running containers
echo.
echo Access application at: http://localhost:3000
echo.
pause

