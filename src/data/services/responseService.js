import {
    compareResponse as compareResponseApi,
    getResponse as getResponseApi,
    getResponsesByProblem as getResponsesByProblemApi,
    submitResponse as submitResponseApi,
} from "../../api/responseApi";

const LATEST_RESPONSE_KEY = "onjeom-latest-response";

export function saveLatestResponseContext(context) {
    localStorage.setItem(LATEST_RESPONSE_KEY, JSON.stringify(context));
}

export function getLatestResponseContext() {
    const rawValue = localStorage.getItem(LATEST_RESPONSE_KEY);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return null;
    }
}

export async function submitResponse({
    problemId,
    answerText,
    responseTimeSec,
    curriculumItemId,
}) {
    const payload = {
        problemId,
        answerText,
        responseTimeSec,
    };

    if (curriculumItemId !== undefined && curriculumItemId !== null) {
        payload.curriculumItemId = curriculumItemId;
    }

    const result = await submitResponseApi(payload);

    return result.data || null;
}

export async function getResponseById(responseId) {
    const result = await getResponseApi(responseId);

    return result.data || null;
}

export async function getResponsesByProblemId(problemId) {
    const result = await getResponsesByProblemApi(problemId);

    return Array.isArray(result.data) ? result.data : result.data?.responses || [];
}

export async function compareResponse(responseId) {
    const result = await compareResponseApi(responseId);

    return result.data || null;
}

