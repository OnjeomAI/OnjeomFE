import { getAccessToken } from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const DIAGNOSIS_SESSION_KEY = "onjeom-diagnosis-session";

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestDiagnosis(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(
            result?.message || "진단 요청을 처리하지 못했습니다."
        );
    }

    return result;
}

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

export async function startDiagnosisSession() {
    const previousSession = readDiagnosisSession();
    const result = await requestDiagnosis("/api/diagnostic/start", {
        method: "POST",
    });
    const data = result.data || {};
    const isSameDiagnosis =
        previousSession &&
        previousSession.diagnosisId === data.diagnosisId &&
        previousSession.currentProblemId !== data.problemId;
    const questionIndex = isSameDiagnosis
        ? (previousSession.questionIndex || 0) + 1
        : 1;

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
    const result = await requestDiagnosis("/api/diagnostic/submit", {
        method: "POST",
        body: JSON.stringify({
            problemId,
            answerText,
            responseTimeSec,
        }),
    });

    if (!result.data) {
        return {
            completed: true,
        };
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
    const result = await requestDiagnosis("/api/diagnostic/result");

    clearDiagnosisSession();

    return result.data || null;
}
