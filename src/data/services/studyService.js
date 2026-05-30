// 오늘 학습 세션 시작, 답변 제출, 채점 결과 조회를 담당하는 mock API 서비스입니다.
import { gradingResults } from "../mockDb/gradingResults.js";
import { questions } from "../mockDb/questions.js";
import { studySessions } from "../mockDb/studySessions.js";
import { submissions } from "../mockDb/submissions.js";
import { users } from "../mockDb/users.js";
import {
    toStudyResultViewModel,
    toTodayStudyViewModel,
} from "../selectors/studySelectors.js";

function getLearner() {
    return users.find((user) => user.role === "learner");
}

function getTodaySession() {
    const learner = getLearner();

    return studySessions.find((session) => session.learnerId === learner.id);
}

function createGradingResult(submission) {
    return {
        id: `grading-${Date.now()}`,
        submissionId: submission.id,
        score: 78,
        maxScore: 100,
        status: "GRADED",
        engine: "AI",
        elapsedSeconds: 2.3,
        modelAnswer:
            "효과적인 분석을 위해서는 디지털 아카이브의 보존 기능과 알고리즘의 선택 권한을 함께 설명해야 합니다. 기록은 단순히 저장되는 것이 아니라 선택과 배제의 과정을 거쳐 미래의 역사 인식에 영향을 줍니다.",
        analysisItems: [
            {
                id: "analysis-current-001",
                type: "GOOD",
                title: "핵심 키워드 통합",
                description:
                    "디지털 아카이브와 알고리즘의 역할을 답변 안에서 연결했습니다.",
            },
            {
                id: "analysis-current-002",
                type: "BAD",
                title: "미래 영향 설명",
                description:
                    "미래 역사관에 어떤 편향이 생길 수 있는지 더 구체적인 예시가 필요합니다.",
            },
            {
                id: "analysis-current-003",
                type: "GOOD",
                title: "지문 근거 활용",
                description:
                    "지문의 주요 표현을 근거로 사용해 답변의 방향이 명확합니다.",
            },
        ],
        expertInsight: {
            label: "AI 전문가 인사이트",
            category: "논리적 공백",
            description:
                "개념 이해는 충분하지만 알고리즘의 선택이 역사 인식에 미치는 장기적 영향을 더 직접적으로 설명하면 좋습니다.",
        },
        gradedAt: new Date().toISOString(),
    };
}

export async function getTodayStudySession() {
    const session = getTodaySession();
    const question = questions.find(
        (item) => item.id === session.currentQuestionId
    );

    return toTodayStudyViewModel({ session, question });
}

export async function getTodayStudyStatus() {
    return getTodaySession().status;
}

export async function getTodayStudyPath() {
    const session = getTodaySession();

    return session.status === "COMPLETED" && session.lastSubmissionId
        ? "/today/result"
        : "/today";
}

export async function startTodayStudy() {
    const session = getTodaySession();
    const learner = getLearner();

    session.status = "IN_PROGRESS";
    session.startedAt = session.startedAt || new Date().toISOString();
    session.completedAt = null;
    learner.learningState.todayStudyStatus = "IN_PROGRESS";
    learner.learningState.todayStudyCompletedAt = null;

    return session;
}

export async function submitStudyAnswer({ sessionId, questionId, answerText }) {
    const learner = getLearner();
    const session = studySessions.find((item) => item.id === sessionId);
    const submission = {
        id: `submission-${Date.now()}`,
        learnerId: learner.id,
        sessionId,
        questionId,
        answerText,
        attemptNumber: submissions.length + 1,
        submittedAt: new Date().toISOString(),
    };
    const gradingResult = createGradingResult(submission);

    submissions.push(submission);
    gradingResults.push(gradingResult);

    session.status = "COMPLETED";
    session.completedAt = new Date().toISOString();
    session.lastSubmissionId = submission.id;
    learner.learningState.todayStudyStatus = "COMPLETED";
    learner.learningState.todayStudyCompletedAt = session.completedAt;

    return {
        submissionId: submission.id,
        gradingResultId: gradingResult.id,
    };
}

export async function restartTodayStudy() {
    const session = getTodaySession();
    const learner = getLearner();

    session.status = "IN_PROGRESS";
    session.startedAt = new Date().toISOString();
    session.completedAt = null;
    session.lastSubmissionId = null;
    learner.learningState.todayStudyStatus = "IN_PROGRESS";
    learner.learningState.todayStudyCompletedAt = null;

    return session;
}

export async function getLatestStudyResult() {
    const session = getTodaySession();
    const submission = submissions.find(
        (item) => item.id === session.lastSubmissionId
    );
    const gradingResult = gradingResults.find(
        (item) => item.submissionId === submission?.id
    );

    if (!submission || !gradingResult) {
        return null;
    }

    return toStudyResultViewModel({
        session,
        submission,
        gradingResult,
    });
}
