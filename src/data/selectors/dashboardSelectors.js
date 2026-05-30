// 대시보드 원천 데이터를 카드, 차트, 최근 기록 화면 모델로 가공합니다.
import { getScoreType, getTrendLabel } from "../mockFormatters.js";
import { formatDotDate } from "./dateSelectors.js";

export function toDashboardViewModel({
    summary,
    abilityStats,
    weaknessItems,
    recentRecords,
}) {
    return {
        todaySummary: {
            ...summary,
            scoreTrendLabel: getTrendLabel(summary.scoreTrend),
        },
        abilityStats,
        weaknessItems,
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
        recentRecords: recentRecords.map((record) => ({
            ...record,
            completedAt: formatDotDate(record.completedAt),
            scoreType: getScoreType(record.score),
        })),
    };
}
