import { getAccessToken } from "../../utils/authStorage";
import { getResponsesByProblemId } from "./responseService";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestJson(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "학습 분석 정보를 불러오지 못했습니다.");
    }

    return result.data;
}

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

    return Object.entries(grouped).map(([competencyType, scores]) => ({
        competencyType,
        scores,
    }));
}

function buildCompetencyScores(radarData) {
    return (radarData?.competencies || []).map((item) => ({
        competencyType: item.type,
        averageScore: item.score,
    }));
}

async function getComparisonSource(recentResponses) {
    const uniqueProblemIds = [...new Set(recentResponses.map((item) => item.problemId))];

    for (const problemId of uniqueProblemIds) {
        const responses = await getResponsesByProblemId(problemId);
        const sorted = [...responses].sort((left, right) => {
            return new Date(right.createdAt) - new Date(left.createdAt);
        });

        if (sorted.length >= 2) {
            return {
                problemId,
                previous: sorted[1],
                current: sorted[0],
            };
        }
    }

    return null;
}

export async function getLearningAnalytics() {
    const [radarData, recentResponseData] = await Promise.all([
        requestJson("/api/dashboard/radar"),
        requestJson("/api/dashboard/recent-responses?page=0&size=10"),
    ]);

    const recentResponses = recentResponseData?.responses || [];
    const competencyHistory = buildCompetencyHistory(recentResponses);
    const competencyScores = buildCompetencyScores(radarData);
    const comparisonSource = await getComparisonSource(recentResponses);

    const [adjustmentResult, weaknessReportResult, compareResult] =
        await Promise.all([
            competencyHistory.length > 0
                ? requestJson("/api/writing/curriculum/adjust", {
                      method: "POST",
                      body: JSON.stringify({
                          competencyHistory,
                      }),
                  })
                : null,
            competencyScores.length > 0
                ? requestJson("/api/writing/weakness-report", {
                      method: "POST",
                      body: JSON.stringify({
                          competencyScores,
                      }),
                  })
                : null,
            comparisonSource
                ? requestJson("/api/writing/compare", {
                      method: "POST",
                      body: JSON.stringify({
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
                      }),
                  })
                : null,
        ]);

    return {
        radarData,
        recentResponses,
        adjustmentResult,
        weaknessReportResult,
        compareResult,
        comparisonSource,
    };
}
