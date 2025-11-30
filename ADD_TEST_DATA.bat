@echo off
echo ========================================
echo   ADDING TEST DATA TO APPLICATION
echo ========================================
echo.

echo This will add sample data to help you verify the application is working.
echo.

echo [1/2] Checking if backend container is running...
docker ps | findstr backend >nul 2>&1
if errorlevel 1 (
    echo ERROR: Backend container is not running
    echo Please start the application first: docker-compose up -d
    pause
    exit /b 1
)
echo Backend container is running
echo.

echo [2/2] Adding test data...
docker exec ai-gateway-backend node src/config/seedTestData.js
if errorlevel 1 (
    echo ERROR: Failed to add test data
    echo Check if database is ready: docker-compose logs backend
    pause
    exit /b 1
)

echo.
echo ========================================
echo   TEST DATA ADDED SUCCESSFULLY
echo ========================================
echo.
echo The application now has:
echo   - Sample requests/metrics
echo   - Sample guardrail violations
echo   - Test API keys
echo.
echo Refresh your dashboard to see the data!
echo.
pause

