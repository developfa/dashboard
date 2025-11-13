@echo off
echo ========================================
echo Dashboard Deployment Script (File Transfer)
echo ========================================
echo.

REM Step 1: Pull latest changes from GitHub
echo [1/5] Pulling latest changes from GitHub...
git pull origin claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i
if %errorlevel% neq 0 (
    echo ERROR: Failed to pull from GitHub
    pause
    exit /b 1
)
echo SUCCESS: Pulled latest changes from GitHub
echo.

REM Step 2: Create tarball (exclude git, node_modules, .next)
echo [2/5] Creating archive...
tar --exclude=".git" --exclude="node_modules" --exclude=".next" --exclude="*.tar.gz" -czf dashboard.tar.gz .
if %errorlevel% neq 0 (
    echo ERROR: Failed to create archive
    pause
    exit /b 1
)
echo SUCCESS: Archive created
echo.

REM Step 3: Fix SSH key permissions
echo [3/5] Preparing SSH connection...
icacls "D:\coding\.ssh\id_rsa_server" /remove "NT AUTHORITY\Authenticated Users" >nul 2>&1
icacls "D:\coding\.ssh\id_rsa_server" /inheritance:r >nul 2>&1
icacls "D:\coding\.ssh\id_rsa_server" /grant:r "%USERNAME%:(R)" >nul 2>&1
echo.

REM Step 4: Upload to server
echo [4/5] Uploading to server...
scp -i D:\coding\.ssh\id_rsa_server -P 8897 dashboard.tar.gz root@116.41.178.213:/tmp/
if %errorlevel% neq 0 (
    echo ERROR: Failed to upload files
    del dashboard.tar.gz
    pause
    exit /b 1
)
echo SUCCESS: Files uploaded
echo.

REM Step 5: Deploy on server
echo [5/5] Deploying on server...
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "cd /var/www/dashboard && rm -rf .next && tar -xzf /tmp/dashboard.tar.gz && rm /tmp/dashboard.tar.gz && npm install && npx prisma generate && npx prisma migrate deploy && npm run build && pm2 restart dashboard || pm2 start ecosystem.config.js"
if %errorlevel% neq 0 (
    echo ERROR: Deployment failed on server
    del dashboard.tar.gz
    pause
    exit /b 1
)
echo.

REM Cleanup
del dashboard.tar.gz

echo ========================================
echo Deployment completed successfully!
echo Dashboard is now live at:
echo https://dash.englishfriend.kr
echo ========================================
pause
