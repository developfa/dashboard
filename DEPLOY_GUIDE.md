# 🚀 간편 배포 가이드

## 📋 사전 준비 (최초 1회만)

### 1. 서버에 프로젝트 설정

```bash
# 서버 접속
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213

# 프로젝트 클론 (아직 안 했다면)
cd /var/www
git clone https://github.com/developfa/dashboard.git
cd dashboard

# 브랜치 체크아웃
git checkout claude/push-local-changes-011CV59qCrqZCBJTBFnkeG9i

# 의존성 설치
npm install

# 환경 변수 설정
nano .env
# .env 파일에 필요한 환경 변수 입력 (DEPLOYMENT.md 참고)

# Prisma 설정
npx prisma generate
npx prisma migrate deploy

# 빌드
npm run build

# PM2로 시작
pm2 start ecosystem.config.js
pm2 save

# deploy.sh 실행 권한 부여
chmod +x /var/www/dashboard/deploy.sh
```

### 2. 로컬 컴퓨터에 deploy.bat 위치

배포 스크립트는 `D:\coding\dashboard\deploy.bat`에 있습니다.

---

## 🎯 배포 방법 (매번 사용)

### Claude Code에서 수정 후

#### 방법 A: 수동 푸시 + 배포 스크립트 실행

1. **Claude Code에서 변경사항 커밋 및 푸시**
   ```bash
   git add .
   git commit -m "수정 내용"
   git push
   ```

2. **로컬 컴퓨터에서 배포 스크립트 실행**
   ```cmd
   # D:\coding\dashboard로 이동
   cd D:\coding\dashboard

   # 배포 스크립트 실행
   deploy.bat
   ```

#### 방법 B: 한 번에 처리 (로컬에서)

```cmd
# D:\coding\dashboard로 이동
cd D:\coding\dashboard

# 최신 변경사항 가져오기
git pull

# 배포 스크립트 실행
deploy.bat
```

---

## 📝 배포 스크립트가 하는 일

### deploy.bat (로컬)
1. ✅ GitHub로 push
2. ✅ SSH로 서버 접속
3. ✅ 서버의 deploy.sh 실행

### deploy.sh (서버)
1. ✅ Git pull (최신 코드 가져오기)
2. ✅ npm install (의존성 설치)
3. ✅ npx prisma generate (Prisma 클라이언트 생성)
4. ✅ npx prisma migrate deploy (DB 마이그레이션)
5. ✅ npm run build (프로젝트 빌드)
6. ✅ pm2 restart dashboard (서버 재시작)

---

## 🔍 문제 해결

### 배포 스크립트 실행이 안 되는 경우

#### 1. SSH 연결 오류
```cmd
# SSH 연결 테스트
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "echo 'Connection OK'"
```

#### 2. 권한 오류
```bash
# 서버에서
chmod +x /var/www/dashboard/deploy.sh
```

#### 3. Git pull 충돌
```bash
# 서버에서
cd /var/www/dashboard
git status
git stash  # 로컬 변경사항 임시 저장
git pull
```

#### 4. PM2 오류
```bash
# 서버에서
pm2 status
pm2 logs dashboard --lines 50
pm2 restart dashboard
```

---

## 🎉 배포 완료 확인

배포가 완료되면 다음 URL로 접속:
- **https://dash.englishfriend.kr**

PM2 상태 확인:
```bash
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "pm2 status"
```

---

## 💡 팁

### 빠른 배포를 위한 바로가기

1. **deploy.bat 바로가기 만들기**
   - `D:\coding\dashboard\deploy.bat` 우클릭
   - "바로가기 만들기"
   - 바로가기를 바탕화면이나 원하는 위치로 이동

2. **커맨드 창에서 바로 실행**
   - Windows + R
   - `cmd` 입력
   - `D:\coding\dashboard\deploy.bat` 입력

### 배포 전 체크리스트

- [ ] .env 파일에 모든 API 키가 설정되어 있는지 확인
- [ ] Prisma 스키마 변경 시 마이그레이션 파일 생성
- [ ] 로컬에서 빌드 테스트 (`npm run build`)
- [ ] Git 커밋 메시지 확인

---

## 📊 모니터링

### 서버 로그 확인
```bash
# PM2 로그
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "pm2 logs dashboard --lines 100"

# Apache 로그
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "tail -f /var/log/apache2/dashboard-error.log"
```

### PM2 모니터링
```bash
ssh -i D:\coding\.ssh\id_rsa_server -p 8897 root@116.41.178.213 "pm2 monit"
```

---

**문제가 발생하면 DEPLOYMENT.md를 참고하세요!**
