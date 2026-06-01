import {
    getDiagnosticResult,
    startDiagnostic,
    submitDiagnosticAnswer as submitDiagnosticAnswerApi,
} from "../../api/diagnosticApi";

const DIAGNOSIS_SESSION_KEY = "onjeom-diagnosis-session";

function readDiagnosisSession() {
    const rawValue = localStorage.getItem(DIAGNOSIS_SESSION_KEY);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

function writeDiagnosisSession(session) {
    localStorage.setItem(DIAGNOSIS_SESSION_KEY, JSON.stringify(session));
}

function clearDiagnosisSession() {
    localStorage.removeItem(DIAGNOSIS_SESSION_KEY);
}

function toDiagnosisQuestion(data, questionIndex) {
    return {
        diagnosisId: data.diagnosisId,
        problemId: data.problemId,
        title: `지문 ${String(questionIndex).padStart(2, "0")}`,
        passageParagraphs: String(data.passageText || "")
            .split("\n")
            .map((paragraph) => paragraph.trim())
            .filter(Boolean),
        questionText: data.questionText || "",
    };
}

function isNextDiagnosisQuestion(data) {
    return Boolean(data?.problemId && data?.questionText);
}

function isCompletedDiagnosisResult(data) {
    return Boolean(
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
    const data = result.data || {};

    if (!isNextDiagnosisQuestion(data)) {
        throw new Error(result.message || "진단 문제를 불러오지 못했습니다.");
    }

    const isSameDiagnosis =
        previousSession &&
        previousSession.diagnosisId === data.diagnosisId &&
        previousSession.currentProblemId !== data.problemId;
    const questionIndex = isSameDiagnosis ? (previousSession.questionIndex || 0) + 1 : 1;

    writeDiagnosisSession({
        diagnosisId: data.diagnosisId,
        currentProblemId: data.problemId,
        questionIndex,
    });

    return {
        diagnosisId: data.diagnosisId,
        questionIndex,
        question: toDiagnosisQuestion(data, questionIndex),
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

    if (!result.data || isCompletedDiagnosisResult(result.data)) {
        clearDiagnosisSession();
        return { completed: true };
    }

    if (!isNextDiagnosisQuestion(result.data)) {
        clearDiagnosisSession();
        return { completed: true };
    }

    const nextQuestionIndex = (session?.questionIndex || 1) + 1;

    writeDiagnosisSession({
        diagnosisId: session?.diagnosisId || result.data.diagnosisId,
        currentProblemId: result.data.problemId,
        questionIndex: nextQuestionIndex,
    });

    return {
        completed: false,
        diagnosisId: result.data.diagnosisId,
        questionIndex: nextQuestionIndex,
        question: toDiagnosisQuestion(result.data, nextQuestionIndex),
    };
}

export async function getLatestDiagnosisResult() {
    const result = await getDiagnosticResult();

    clearDiagnosisSession();

    return result.data || null;
}

