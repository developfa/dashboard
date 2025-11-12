# 개인 대시보드 배포 가이드

## 🎯 개요

이 가이드는 Ubuntu 24.04 서버에 개인 대시보드를 배포하는 방법을 안내합니다.

## 📋 사전 요구사항

- Ubuntu 24.04 서버
- Node.js 20.x 설치
- PM2 설치
- Apache 웹서버
- Git

## 🔑 필요한 설정

배포 전에 다음 설정들을 준비해야 합니다:

### 1. 사용자 인증 정보

개인용 대시보드이므로 간단한 이메일/비밀번호 인증을 사용합니다.
환경 변수에서 설정할 정보:
- `USER_EMAIL`: 로그인에 사용할 이메일 주소
- `USER_PASSWORD`: 로그인 비밀번호 (안전한 비밀번호 사용 권장)
- `USER_NAME`: 대시보드에 표시될 사용자 이름

1. [OpenWeatherMap](https://openweathermap.org/api) 접속
2. 무료 플랜 가입 (1분당 60회 호출 가능)
3. API 키 복사

### 3. ExchangeRate-API

1. [ExchangeRate-API](https://www.exchangerate-api.com/) 접속
2. 무료 플랜 가입 (월 1,500회 호출 가능)
3. API 키 복사

### 4. Alpha Vantage API (주식)

1. [Alpha Vantage](https://www.alphavantage.co/support/#api-key) 접속
2. 무료 API 키 신청 (일 25회 호출 가능)
3. API 키 복사

## 🚀 배포 방법 1: PM2 사용 (권장)

### 1. 서버에 프로젝트 복사

```bash
# 서버 접속
ssh -p 8897 root@116.41.178.213

# 프로젝트 디렉토리로 이동
cd /var/www

# Git 저장소 클론
git clone <your-repo-url> dashboard
cd dashboard

# 의존성 설치
npm install

# Prisma 클라이언트 생성
npx prisma generate

# Prisma 마이그레이션
npx prisma migrate deploy
```

### 2. 환경 변수 설정

```bash
# .env 파일 생성
cp .env.production .env

# .env 파일 편집
nano .env
```

`.env` 파일에 실제 API 키 입력:

```env
DATABASE_URL="file:./prod.db"
NEXTAUTH_URL=https://dash.englishfriend.kr
NEXTAUTH_SECRET=your-random-secret-here-use-openssl-rand-base64-32

USER_EMAIL=your-email@example.com
USER_PASSWORD=your-secure-password
USER_NAME=사용자이름

OPENWEATHER_API_KEY=your-openweather-api-key
EXCHANGERATE_API_KEY=your-exchangerate-api-key
ALPHAVANTAGE_API_KEY=your-alphavantage-api-key
```

NEXTAUTH_SECRET 생성:
```bash
openssl rand -base64 32
```

### 3. 프로젝트 빌드

```bash
npm run build
```

### 4. PM2로 실행

```bash
# PM2 시작
pm2 start npm --name "dashboard" -- start

# 또는 ecosystem 파일 사용
pm2 start ecosystem.config.js

# 부팅 시 자동 시작 설정
pm2 save
pm2 startup
```

### 5. Apache 가상 호스트 설정

```bash
# Apache 설정 파일 생성
sudo nano /etc/apache2/sites-available/dash.englishfriend.kr.conf
```

다음 내용 입력:

```apache
<VirtualHost *:80>
    ServerName dash.englishfriend.kr

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/dashboard-error.log
    CustomLog ${APACHE_LOG_DIR}/dashboard-access.log combined
</VirtualHost>
```

```bash
# 사이트 활성화
sudo a2ensite dash.englishfriend.kr.conf

# Apache 재시작
sudo systemctl reload apache2
```

### 6. SSL 인증서 설치

```bash
# Certbot으로 SSL 인증서 발급
sudo certbot --apache -d dash.englishfriend.kr

# 자동으로 HTTPS 리디렉션 설정됨
```

## 🐳 배포 방법 2: Docker 사용

### 1. 환경 변수 설정

```bash
# .env 파일 생성 (위의 방법 1과 동일)
cp .env.production .env
nano .env
```

### 2. Docker 이미지 빌드 및 실행

```bash
# Docker 이미지 빌드
docker-compose build

# 컨테이너 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

### 3. Apache 설정 (포트 3000으로 프록시)

위의 "방법 1"의 Apache 설정과 동일하게 진행

## 🔄 업데이트 방법

### PM2 사용 시

```bash
cd /var/www/dashboard

# 최신 코드 가져오기
git pull

# 의존성 업데이트
npm install

# Prisma 재생성
npx prisma generate

# 마이그레이션
npx prisma migrate deploy

# 빌드
npm run build

# PM2 재시작
pm2 restart dashboard
```

### Docker 사용 시

```bash
cd /var/www/dashboard

# 최신 코드 가져오기
git pull

# 컨테이너 재빌드 및 재시작
docker-compose down
docker-compose build
docker-compose up -d
```

## 🛠️ 유용한 명령어

### PM2 관리

```bash
# 상태 확인
pm2 status

# 로그 확인
pm2 logs dashboard

# 재시작
pm2 restart dashboard

# 중지
pm2 stop dashboard

# 삭제
pm2 delete dashboard
```

### Docker 관리

```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f

# 컨테이너 재시작
docker-compose restart

# 컨테이너 중지
docker-compose down
```

## 🔍 문제 해결

### 포트 3000이 이미 사용 중인 경우

```bash
# 포트 사용 확인
sudo lsof -i :3000

# 프로세스 종료
sudo kill -9 <PID>
```

### Prisma 클라이언트 생성 실패

```bash
# node_modules 삭제 후 재설치
rm -rf node_modules
npm install
npx prisma generate
```

### 로그인 실패 문제

1. `.env` 파일의 `USER_EMAIL`과 `USER_PASSWORD` 확인
2. 로그인 시 입력한 이메일과 비밀번호가 정확한지 확인
3. `.env` 파일의 `NEXTAUTH_URL`과 `NEXTAUTH_SECRET` 확인

## 📊 모니터링

### PM2 모니터링

```bash
# PM2 모니터링 대시보드
pm2 monit

# 또는 웹 기반 모니터링
pm2 plus
```

### 로그 확인

```bash
# Apache 로그
sudo tail -f /var/log/apache2/dashboard-access.log
sudo tail -f /var/log/apache2/dashboard-error.log

# PM2 로그
pm2 logs dashboard

# Docker 로그
docker-compose logs -f
```

## 🎉 완료!

배포가 완료되었습니다! `https://dash.englishfriend.kr`에 접속하여 대시보드를 사용하세요.

## 📝 참고사항

- API 호출 제한에 주의하세요 (무료 플랜 기준)
- 정기적으로 백업을 수행하세요 (특히 SQLite 데이터베이스)
- 보안을 위해 `.env` 파일 권한을 제한하세요: `chmod 600 .env`
- Google OAuth 스코프가 충분한지 확인하세요
