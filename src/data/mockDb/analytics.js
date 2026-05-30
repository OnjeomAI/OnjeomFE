// 대시보드와 학습 분석 화면에서 사용하는 학습 통계 원천 데이터를 보관합니다.
export const dashboardSummary = {
    learnerId: "user-learner-001",
    completedCount: 7,
    studyMinutes: 32,
    studyTimeChangeRate: 12,
    averageScore: 74,
    scoreTrend: "stable",
};

export const abilitySnapshots = [
    { key: "vocabulary", label: "어휘력", current: 78, previous: 72 },
    { key: "reading", label: "독해력", current: 82, previous: 76 },
    { key: "speaking", label: "말하기", current: 70, previous: 68 },
    { key: "listening", label: "듣기", current: 86, previous: 80 },
    { key: "grammar", label: "문법", current: 74, previous: 71 },
];

export const weaknessSnapshots = [
    { key: "inferential-reading", label: "추론적 독해", percent: 42 },
    { key: "context-understanding", label: "문맥 파악", percent: 58 },
];

export const recentStudyRecords = [
    {
        id: "record-001",
        title: "고전 문학: 이상의 '날개' 분석",
        completedAt: "2026-05-10T21:15:00+09:00",
        score: 88,
    },
    {
        id: "record-002",
        title: "사설: AI 큐레이션의 윤리적 쟁점",
        completedAt: "2026-05-09T20:10:00+09:00",
        score: 54,
    },
    {
        id: "record-003",
        title: "문법: 상황에 따른 높임 표현의 활용",
        completedAt: "2026-05-08T19:30:00+09:00",
        score: 72,
    },
];

export const learningAnalytics = {
    learnerId: "user-learner-001",
    periodTabs: ["일간", "주간", "월간"],
    summary: {
        totalSolvedCount: 1284,
        totalSolvedChangeRate: 12,
        totalStudyMinutes: 8550,
        averageAccuracy: 88.5,
        weeklySolvedCount: 42,
        weeklyGoalCount: 50,
    },
    scoreTrend: [
        { day: "월", score: 62 },
        { day: "화", score: 70 },
        { day: "수", score: 67 },
        { day: "목", score: 78 },
        { day: "금", score: 75 },
        { day: "토", score: 86 },
        { day: "일", score: 83 },
    ],
    studyMinutes: [
        { day: "월", minutes: 28 },
        { day: "화", minutes: 46 },
        { day: "수", minutes: 21 },
        { day: "목", minutes: 64 },
        { day: "금", minutes: 54 },
        { day: "토", minutes: 38 },
        { day: "일", minutes: 59 },
    ],
    abilityStats: [
        {
            id: "ability-001",
            title: "사실적 이해",
            level: "심화 (DEEP)",
            score: 94,
            change: 12,
            expanded: false,
        },
        {
            id: "ability-002",
            title: "추론적 사고",
            level: "고급 (ADVANCED)",
            score: 78,
            change: -3,
            expanded: false,
        },
        {
            id: "ability-003",
            title: "비판적 평가",
            level: "중급 (INTERMEDIATE)",
            score: 62,
            change: 8,
            expanded: true,
            recentHistory: [
                { title: "흄의 철학적 논증 분석", date: "2023-10-24T20:00:00+09:00", score: 85 },
                { title: "인플레이션의 경제 모델링", date: "2023-10-22T20:00:00+09:00", score: 45 },
                { title: "비교 문학: 제임스 조이스", date: "2023-10-20T20:00:00+09:00", score: 72 },
            ],
        },
        {
            id: "ability-004",
            title: "맥락적 통합",
            level: "초급 (BEGINNER)",
            score: 34,
            change: 5,
            expanded: false,
        },
        {
            id: "ability-005",
            title: "어휘 구사력",
            level: "심화 (DEEP)",
            score: 98,
            change: null,
            expanded: false,
        },
    ],
};
