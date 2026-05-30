// 사용자 계정과 로그인 인증 정보를 보관하는 mock DB 원천 데이터입니다.
export const users = [
    {
        id: "user-learner-001",
        role: "learner",
        displayName: "김상우",
        levelLabel: "학습자 레벨 4",
        nickname: "김상우",
        email: "ksw@onjeom.ai",
        joinedAt: "2023년 9월부터 활동 중",
        dailyGoal: 10,
        fontSize: 100,
        learningState: {
            hasCompletedDiagnosis: false,
            todayStudyStatus: "NOT_STARTED",
            todayStudyCompletedAt: null,
        },
        notificationSettings: {
            reviewReminder: true,
            goalEncouragement: true,
            weaknessReport: false,
            achievementMessage: true,
        },
    },
    {
        id: "user-admin-001",
        role: "admin",
        displayName: "관리자",
        levelLabel: "시스템 관리자",
        nickname: "관리자",
        email: "admin@onjeom.ai",
        joinedAt: "관리자 계정",
        fontSize: 100,
    },
];

export const credentials = [
    {
        email: "ksw@onjeom.ai",
        password: "12345678",
        userId: "user-learner-001",
    },
    {
        email: "admin@onjeom.ai",
        password: "admin1234",
        userId: "user-admin-001",
    },
];
