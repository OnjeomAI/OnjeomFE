import { getScoreType } from "../../utils/mappers.js";
import { formatKoreanDateTime } from "./dateSelectors.js";

export function toReviewViewModel({ archive, submissions, gradingResults }) {
    const sortedSubmissions = [...submissions].sort(
        (a, b) => b.attemptNumber - a.attemptNumber
    );
    const latestSubmission = sortedSubmissions[0];

    return {
        subtitle: archive.subtitle,
        title: archive.pageTitle,
        archive: {
            badge: archive.badge,
            code: archive.code,
            title: archive.title,
        },
        achievement: {
            title: "응답 점수 추이",
            scores: sortedSubmissions
                .slice()
                .reverse()
                .map((submission, index, items) => ({
                    id: submission.id,
                    label:
                        index === items.length - 1
                            ? "최신"
                            : `${submission.attemptNumber}회차`,
                    score: submission.finalScore ?? submission.rawScore ?? 0,
                })),
        },
        insight: {
            title: latestSubmission?.feedbackText
                ? "최근 피드백"
                : "응답 이력 없음",
            description:
                latestSubmission?.feedbackText ||
                "아직 조회 가능한 응답 기록이 없습니다.",
            detail: latestSubmission?.scoringBasis
                ? `채점 기준: ${latestSubmission.scoringBasis}`
                : "제출 후 피드백이 여기에 표시됩니다.",
        },
        submissions: sortedSubmissions.map((submission) => ({
            id: submission.id,
            attemptNumber: submission.attemptNumber,
            score: submission.finalScore ?? submission.rawScore ?? 0,
            text: submission.answerText,
            title:
                latestSubmission && latestSubmission.id === submission.id
                    ? "현재 응답"
                    : `${submission.attemptNumber}회차 응답`,
            date: formatKoreanDateTime(submission.createdAt),
            current: latestSubmission && latestSubmission.id === submission.id,
            scoreType: getScoreType(
                submission.finalScore ?? submission.rawScore ?? 0
            ),
            gradingResults,
        })),
    };
}
