import {
    getRadar,
    getRecentResponses,
} from "../../api/dashboardApi";
import {
    adjustCurriculum,
    compareWriting,
    createWeaknessReport,
} from "../../api/writingApi";
import { getProblemDetail } from "./problemService";
import { getResponsesByProblemId } from "./responseService";

function buildCompetencyHistory(responses) {
    const grouped = responses.reduce((acc, response) => {
        const readingType = response.readingType;

        if (!readingType) {
            return acc;
        }

        if (!acc[readingType]) {
            acc[readingType] = [];
        }

        acc[readingType].push(response.finalScore ?? 0);

        return acc;
    }, {});

    return Object.entries(grouped).map(([competency, scores]) => ({
        competency,
        scores,
    }));
}

function buildCompetencyScores(radarData) {
    return (radarData?.competencies || []).map((item) => ({
        competency: item.type,
        score: item.score,
    }));
}

function normalizeWeaknessReport(report) {
    if (!report) {
        return null;
    }

    return {
        ...report,
        weakCompetencies: (report.weakCompetencies || []).map((item) => ({
            ...item,
            competencyType: item.competencyType || item.competency,
            averageScore: item.averageScore ?? item.score,
        })),
    };
}

async function getComparisonSource(recentResponses) {
    const uniqueProblemIds = [...new Set(recentResponses.map((item) => item.problemId))];

    for (const problemId of uniqueProblemIds) {
        const responses = await getResponsesByProblemId(problemId);
        const sorted = [...responses].sort(
            (left, right) => new Date(right.createdAt) - new Date(left.createdAt)
        );

        if (sorted.length >= 2) {
            const problem = await getProblemDetail(problemId);

            return {
                problemId,
                problem,
                previous: sorted[1],
                current: sorted[0],
            };
        }
    }

    return null;
}

export async function getLearningAnalytics() {
    const [radarResult, recentResponseResult] = await Promise.all([
        getRadar(),
        getRecentResponses(0, 10),
    ]);
    const radarData = radarResult.data;
    const recentResponses = recentResponseResult.data?.responses || [];
    const competencyHistory = buildCompetencyHistory(recentResponses);
    const competencyScores = buildCompetencyScores(radarData);
    const comparisonSource = await getComparisonSource(recentResponses);

    const [adjustmentResult, weaknessReportResult, compareResult] = await Promise.all([
        competencyHistory.length > 0
            ? adjustCurriculum({ competencyHistory })
            : null,
        competencyScores.length > 0
            ? createWeaknessReport({ competencyScores })
            : null,
        comparisonSource
            ? compareWriting({
                  problemId: comparisonSource.problemId,
                  previousAnswer: comparisonSource.previous.answerText,
                  previousScore:
                      comparisonSource.previous.finalScore ??
                      comparisonSource.previous.rawScore ??
                      0,
                  currentAnswer: comparisonSource.current.answerText,
                  currentScore:
                      comparisonSource.current.finalScore ??
                      comparisonSource.current.rawScore ??
                      0,
              })
            : null,
    ]);

    return {
        radarData,
        recentResponses,
        adjustmentResult,
        weaknessReportResult: normalizeWeaknessReport(weaknessReportResult),
        compareResult,
        comparisonSource,
    };
}

