import { getMockQuestionById, toStudyQuestion } from "./mockQuestions.js";
import { getMockUserByType } from "./mockData.js";

const mockTodayStudySessionDefaults = {
    sessionLabel: "진행 중인 세션",
    timeLeft: "14:52",
};

export function getMockTodayStudy() {
    const learner = getMockUserByType("learner");
    const currentStudy = learner.currentStudy || {};
    const question = getMockQuestionById(currentStudy.questionId);
    const studyQuestion = toStudyQuestion(question) || {};

    return {
        ...studyQuestion,
        ...mockTodayStudySessionDefaults,
        sessionId: currentStudy.sessionId,
        status: currentStudy.status,
        questionId: currentStudy.questionId,
        title: `학습 ${currentStudy.day || 1}일차 - 문항 ${currentStudy.questionNumber || 1}`,
    };
}
