@echo off
echo ========================================
echo   CHECKING APPLICATION STATUS
echo ========================================
echo.

echo [1] Docker Status:
docker --version
docker ps >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop
    goto :end
) else (
    echo Docker is running
)
echo.

echo [2] Container Status:
docker-compose ps
echo.

echo [3] Frontend Container:
docker ps -a | findstr frontend
echo.

echo [4] Backend Container:
docker ps -a | findstr backend
echo.

echo [5] MySQL Container:
docker ps -a | findstr mysql
echo.

echo [6] Recent Frontend Logs:
docker-compose logs --tail=10 frontend
echo.

echo [7] Recent Backend Logs:
docker-compose logs --tail=10 backend
echo.

echo [8] Testing Backend:
curl -s http://localhost:4000/health
echo.
echo.

echo [9] Port Check:
echo Port 3000:
netstat -ano | findstr :3000
echo Port 4000:
netstat -ano | findstr :4000
echo.

:end
echo ========================================
echo   STATUS CHECK COMPLETE
echo ========================================
pause

