@echo off
echo ========================================
echo Dashboard Simple Deployment
echo ========================================
echo.
echo This script connects to the server and runs deployment
echo.

REM SSH 접속 정보
set SERVER=root@116.41.178.213
set PORT=8897
set SSH_KEY=D:\coding\.ssh\id_rsa_server

echo Connecting to server and running deployment...
echo.

ssh -i "%SSH_KEY%" -p %PORT% %SERVER% "cd /var/www/dashboard && bash deploy-server.sh"

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
echo Deployment completed successfully!
echo Dashboard: https://dash.englishfriend.kr
echo ========================================
pause
