import { getAccessToken } from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestCurriculum(path, options = {}) {
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
            result?.message || "커리큘럼 정보를 불러오지 못했습니다."
        );
    }

    return result.data;
}

export async function getMyCurriculum() {
    return requestCurriculum("/api/curriculum/me");
}

export async function getCurriculumProgress() {
    return requestCurriculum("/api/curriculum/progress");
}

export async function startCurriculumItem(itemId) {
    return requestCurriculum(`/api/curriculum/items/${itemId}/start`, {
        method: "PATCH",
    });
}

export async function skipCurriculumItem(itemId) {
    return requestCurriculum(`/api/curriculum/items/${itemId}/skip`, {
        method: "PATCH",
    });
}

export async function completeCurriculumItem(itemId) {
    return requestCurriculum(`/api/curriculum/items/${itemId}/complete`, {
        method: "PATCH",
    });
}
