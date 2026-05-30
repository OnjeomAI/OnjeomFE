// 복습 아카이브, 제출 이력, 채점 결과를 복습 화면 모델로 가공합니다.
import { getScoreType } from "../mockFormatters.js";
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
            title: "성취도 변화 곡선",
            scores: [...submissions]
                .sort((a, b) => a.attemptNumber - b.attemptNumber)
                .map((submission) => {
                    const gradingResult = gradingResults.find(
                        (result) => result.submissionId === submission.id
                    );

                    return {
                        id: submission.id,
                        label:
                            submission.id === latestSubmission.id
                                ? "최근"
                                : `${submission.attemptNumber}회차`,
                        score: gradingResult?.score || 0,
                    };
                }),
        },
        insight: archive.insight,
        submissions: sortedSubmissions.map((submission) => {
            const gradingResult = gradingResults.find(
                (result) => result.submissionId === submission.id
            );
            const isLatest = submission.id === latestSubmission.id;

            return {
                id: submission.id,
                attemptNumber: submission.attemptNumber,
                score: gradingResult?.score || 0,
                submittedAt: submission.submittedAt,
                text: submission.answerText,
                isLatest,
                title: isLatest
                    ? "현재 제출분"
                    : `${submission.attemptNumber}회차 제출`,
                date: formatKoreanDateTime(submission.submittedAt),
                current: isLatest,
                scoreType: getScoreType(gradingResult?.score || 0),
            };
        }),
    };
}
