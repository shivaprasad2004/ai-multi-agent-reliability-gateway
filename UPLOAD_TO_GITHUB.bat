@echo off
echo ========================================
echo   PREPARING FOR GITHUB UPLOAD
echo ========================================
echo.

echo Checking for sensitive data...
if exist .env (
    echo WARNING: .env file found! Make sure it's in .gitignore
    pause
)

echo.
echo Step 1: Checking git status...
git status
echo.

echo Step 2: Review files to be committed...
echo Press any key to continue or Ctrl+C to cancel...
pause

echo.
echo Step 3: Adding all files...
git add .
echo.

echo Step 4: Creating commit...
git commit -m "Initial commit: AI Multi-Agent Reliability Gateway v1.0.0

- Multi-agent pipeline (Generator ^> Safety ^> Quality)
- Provider adapters (OpenAI, Gemini, Mock)
- Reliability layer (retries, timeouts, fallback, circuit breaker)
- Guardrails (PII, toxicity, validation)
- Caching system with MySQL
- Comprehensive metrics and dashboard
- Docker Compose setup
- Complete documentation"
echo.

echo ========================================
echo   READY FOR GITHUB
echo ========================================
echo.
echo Next steps:
echo   1. Create repository on GitHub
echo   2. Run: git remote add origin YOUR_GITHUB_URL
echo   3. Run: git push -u origin main
echo.
echo See GITHUB_SETUP.md for complete instructions
echo.
pause

