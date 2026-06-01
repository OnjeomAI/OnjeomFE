import {
    getDiagnosticResult,
    startDiagnostic,
    submitDiagnosticAnswer as submitDiagnosticAnswerApi,
} from "../../api/diagnosticApi";

const DIAGNOSIS_SESSION_KEY = "onjeom-diagnosis-session";
const DIAGNOSIS_RESULT_KEY = "onjeom-diagnosis-result";
const DEFAULT_TOTAL_QUESTIONS = 10;

function readJsonStorage(key) {
    const rawValue = localStorage.getItem(key);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

function writeJsonStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function readDiagnosisSession() {
    return readJsonStorage(DIAGNOSIS_SESSION_KEY);
}

function writeDiagnosisSession(session) {
    writeJsonStorage(DIAGNOSIS_SESSION_KEY, session);
}

function clearDiagnosisSession() {
    localStorage.removeItem(DIAGNOSIS_SESSION_KEY);
}

function cacheDiagnosisResult(result) {
    if (result) {
        writeJsonStorage(DIAGNOSIS_RESULT_KEY, result);
    }
}

function readCachedDiagnosisResult() {
    return readJsonStorage(DIAGNOSIS_RESULT_KEY);
}

function clearCachedDiagnosisResult() {
    localStorage.removeItem(DIAGNOSIS_RESULT_KEY);
}

function getQuestionPayload(data) {
    return data?.nextProblem || data?.problem || data;
}

function getQuestionIndex(data, fallbackIndex) {
    return Number(data?.questionNumber) || fallbackIndex;
}

function getTotalQuestions(data, fallbackTotal = DEFAULT_TOTAL_QUESTIONS) {
    return Number(data?.totalQuestions) || fallbackTotal;
}

function toDiagnosisQuestion(data, fallbackIndex, fallbackTotal) {
    const questionIndex = getQuestionIndex(data, fallbackIndex);
    const totalQuestions = getTotalQuestions(data, fallbackTotal);

    return {
        diagnosisId: data.diagnosisId,
        problemId: data.problemId,
        questionIndex,
        totalQuestions,
        title: `지문 ${String(questionIndex).padStart(2, "0")}`,
        passageParagraphs: String(data.passageText || "")
            .split("\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
        questionText: data.questionText || "",
    };
}

function isNextDiagnosisQuestion(data) {
    const question = getQuestionPayload(data);

    return Boolean(question?.problemId && question?.questionText);
}

function isCompletedDiagnosisResult(data) {
    return Boolean(
        data?.isCompleted ||
            data?.completed ||
            data?.diagnosisCompleted ||
            data?.result ||
            data?.theta !== undefined ||
            data?.factualScore !== undefined ||
            data?.curriculumId !== undefined
    );
}

export async function startDiagnosisSession() {
    const previousSession = readDiagnosisSession();
    const result = await startDiagnostic();
    const data = getQuestionPayload(result.data || {});

    if (!isNextDiagnosisQuestion(data)) {
        throw new Error(result.message || "진단 문제를 불러오지 못했습니다.");
    }

    const isSameDiagnosis =
        previousSession &&
        previousSession.diagnosisId === data.diagnosisId &&
        previousSession.currentProblemId !== data.problemId;
    const fallbackIndex = isSameDiagnosis ? (previousSession.questionIndex || 0) + 1 : 1;
    const questionIndex = getQuestionIndex(data, fallbackIndex);
    const totalQuestions = getTotalQuestions(data, previousSession?.totalQuestions);

    writeDiagnosisSession({
        diagnosisId: data.diagnosisId,
        currentProblemId: data.problemId,
        questionIndex,
        totalQuestions,
    });

    return {
        diagnosisId: data.diagnosisId,
        questionIndex,
        totalQuestions,
        question: toDiagnosisQuestion(data, questionIndex, totalQuestions),
    };
}

export async function submitDiagnosisAnswer({
    problemId,
    answerText,
    responseTimeSec,
}) {
    const session = readDiagnosisSession();
    const result = await submitDiagnosticAnswerApi({
        problemId,
        answerText,
        responseTimeSec,
    });
    const data = result.data || {};

    if (!result.data || isCompletedDiagnosisResult(data)) {
        const diagnosisResult = data.result || data;

        cacheDiagnosisResult(diagnosisResult);
        clearDiagnosisSession();

        return { completed: true, result: diagnosisResult };
    }

    const nextQuestion = getQuestionPayload(data);

    if (!isNextDiagnosisQuestion(nextQuestion)) {
        clearDiagnosisSession();
        return { completed: true };
    }

    const fallbackIndex = (session?.questionIndex || 1) + 1;
    const questionIndex = getQuestionIndex(nextQuestion, fallbackIndex);
    const totalQuestions = getTotalQuestions(
        nextQuestion,
        session?.totalQuestions || DEFAULT_TOTAL_QUESTIONS
    );

    writeDiagnosisSession({
        diagnosisId: session?.diagnosisId || nextQuestion.diagnosisId,
        currentProblemId: nextQuestion.problemId,
        questionIndex,
        totalQuestions,
    });

    return {
        completed: false,
        diagnosisId: nextQuestion.diagnosisId,
        questionIndex,
        totalQuestions,
        question: toDiagnosisQuestion(nextQuestion, questionIndex, totalQuestions),
    };
}

export async function getLatestDiagnosisResult() {
    try {
        const result = await getDiagnosticResult();

        clearDiagnosisSession();
        clearCachedDiagnosisResult();

        return result.data || null;
    } catch (error) {
        const cachedResult = readCachedDiagnosisResult();

        if (cachedResult) {
            clearDiagnosisSession();
            clearCachedDiagnosisResult();

            return cachedResult;
        }

        throw error;
    }
}
