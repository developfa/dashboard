#!/bin/bash

# 색상 정의
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Dashboard 배포 스크립트${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

# .env 파일 확인
if [ ! -f .env ]; then
    echo -e "${RED}오류: .env 파일이 없습니다!${NC}"
    echo -e "${YELLOW}.env.example을 복사하여 .env 파일을 생성하고 API 키를 입력하세요.${NC}"
    echo ""
    echo "다음 명령어를 실행하세요:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    exit 1
fi

echo -e "${YELLOW}1. 의존성 설치 중...${NC}"
npm install

echo ""
echo -e "${YELLOW}2. Prisma 클라이언트 생성 중...${NC}"
npx prisma generate

echo ""
echo -e "${YELLOW}3. Prisma 마이그레이션 실행 중...${NC}"
npx prisma migrate deploy

echo ""
echo -e "${YELLOW}4. Next.js 프로젝트 빌드 중...${NC}"
npm run build

echo ""
echo -e "${GREEN}✓ 빌드 완료!${NC}"
echo ""
echo -e "${YELLOW}다음 명령어로 서버를 시작하세요:${NC}"
echo ""
echo -e "  ${GREEN}PM2 사용:${NC}"
echo "    pm2 start npm --name \"dashboard\" -- start"
echo "    pm2 save"
echo ""
echo -e "  ${GREEN}또는 직접 실행:${NC}"
echo "    npm start"
echo ""
echo -e "${GREEN}================================${NC}"
