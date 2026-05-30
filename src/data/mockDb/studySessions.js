// 학습자가 오늘 진행하는 학습 세션 상태와 현재 문항 연결 정보를 보관합니다.
export const studySessions = [
    {
        id: "study-session-001",
        learnerId: "user-learner-001",
        status: "NOT_STARTED",
        day: 3,
        questionNumber: 3,
        questionIds: ["question-study-003"],
        currentQuestionId: "question-study-003",
        startedAt: null,
        completedAt: null,
        lastSubmissionId: null,
    },
];
