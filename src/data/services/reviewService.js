// 복습 아카이브와 연결된 제출/채점 이력을 조회하는 mock API 서비스입니다.
import { gradingResults } from "../mockDb/gradingResults.js";
import { reviewArchives } from "../mockDb/reviewArchives.js";
import { submissions } from "../mockDb/submissions.js";
import { toReviewViewModel } from "../selectors/reviewSelectors.js";

export async function getReviewArchive() {
    const archive = reviewArchives[0];
    const archiveSubmissions = archive.submissionIds
        .map((submissionId) =>
            submissions.find((submission) => submission.id === submissionId)
        )
        .filter(Boolean);

    return toReviewViewModel({
        archive,
        submissions: archiveSubmissions,
        gradingResults,
    });
}
