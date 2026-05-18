import {
    formatStudyDuration,
    getChangeType,
    getScoreType,
} from "./mockFormatters.js";

const mockAnalyticsData = {
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
                {
                    title: "흄의 철학적 논증 분석",
                    date: "2023년 10월 24일",
                    score: 85,
                },
                {
                    title: "인플레이션의 경제 모델링",
                    date: "2023년 10월 22일",
                    score: 45,
                },
                {
                    title: "비교 문학: 제임스 조이스",
                    date: "2023년 10월 20일",
                    score: 72,
                },
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

function getSummaryCards(summary) {
    const studyDuration = formatStudyDuration(summary.totalStudyMinutes);

    return [
        {
            id: "total",
            label: "누적 풀이 문항 수",
            value: summary.totalSolvedCount.toLocaleString(),
            suffix: "",
            subText: `↗ +${summary.totalSolvedChangeRate}%`,
            accent: true,
        },
        {
            id: "time",
            label: "총 학습 시간",
            value: studyDuration.value,
            suffix: studyDuration.suffix,
            subText: "◷",
            accent: false,
        },
        {
            id: "accuracy",
            label: "평균 정답률",
            value: String(summary.averageAccuracy),
            suffix: "%",
            subText: "",
            accent: false,
        },
        {
            id: "weekly",
            label: "이번 주 풀이 수",
            value: String(summary.weeklySolvedCount),
            suffix: "",
            subText: `목표: ${summary.weeklyGoalCount}`,
            accent: false,
        },
    ];
}

function hydrateAbilityStats(abilityStats) {
    return abilityStats.map((ability) => ({
        ...ability,
        changeType: getChangeType(ability.change),
        change:
            ability.change === null
                ? null
                : Math.abs(ability.change),
        recentHistory: ability.recentHistory?.map((history) => ({
            ...history,
            scoreType: getScoreType(history.score),
        })),
    }));
}

export function getMockAnalyticsData() {
    return {
        ...mockAnalyticsData,
        summaryCards: getSummaryCards(mockAnalyticsData.summary),
        abilityStats: hydrateAbilityStats(mockAnalyticsData.abilityStats),
    };
}
