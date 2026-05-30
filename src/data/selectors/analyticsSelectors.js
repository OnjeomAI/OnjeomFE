// 학습 분석 원천 데이터를 요약 카드, 변화량, 최근 이력 표시 모델로 가공합니다.
import {
    formatStudyDuration,
    getChangeType,
    getScoreType,
} from "../mockFormatters.js";
import { formatKoreanDateTime } from "./dateSelectors.js";

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

export function toAnalyticsViewModel(analytics) {
    return {
        ...analytics,
        summaryCards: getSummaryCards(analytics.summary),
        abilityStats: analytics.abilityStats.map((ability) => ({
            ...ability,
            changeType: getChangeType(ability.change),
            change:
                ability.change === null
                    ? null
                    : Math.abs(ability.change),
            recentHistory: ability.recentHistory?.map((history) => ({
                ...history,
                date: formatKoreanDateTime(history.date).split(" · ")[0],
                scoreType: getScoreType(history.score),
            })),
        })),
    };
}
