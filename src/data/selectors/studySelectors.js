// 학습 세션, 제출, 채점 데이터를 오늘 학습/결과 화면 모델로 가공합니다.
import { getScoreStatusLabel } from "../mockFormatters.js";
import { toStudyQuestionViewModel } from "./questionSelectors.js";

export function toTodayStudyViewModel({ session, question }) {
    const studyQuestion = toStudyQuestionViewModel(question) || {};

    return {
        ...studyQuestion,
        sessionLabel:
            session.status === "NOT_STARTED"
                ? "시작 전 세션"
                : "진행 중인 세션",
        timeLeft: "14:52",
        sessionId: session.id,
        status: session.status,
        questionId: session.currentQuestionId,
        title: `학습 ${session.day || 1}일차 - 문항 ${session.questionNumber || 1}`,
    };
}

export function toStudyResultViewModel({
    session,
    submission,
    gradingResult,
}) {
    const analysisItems = gradingResult.analysisItems.map((item) => ({
        ...item,
        type: item.type === "GOOD" ? "good" : "bad",
    }));

    const strongPoints = analysisItems.filter(
        (item) => item.type === "good"
    ).length;

    const weakPoints = analysisItems.filter(
        (item) => item.type === "bad"
    ).length;

    return {
        sessionTitle: `학습 세션 채점: ${session.id}`,
        score: gradingResult.score,
        maxScore: gradingResult.maxScore,
        statusLabel: getScoreStatusLabel(gradingResult.score),
        gradingTime: `${gradingResult.engine} 채점 완료 (${gradingResult.elapsedSeconds}초)`,
        userAnswer: submission.answerText,
        modelAnswer: gradingResult.modelAnswer,
        analysisItems,
        expertInsight: gradingResult.expertInsight,
        strongPoints,
        weakPoints,
    };
}
