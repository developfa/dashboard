# 개인 대시보드 (Personal Dashboard)

나만의 정보를 한눈에 확인할 수 있는 개인용 대시보드입니다.

## ✨ 주요 기능

- 📰 **주요 뉴스**: Google News에서 경제, IT, 세계, 건강 뉴스 가져오기
- 🌤️ **날씨 정보**: 실시간 날씨 및 3시간 간격 예보
- 💱 **환율 정보**: 주요 통화 환율 (USD, JPY, EUR, CNY)
- 📈 **주식 정보**: 실시간 주식 가격 및 변동률
- 📧 **Gmail**: 받은편지함 최근 메일 확인
- 📅 **Google Calendar**: 다가오는 일정 확인 (2주)
- ⚙️ **사용자 설정**: 자동 새로고침 주기 조정 (1~60분)

## 🛠️ 기술 스택

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Icons**

### Backend
- **Next.js API Routes**
- **NextAuth.js** (Google OAuth 2.0)
- **Prisma** (ORM)
- **SQLite** (Database)

### API 통합
- **Google News RSS**
- **OpenWeatherMap API** (날씨)
- **ExchangeRate-API** (환율)
- **Alpha Vantage API** (주식)
- **Gmail API**
- **Google Calendar API**

## 🚀 시작하기

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **환경 변수 설정**
   ```bash
   cp .env.local .env
   ```

   `.env` 파일을 열어 API 키를 입력하세요:
   - Google OAuth 클라이언트 ID/시크릿
   - OpenWeatherMap API 키
   - ExchangeRate API 키
   - Alpha Vantage API 키

4. **Prisma 설정**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **개발 서버 실행**
   ```bash
   npm run dev
   ```

   브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📦 프로젝트 구조

```
dashboard/
├── app/                      # Next.js App Router
│   ├── api/                 # API Routes
│   │   ├── auth/           # NextAuth
│   │   ├── news/           # 뉴스 API
│   │   ├── weather/        # 날씨 API
│   │   ├── currency/       # 환율 API
│   │   ├── stock/          # 주식 API
│   │   ├── gmail/          # Gmail API
│   │   └── calendar/       # Calendar API
│   ├── dashboard/          # 대시보드 페이지
│   ├── settings/           # 설정 페이지
│   └── page.tsx            # 로그인 페이지
├── components/
│   ├── widgets/            # 위젯 컴포넌트
│   │   ├── NewsWidget.tsx
│   │   ├── WeatherWidget.tsx
│   │   ├── CurrencyWidget.tsx
│   │   ├── StockWidget.tsx
│   │   ├── GmailWidget.tsx
│   │   └── CalendarWidget.tsx
│   └── ui/                 # UI 컴포넌트
│       └── Card.tsx
├── lib/                     # 유틸리티
│   ├── prisma.ts           # Prisma 클라이언트
│   └── auth.ts             # NextAuth 설정
├── prisma/
│   └── schema.prisma       # 데이터베이스 스키마
├── Dockerfile              # Docker 설정
├── docker-compose.yml      # Docker Compose
├── ecosystem.config.js     # PM2 설정
└── DEPLOYMENT.md           # 배포 가이드
```

## 🔐 API 키 발급 가이드

자세한 API 키 발급 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

### 필수 API 키
1. **Google OAuth** - Gmail, Calendar 연동
2. **OpenWeatherMap** - 날씨 정보
3. **ExchangeRate-API** - 환율 정보
4. **Alpha Vantage** - 주식 정보

## 🌐 배포

서버 배포 방법은 [DEPLOYMENT.md](./DEPLOYMENT.md)를 참조하세요.

- PM2를 이용한 배포 (권장)
- Docker를 이용한 배포
- Apache 리버스 프록시 설정
- SSL 인증서 설정

## 📝 환경 변수

| 변수 | 설명 | 필수 |
|------|------|------|
| `DATABASE_URL` | SQLite 데이터베이스 경로 | ✅ |
| `NEXTAUTH_URL` | NextAuth 콜백 URL | ✅ |
| `NEXTAUTH_SECRET` | NextAuth 시크릿 키 | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth 클라이언트 ID | ✅ |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 시크릿 | ✅ |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API 키 | ✅ |
| `EXCHANGERATE_API_KEY` | ExchangeRate API 키 | ✅ |
| `ALPHAVANTAGE_API_KEY` | Alpha Vantage API 키 | ✅ |

## 🎨 사용자 설정

대시보드의 "설정" 페이지에서:
- 자동 새로고침 주기 조정 (1~60분)
- API 키 설정 가이드 확인

## 🤝 기여

이슈나 풀 리퀘스트를 환영합니다!

## 📄 라이선스

MIT License

## 👤 작성자

개인 프로젝트

## 🙏 감사

- Next.js
- Tailwind CSS
- Prisma
- NextAuth.js
- 모든 API 제공업체들
