import { getScoreType, mapReadingTypeLabel } from "../../utils/mappers.js";
import { formatDotDate } from "./dateSelectors.js";

function mapLevelLabel(level) {
    const labels = {
        HIGH: "높음",
        MEDIUM: "보통",
        LOW: "낮음",
    };

    return labels[level] || level || "-";
}

export function toDashboardViewModel({
    radar,
    stats,
    today,
    recentResponses,
    weakPoints,
}) {
    const competencies = radar?.competencies || [];
    const weakCompetencies = weakPoints?.weakCompetencies || [];
    const dueReviews = today?.dueReviews || [];
    const responses = recentResponses?.responses || recentResponses?.content || [];
    const topWeakness = weakCompetencies[0] || null;
    const primaryReview = dueReviews[0] || null;

    return {
        todaySummary: {
            dailyGoal: today?.dailyGoal || 0,
            completedCount: today?.completedToday || 0,
            goalAchieved: Boolean(today?.goalAchieved),
            remainingCount: Math.max(
                0,
                (today?.dailyGoal || 0) - (today?.completedToday || 0)
            ),
        },
        activitySummary: {
            totalResponses: stats?.totalResponses || 0,
            streakDays: stats?.streakDays || 0,
            recentStats: stats?.recentStats || [],
        },
        scoreSummary: {
            averageScore: stats?.averageScore || 0,
            recentResponseCount: (stats?.recentStats || []).reduce(
                (sum, item) => sum + (item.count || 0),
                0
            ),
        },
        abilityStats: competencies.map((item) => ({
            key: item.type,
            label: mapReadingTypeLabel(item.type),
            current: item.score || 0,
            previous: Math.max(0, (item.score || 0) - (item.delta || 0)),
            delta: item.delta || 0,
            level: mapLevelLabel(item.level),
        })),
        weaknessItems: weakCompetencies.map((item) => ({
            key: item.type,
            label: mapReadingTypeLabel(item.type),
            score: item.score || 0,
            percent: Math.max(0, Math.min(100, 100 - (item.score || 0))),
            level: mapLevelLabel(item.level),
        })),
        aiRecommendation: topWeakness
            ? {
                  title: `${mapReadingTypeLabel(topWeakness.type)} 보완 권장`,
                  description: `현재 ${mapReadingTypeLabel(topWeakness.type)} 점수는 ${topWeakness.score}점이며 복습 대기 ${weakPoints?.reviewDueCount || 0}건이 있습니다.`,
              }
            : {
                  title: "균형 잡힌 학습 상태",
                  description: "현재 별도로 강조할 취약 영역이 없습니다.",
              },
        reviewSummary: primaryReview
            ? {
                  title: `${today?.dueReviews?.length || 0}개의 복습 대기 항목`,
                  description: `${mapReadingTypeLabel(primaryReview.readingType)} · ${primaryReview.questionText}`,
              }
            : {
                  title: "오늘 예정된 복습이 없습니다",
                  description: "오늘 학습을 시작하거나 최근 응답 이력을 확인해보세요.",
              },
        recentRecords: responses.map((response) => ({
            id: response.responseId ?? response.id,
            title: response.questionText,
            completedAt: formatDotDate(response.createdAt),
            score: response.finalScore ?? response.rawScore ?? 0,
            scoreType: getScoreType(response.finalScore ?? response.rawScore ?? 0),
            problemId: response.problemId,
            readingType: mapReadingTypeLabel(response.readingType),
        })),
    };
}

