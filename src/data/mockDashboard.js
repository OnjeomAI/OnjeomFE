import { getScoreType, getTrendLabel } from "./mockFormatters.js";

const mockDashboardData = {
    todaySummary: {
        completedCount: 7,
        studyMinutes: 32,
        studyTimeChangeRate: 12,
        averageScore: 74,
        scoreTrend: "stable",
    },

    abilityStats: [
        {
            key: "vocabulary",
            label: "어휘력",
            current: 78,
            previous: 72,
        },
        {
            key: "reading",
            label: "독해력",
            current: 82,
            previous: 76,
        },
        {
            key: "speaking",
            label: "말하기",
            current: 70,
            previous: 68,
        },
        {
            key: "listening",
            label: "듣기",
            current: 86,
            previous: 80,
        },
        {
            key: "grammar",
            label: "문법",
            current: 74,
            previous: 71,
        },
    ],

    weaknessItems: [
        {
            key: "inferential-reading",
            label: "추론적 독해",
            percent: 42,
        },
        {
            key: "context-understanding",
            label: "문맥 파악",
            percent: 58,
        },
    ],

    aiRecommendation: {
        title: "AI 맞춤 추천",
        description:
            "추론적 독해 연습에 집중하세요. 복합적인 한국어 서사 지문에서 직역으로 인한 오류 패턴이 관찰됩니다.",
    },

    reviewSummary: {
        title: "복습이 필요한 3개의 항목",
        description:
            "기억 보유량이 62% 수준입니다. 장기 기억 전환을 위해 지금 확인하세요.",
        retentionRate: 62,
        reviewCount: 3,
    },

    recentRecords: [
        {
            id: "record-001",
            title: "고전 문학: 이상의 '날개' 분석",
            completedAt: "2026.05.10",
            score: 88,
        },
        {
            id: "record-002",
            title: "사설: AI 큐레이션의 윤리적 쟁점",
            completedAt: "2026.05.09",
            score: 54,
        },
        {
            id: "record-003",
            title: "문법: 상황에 따른 높임 표현의 활용",
            completedAt: "2026.05.08",
            score: 72,
        },
    ],
};

export function getMockDashboardData() {
    return {
        ...mockDashboardData,
        todaySummary: {
            ...mockDashboardData.todaySummary,
            scoreTrendLabel: getTrendLabel(mockDashboardData.todaySummary.scoreTrend),
        },
        recentRecords: mockDashboardData.recentRecords.map((record) => ({
            ...record,
            scoreType: getScoreType(record.score),
        })),
    };
}
