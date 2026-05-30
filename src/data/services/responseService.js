import { getAccessToken } from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const LATEST_RESPONSE_KEY = "onjeom-latest-response";

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestResponse(path, options = {}) {
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
        throw new Error(result?.message || "응답 API 요청을 처리하지 못했습니다.");
    }

    return result;
}

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

    const result = await requestResponse("/api/responses", {
        method: "POST",
        body: JSON.stringify(payload),
    });

    return result.data || null;
}

export async function getResponseById(responseId) {
    const result = await requestResponse(`/api/responses/${responseId}`);

    return result.data || null;
}

export async function getResponsesByProblemId(problemId) {
    const result = await requestResponse(
        `/api/responses/problem/${problemId}`
    );

    return Array.isArray(result.data) ? result.data : [];
}
