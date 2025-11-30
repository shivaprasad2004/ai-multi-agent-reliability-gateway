@echo off
echo ========================================
echo   FIXING CONNECTION REFUSED ERROR
echo ========================================
echo.

echo Step 1: Stopping all containers...
docker-compose down
echo.

echo Step 2: Checking for port conflicts...
echo Checking port 3000...
netstat -ano | findstr :3000
echo.
echo Checking port 4000...
netstat -ano | findstr :4000
echo.

echo Step 3: Starting services...
docker-compose up --build -d
echo.

echo Step 4: Waiting for services to start (60 seconds)...
timeout /t 60 /nobreak
echo.

echo Step 5: Checking container status...
docker-compose ps
echo.

echo Step 6: Checking frontend logs...
docker-compose logs --tail=30 frontend
echo.

echo Step 7: Testing backend...
curl http://localhost:4000/health
echo.
echo.

echo ========================================
echo   DIAGNOSIS COMPLETE
echo ========================================
echo.
echo If containers show "Up", try:
echo   1. Wait another 30 seconds
echo   2. Open http://localhost:3000 in browser
echo   3. Check logs: docker-compose logs -f frontend
echo.
echo If containers show "Exited" or errors:
echo   1. Check logs: docker-compose logs
echo   2. Check Docker Desktop has enough resources
echo   3. Try: docker-compose down -v
echo      Then: docker-compose up --build
echo.
pause

