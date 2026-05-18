import {
    getMockQuestionById,
    getMockQuestionsByIds,
    toDiagnosisQuestion,
} from "./mockQuestions.js";

let mockDiagnosisSession = {
    sessionId: "diagnosis-session-001",
    status: "IN_PROGRESS",
    completedReason: null,
    currentQuestionId: "diagnosis-question-01",
    questionIds: [
        "diagnosis-question-01",
        "diagnosis-question-02",
        "diagnosis-question-03",
    ],
    remainingTime: 60,
    answers: {},
};

function getQuestionState(questionId) {
    const order = mockDiagnosisSession.questionIds.indexOf(questionId) + 1;
    const answerState = mockDiagnosisSession.answers[questionId] || {};

    return {
        order,
        answer: answerState.answer || "",
        submitted: Boolean(answerState.submitted),
    };
}

function getDiagnosisQuestions() {
    return getMockQuestionsByIds(mockDiagnosisSession.questionIds).map((question) =>
        toDiagnosisQuestion(question, getQuestionState(question.id))
    );
}

export function getMockDiagnosisSession() {
    return {
        ...mockDiagnosisSession,
        totalQuestions: mockDiagnosisSession.questionIds.length,
        questions: getDiagnosisQuestions(),
    };
}

export function getCurrentDiagnosisQuestion() {
    const question = getMockQuestionById(mockDiagnosisSession.currentQuestionId);

    return toDiagnosisQuestion(
        question,
        getQuestionState(mockDiagnosisSession.currentQuestionId)
    );
}

export function updateMockDiagnosisAnswer(questionId, answer) {
    mockDiagnosisSession.answers = {
        ...mockDiagnosisSession.answers,
        [questionId]: {
            ...mockDiagnosisSession.answers[questionId],
            answer,
        },
    };

    return getCurrentDiagnosisQuestion();
}

export function submitMockDiagnosisAnswer(questionId, answer) {
    mockDiagnosisSession.answers = {
        ...mockDiagnosisSession.answers,
        [questionId]: {
            ...mockDiagnosisSession.answers[questionId],
            answer,
            submitted: true,
        },
    };

    const currentIndex = mockDiagnosisSession.questionIds.indexOf(
        mockDiagnosisSession.currentQuestionId
    );

    const isLastQuestion =
        currentIndex === mockDiagnosisSession.questionIds.length - 1;

    if (isLastQuestion) {
        mockDiagnosisSession.status = "COMPLETED";
        mockDiagnosisSession.completedReason = "NORMAL";
        return getMockDiagnosisSession();
    }

    mockDiagnosisSession.currentQuestionId =
        mockDiagnosisSession.questionIds[currentIndex + 1];

    return getMockDiagnosisSession();
}

export function completeMockDiagnosisSession(reason = "NORMAL") {
    mockDiagnosisSession.status = "COMPLETED";
    mockDiagnosisSession.completedReason = reason;
    mockDiagnosisSession.remainingTime = 0;

    return getMockDiagnosisSession();
}
