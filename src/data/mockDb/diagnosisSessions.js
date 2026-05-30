// 진단 테스트 진행 상태, 현재 문항, 답변 임시 저장 정보를 보관합니다.
export const diagnosisSessions = [
    {
        id: "diagnosis-session-001",
        learnerId: "user-learner-001",
        status: "IN_PROGRESS",
        completedReason: null,
        currentQuestionId: "question-diagnosis-001",
        questionIds: [
            "question-diagnosis-001",
            "question-diagnosis-002",
            "question-diagnosis-003",
        ],
        remainingTime: 60,
        answers: {},
        startedAt: "2026-05-27T09:00:00+09:00",
        completedAt: null,
    },
];
