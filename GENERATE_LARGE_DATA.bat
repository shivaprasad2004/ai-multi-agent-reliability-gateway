@echo off
echo ========================================
echo   GENERATING LARGE TEST DATASET
echo ========================================
echo.

if "%1"=="" (
    echo Usage: GENERATE_LARGE_DATA.bat [number_of_requests] [number_of_violations]
    echo.
    echo Examples:
    echo   GENERATE_LARGE_DATA.bat 1000 100
    echo   GENERATE_LARGE_DATA.bat 5000 500
    echo   GENERATE_LARGE_DATA.bat 10000 1000
    echo.
    echo Default: 1000 requests, 100 violations
    echo.
    set /p count="Enter number of requests to generate (default 1000): "
    if "!count!"=="" set count=1000
    set /p violations="Enter number of violations (default 100): "
    if "!violations!"=="" set violations=100
) else (
    set count=%1
    set violations=%2
    if "%violations%"=="" set violations=100
)

echo Generating %count% requests and %violations% violations...
echo This may take a few minutes...
echo.

docker exec ai-gateway-backend node src/scripts/generateLargeData.js %count% %violations%

echo.
echo ========================================
echo   DATA GENERATION COMPLETE
echo ========================================
echo.
echo Refresh your dashboard to see the data!
echo.
pause

