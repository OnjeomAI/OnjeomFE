import { formatKoreanDateTime } from "../selectors/dateSelectors.js";
import {
    getLatestResponseContext,
    getResponsesByProblemId,
} from "./responseService";

function toScoreBand(score) {
    if (score >= 85) {
        return "우수";
    }

    if (score >= 70) {
        return "안정";
    }

    if (score >= 50) {
        return "보통";
    }

    return "보완 필요";
}

export async function getReviewArchive() {
    const latestContext = getLatestResponseContext();

    if (!latestContext?.problemId) {
        return {
            subtitle: "응답 이력 분석",
            title: "문제별 응답 조회",
            archive: {
                badge: "학습",
                code: "-",
                title: "최근 응답 기록이 없습니다.",
            },
            achievement: {
                title: "응답 점수 추이",
                scores: [],
            },
            insight: {
                title: "응답 이력 없음",
                description: "먼저 오늘의 학습에서 답안을 제출해 주세요.",
                detail: "제출 이후 같은 문제의 응답 이력을 여기에서 확인할 수 있습니다.",
            },
            submissions: [],
        };
    }

    const responses = await getResponsesByProblemId(latestContext.problemId);
    const sortedResponses = [...responses].sort((left, right) => {
        return new Date(right.createdAt) - new Date(left.createdAt);
    });
    const latestResponse = sortedResponses[0] || null;

    return {
        subtitle: "응답 이력 분석",
        title: "문제별 응답 조회",
        archive: {
            badge: "오늘의 학습",
            code: `PROB-${latestContext.problemId}`,
            title: `문제 ${latestContext.problemId} 응답 기록`,
        },
        achievement: {
            title: "응답 점수 추이",
            scores: [...sortedResponses]
                .reverse()
                .map((response, index, items) => ({
                    id: response.id,
                    label:
                        index === items.length - 1
                            ? "최신"
                            : `${response.attemptNumber}회차`,
                    score: response.finalScore ?? response.rawScore ?? 0,
                })),
        },
        insight: latestResponse
            ? {
                  title: "최근 피드백",
                  description:
                      latestResponse.feedbackText ||
                      "최근 응답에 대한 피드백이 아직 없습니다.",
                  detail: `채점 기준: ${latestResponse.scoringBasis || "-"}`,
              }
            : {
                  title: "응답 이력 없음",
                  description: "아직 조회 가능한 응답 기록이 없습니다.",
                  detail: "답안을 제출하면 문제별 응답 이력이 여기에 표시됩니다.",
              },
        submissions: sortedResponses.map((response) => ({
            id: response.id,
            attemptNumber: response.attemptNumber,
            score: response.finalScore ?? response.rawScore ?? 0,
            text: response.answerText,
            title:
                latestResponse && latestResponse.id === response.id
                    ? "현재 응답"
                    : `${response.attemptNumber}회차 응답`,
            date: formatKoreanDateTime(response.createdAt),
            current: latestResponse && latestResponse.id === response.id,
            scoreType: toScoreBand(
                response.finalScore ?? response.rawScore ?? 0
            ),
        })),
    };
}
