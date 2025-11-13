#!/bin/bash
echo "========================================"
echo "Dashboard Deployment (rsync)"
echo "========================================"
echo ""

# Variables
SERVER="root@116.41.178.213"
PORT="8897"
REMOTE_PATH="/var/www/dashboard"
SSH_KEY="/mnt/d/coding/.ssh/id_rsa_server"

echo "[1/6] Pulling latest changes from GitHub..."
git pull origin claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i
if [ $? -ne 0 ]; then
    echo "ERROR: Git pull failed"
    exit 1
fi
echo "SUCCESS: Pulled from GitHub"
echo ""

echo "[2/6] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: npm install failed"
    exit 1
fi
echo "SUCCESS: Dependencies installed"
echo ""

echo "[3/6] Building locally..."
npm run build
if [ $? -ne 0 ]; then
    echo "ERROR: Build failed"
    exit 1
fi
echo "SUCCESS: Build completed"
echo ""

echo "[4/6] Fixing SSH key permissions..."
chmod 600 "$SSH_KEY" 2>/dev/null
echo ""

echo "[5/6] Syncing files to server (including .next build)..."
rsync -avz --delete \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.tar.gz' \
    --exclude='.env.local' \
    --exclude='prod.db' \
    --exclude='*.db' \
    -e "ssh -i $SSH_KEY -p $PORT" \
    ./ $SERVER:$REMOTE_PATH/
if [ $? -ne 0 ]; then
    echo "ERROR: rsync failed"
    exit 1
fi
echo "SUCCESS: Files synced"
echo ""

echo "[6/6] Installing dependencies and restarting on server..."
ssh -i "$SSH_KEY" -p $PORT $SERVER "cd $REMOTE_PATH && npm install --production && npx prisma generate && pm2 restart dashboard --update-env || pm2 start ecosystem.config.js"
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to restart"
    exit 1
fi
echo "SUCCESS: Server restarted"
echo ""

echo "========================================"
echo "Deployment completed successfully!"
echo "Dashboard: https://dash.englishfriend.kr"
echo "========================================"
