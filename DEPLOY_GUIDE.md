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

### 전체 플로우

```
Claude Code for Web (브라우저에서 수정)
  ↓ (git push)
GitHub
  ↓ (deploy.bat 실행)
로컬 PC (D:\coding\dashboard)
  ↓ (SSH 배포)
Ubuntu Server (116.41.178.213)
```

### 단계별 실행

#### 1. Claude Code for Web에서 수정 및 푸시

```bash
# Claude Code for Web에서
git add .
git commit -m "수정 내용"
git push
```

#### 2. 로컬 PC에서 배포 스크립트 실행

```cmd
# D:\coding\dashboard로 이동
cd D:\coding\dashboard

# 배포 스크립트 실행 (자동으로 pull + 서버 배포)
deploy.bat
```

**deploy.bat가 자동으로 하는 일:**
1. ✅ WSL을 통해 deploy-rsync.sh 실행

---

## 📝 배포 스크립트 상세 (rsync 방식)

### deploy.bat (로컬 PC - Windows)
- WSL을 통해 deploy-rsync.sh를 실행합니다
- **WSL이 설치되어 있어야 합니다**

### deploy-rsync.sh (WSL에서 실행)
1. ✅ GitHub에서 최신 코드 pull
2. ✅ npm install (의존성 설치)
3. ✅ npm run build (로컬에서 빌드)
4. ✅ SSH 키 권한 수정
5. ✅ rsync로 변경된 파일만 서버에 전송 (.next 빌드 결과물 포함)
6. ✅ 서버에서 npm install --production
7. ✅ 서버에서 Prisma generate 및 PM2 restart

### 💡 rsync 방식의 장점
- ⚡ **변경된 파일만 전송** (훨씬 빠름!)
- 🏗️ **로컬에서 빌드** (서버 리소스 절약)
- 📦 **빌드 결과물도 전송** (서버에서 빌드 불필요)
- ⏱️ **배포 시간 대폭 단축**

### 대안: deploy-tar.bat (백업용)
rsync가 안 되면 기존 tar.gz 전송 방식 사용 가능

---

## 🔍 문제 해결

### 1. WSL이 설치되지 않은 경우

```cmd
# Windows에서 WSL 설치
wsl --install

# 설치 후 재부팅 필요
# 재부팅 후 Ubuntu 설정 (사용자 이름/비밀번호 입력)
```

**또는 대안: deploy-tar.bat 사용**
```cmd
deploy-tar.bat
```

### 2. "wsl: command not found" 오류

```cmd
# PowerShell 관리자 권한으로 실행
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 재부팅 후
wsl --install -d Ubuntu
```

### 3. rsync 오류

WSL Ubuntu에 rsync가 없는 경우:
```bash
# WSL에서
sudo apt update
sudo apt install rsync -y
```

### 4. SSH 연결 오류
```bash
# WSL에서 테스트
ssh -i /mnt/d/coding/.ssh/id_rsa_server -p 8897 root@116.41.178.213 "echo 'Connection OK'"
```

### 5. PM2 오류
```bash
# 서버에서
pm2 status
pm2 logs dashboard --lines 50
pm2 restart dashboard
```

### 6. 빌드 오류

로컬 빌드가 실패하면:
```bash
# 로컬 PC (WSL)에서
cd /mnt/d/coding/dashboard
rm -rf node_modules .next
npm install
npm run build
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
