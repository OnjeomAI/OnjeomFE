// 진단 테스트 세션 조회, 답변 저장, 제출 완료를 담당하는 mock API 서비스입니다.
import { diagnosisSessions } from "../mockDb/diagnosisSessions.js";
import { questions } from "../mockDb/questions.js";
import { toDiagnosisQuestionViewModel } from "../selectors/questionSelectors.js";

function getSession() {
    return diagnosisSessions[0];
}

function getQuestionState(session, questionId) {
    const order = session.questionIds.indexOf(questionId) + 1;
    const answerState = session.answers[questionId] || {};

    return {
        order,
        answer: answerState.answer || "",
        submitted: Boolean(answerState.submitted),
    };
}

function getQuestion(questionId) {
    return questions.find((question) => question.id === questionId);
}

function getDiagnosisQuestions(session) {
    return session.questionIds.map((questionId) =>
        toDiagnosisQuestionViewModel(
            getQuestion(questionId),
            getQuestionState(session, questionId)
        )
    );
}

export async function getDiagnosisSession() {
    const session = getSession();

    return {
        ...session,
        sessionId: session.id,
        totalQuestions: session.questionIds.length,
        questions: getDiagnosisQuestions(session),
    };
}

export async function getCurrentDiagnosisQuestion() {
    const session = getSession();

    return toDiagnosisQuestionViewModel(
        getQuestion(session.currentQuestionId),
        getQuestionState(session, session.currentQuestionId)
    );
}

export async function updateDiagnosisAnswer(questionId, answer) {
    const session = getSession();

    session.answers = {
        ...session.answers,
        [questionId]: {
            ...session.answers[questionId],
            answer,
        },
    };

    return getCurrentDiagnosisQuestion();
}

export async function submitDiagnosisAnswer(questionId, answer) {
    const session = getSession();

    session.answers = {
        ...session.answers,
        [questionId]: {
            ...session.answers[questionId],
            answer,
            submitted: true,
        },
    };

    const currentIndex = session.questionIds.indexOf(session.currentQuestionId);
    const isLastQuestion = currentIndex === session.questionIds.length - 1;

    if (isLastQuestion) {
        session.status = "COMPLETED";
        session.completedReason = "NORMAL";
        session.completedAt = new Date().toISOString();
        return getDiagnosisSession();
    }

    session.currentQuestionId = session.questionIds[currentIndex + 1];

    return getDiagnosisSession();
}

export async function completeDiagnosisSession(reason = "NORMAL") {
    const session = getSession();

    session.status = "COMPLETED";
    session.completedReason = reason;
    session.remainingTime = 0;
    session.completedAt = new Date().toISOString();

    return getDiagnosisSession();
}
