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

REM Fix line endings before running
echo Checking dos2unix availability...
wsl dos2unix --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing dos2unix in WSL...
    wsl sudo apt update && wsl sudo apt install dos2unix -y
)

echo Converting line endings in deploy-rsync.sh...
wsl dos2unix /mnt/d/coding/dashboard/deploy-rsync.sh

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
