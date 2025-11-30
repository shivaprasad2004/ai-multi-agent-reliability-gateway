@echo off
echo ========================================
echo   REAL-TIME LOAD TEST
echo ========================================
echo.

if "%1"=="" (
    echo Usage: REALTIME_LOAD_TEST.bat [duration_seconds] [requests_per_second]
    echo.
    echo Examples:
    echo   REALTIME_LOAD_TEST.bat 60 5
    echo   REALTIME_LOAD_TEST.bat 120 10
    echo   REALTIME_LOAD_TEST.bat 300 20
    echo.
    echo Default: 60 seconds, 5 requests/second
    echo.
    set /p duration="Enter test duration in seconds (default 60): "
    if "!duration!"=="" set duration=60
    set /p rps="Enter requests per second (default 5): "
    if "!rps!"=="" set rps=5
) else (
    set duration=%1
    set rps=%2
    if "%rps%"=="" set rps=5
)

echo.
echo Starting load test:
echo   Duration: %duration% seconds
echo   Rate: %rps% requests/second
echo.
echo Press Ctrl+C to stop early
echo.

docker exec ai-gateway-backend node src/scripts/realTimeLoadTest.js %duration% %rps%

echo.
echo ========================================
echo   LOAD TEST COMPLETE
echo ========================================
pause

