@echo off
echo ========================================
echo Dashboard Deployment Script (rsync)
echo ========================================
echo.
echo This script uses WSL to run deploy-rsync.sh
echo Make sure WSL is installed on your system
echo.
echo Starting deployment...
echo.

REM Run deploy-rsync.sh via WSL
wsl bash -c "cd /mnt/d/coding/dashboard && bash deploy-rsync.sh"

if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo ERROR: Deployment failed!
    echo ========================================
    pause
    exit /b 1
)

echo.
echo ========================================
echo All done! Press any key to exit.
echo ========================================
pause
