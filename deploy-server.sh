#!/bin/bash
echo "========================================"
echo "Dashboard Server Deployment"
echo "========================================"
echo ""

# 서버에서 실행할 배포 스크립트
# 사용법: ssh로 서버 접속 후 ./deploy-server.sh 실행

cd /var/www/dashboard

echo "[1/5] Pulling latest changes from GitHub..."
PACKAGE_JSON_BEFORE=$(md5sum package.json 2>/dev/null || echo "")
git pull origin claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i
if [ $? -ne 0 ]; then
    echo "ERROR: Git pull failed"
    exit 1
fi
PACKAGE_JSON_AFTER=$(md5sum package.json 2>/dev/null || echo "")
echo "SUCCESS: Pulled from GitHub"
echo ""

echo "[2/5] Checking dependencies..."
if [ "$PACKAGE_JSON_BEFORE" != "$PACKAGE_JSON_AFTER" ] || [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --production
    if [ $? -ne 0 ]; then
        echo "ERROR: npm install failed"
        exit 1
    fi
    echo "SUCCESS: Dependencies installed"
else
    echo "SKIP: Dependencies up to date"
fi
echo ""

echo "[3/5] Building application..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "SUCCESS: Build completed"
echo ""

echo "[4/5] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Prisma generate failed"
    exit 1
fi
echo "SUCCESS: Prisma client generated"
echo ""

echo "[5/5] Restarting PM2..."
pm2 restart dashboard --update-env || pm2 start ecosystem.config.js
if [ $? -ne 0 ]; then
    echo "ERROR: PM2 restart failed"
    exit 1
fi
echo "SUCCESS: PM2 restarted"
echo ""

echo "========================================"
echo "Deployment completed successfully!"
echo "Dashboard: https://dash.englishfriend.kr"
echo "========================================"
