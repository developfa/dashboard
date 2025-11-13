#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================"
echo "Dashboard Deployment on Server"
echo "========================================"
echo ""

# Navigate to project directory
cd /var/www/dashboard || {
    echo -e "${RED}ERROR: Project directory not found${NC}"
    exit 1
}

# Step 1: Pull latest changes from GitHub
echo -e "${YELLOW}[1/6] Pulling latest changes from GitHub...${NC}"
git pull origin claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i || {
    echo -e "${RED}ERROR: Git pull failed${NC}"
    exit 1
}
echo -e "${GREEN}SUCCESS: Git pull completed${NC}"
echo ""

# Step 2: Install dependencies
echo -e "${YELLOW}[2/6] Installing dependencies...${NC}"
npm install || {
    echo -e "${RED}ERROR: npm install failed${NC}"
    exit 1
}
echo -e "${GREEN}SUCCESS: Dependencies installed${NC}"
echo ""

# Step 3: Generate Prisma client
echo -e "${YELLOW}[3/6] Generating Prisma client...${NC}"
npx prisma generate || {
    echo -e "${RED}ERROR: Prisma generate failed${NC}"
    exit 1
}
echo -e "${GREEN}SUCCESS: Prisma client generated${NC}"
echo ""

# Step 4: Run database migrations
echo -e "${YELLOW}[4/6] Running database migrations...${NC}"
npx prisma migrate deploy || {
    echo -e "${YELLOW}WARNING: Migration failed or no migrations to apply${NC}"
}
echo ""

# Step 5: Build project
echo -e "${YELLOW}[5/6] Building project...${NC}"
npm run build || {
    echo -e "${RED}ERROR: Build failed${NC}"
    exit 1
}
echo -e "${GREEN}SUCCESS: Build completed${NC}"
echo ""

# Step 6: Restart PM2
echo -e "${YELLOW}[6/6] Restarting PM2...${NC}"
pm2 restart dashboard || {
    echo -e "${YELLOW}WARNING: PM2 restart failed, trying to start...${NC}"
    pm2 start ecosystem.config.js || {
        echo -e "${RED}ERROR: PM2 start failed${NC}"
        exit 1
    }
}
echo -e "${GREEN}SUCCESS: PM2 restarted${NC}"
echo ""

# Show PM2 status
echo -e "${YELLOW}Current PM2 status:${NC}"
pm2 status dashboard

echo ""
echo "========================================"
echo -e "${GREEN}Deployment completed successfully!${NC}"
echo "Dashboard is running at:"
echo "https://dash.englishfriend.kr"
echo "========================================"
