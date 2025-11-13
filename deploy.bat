@echo off
echo ========================================
echo Dashboard Deployment Script
echo ========================================
echo.

REM Step 1: Pull latest changes from GitHub
echo [1/3] Pulling latest changes from GitHub...
git pull origin claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i
if %errorlevel% neq 0 (
    echo ERROR: Failed to pull from GitHub
    pause
    exit /b 1
)
echo SUCCESS: Pulled latest changes from GitHub
echo.

REM Step 2: Deploy to server via SSH
echo [2/3] Deploying to server...
REM Fix SSH key permissions silently
icacls "D:\coding\.ssh\id_rsa_server" /remove "NT AUTHORITY\Authenticated Users" >nul 2>&1
icacls "D:\coding\.ssh\id_rsa_server" /inheritance:r >nul 2>&1
icacls "D:\coding\.ssh\id_rsa_server" /grant:r "%USERNAME%:(R)" >nul 2>&1
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "bash /var/www/dashboard/deploy.sh"
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)
echo.

REM Step 3: Done
echo [3/3] Deployment completed!
echo ========================================
echo Dashboard is now live at:
echo https://dash.englishfriend.kr
echo ========================================
pause
