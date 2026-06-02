# OnjeomFE

온점 : 세상을 온전히 읽는 힘 — 프론트엔드 (React + Vite)

---

## 기술 스택

| 분류 | 기술 |
|------|------|
| 언어 | JavaScript (ES2022+) |
| 프레임워크 | React 18 |
| 빌드 | Vite |
| 라우팅 | React Router v6 |
| HTTP | Axios (api/client.js) |
| 아이콘 | lucide-react |

---

## 시작하기

```bash
npm install
npm run dev
```

개발 서버: `http://localhost:5173`

---

## 페이지 구조

```
src/pages/
├── auth/
│   ├── Login.jsx              # 학습자 로그인
│   ├── Signup.jsx             # 회원가입
│   ├── EmailVerification.jsx  # 이메일 인증
│   ├── PasswordReset.jsx      # 비밀번호 재설정
│   ├── PasswordResetRequest.jsx
│   ├── AdminLogin.jsx         # 관리자 로그인
│   └── SessionExpired.jsx     # 세션 만료 안내
├── onboarding/
│   ├── DiagnosisTest.jsx      # 적응형 진단 테스트 (10문제, IRT 기반)
│   ├── DiagnosisResult.jsx    # 진단 결과 (레이더 차트 + 레벨)
│   └── GoalSetting.jsx        # 일일 목표 설정
├── learner/
│   ├── LearnerDashboard.jsx   # 학습 현황 대시보드
│   ├── LearningAnalytics.jsx  # 역량 분석
│   ├── LearnerReview.jsx      # 복습 아카이브 + 성취도 차트
│   └── today/
│       ├── LearnerStudy.jsx   # 오늘의 학습 (지문 + 답변 + AI 튜터)
│       └── LearnerResult.jsx  # 채점 결과 (점수 + 피드백 + 키워드)
├── admin/
│   ├── AdminQuestionManagement.jsx  # 문제 관리 (등록 / AI 생성 / 수정 / 삭제)
│   ├── AdminCurriculum.jsx          # 커리큘럼 관리
│   ├── AdminStats.jsx               # 통계
│   └── AdminTagManagement.jsx       # 태그 관리
├── profile/
│   └── Profile.jsx            # 프로필 (설정 / 보안 / 알림)
└── landing/
    └── Landing.jsx            # 랜딩 페이지
```

---

## 서비스 레이어

```
src/data/services/
├── studyService.js      # 오늘의 학습 세션 (커리큘럼 → 문제 조회)
├── responseService.js   # 답변 제출 + 결과 조회
├── reviewService.js     # 복습 아카이브 데이터
├── curriculumService.js # 커리큘럼 API
├── diagnosisService.js  # 진단 테스트 흐름
├── problemService.js    # 문제 상세 조회
├── aiTutorService.js    # AI 튜터 질문
├── authService.js       # 로그인 / 회원가입
├── userService.js       # 프로필 관리
├── dashboardService.js  # 대시보드 데이터
├── analyticsService.js  # 역량 분석 데이터
├── learnerService.js    # 학습자 공통
└── adminService.js      # 관리자 공통
```

---

## API 클라이언트

```
src/api/
├── client.js          # Axios 인스턴스 + 인터셉터 (JWT, 401 처리)
├── authApi.js
├── problemApi.js
├── responseApi.js
├── curriculumApi.js
├── diagnosticApi.js
├── learningApi.js
├── reviewApi.js
├── aiApi.js
├── writingApi.js
├── highlightApi.js
├── dashboardApi.js
├── notificationApi.js
├── cmsApi.js
├── adminApi.js
└── userApi.js
```

---

## 주요 흐름

```
신규 사용자
  → DiagnosisTest (10문제 IRT 적응형)
  → DiagnosisResult (레이더 차트 + 레벨)
  → GoalSetting (일일 목표)
  → LearnerDashboard

매일 학습
  → LearnerStudy (지문 읽기 + 답변 작성 + AI 튜터)
  → LearnerResult (점수 + 피드백 + 키워드)
  → LearnerReview (복습 필요 문제 확인)
```

---

## 브랜치 전략

```
main          # 배포용
develop       # 통합 테스트용
feat/*        # 기능 개발
fix/*         # 버그 수정
```
