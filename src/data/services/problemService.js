import { getAccessToken } from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

async function requestProblem(path) {
    const accessToken = getAccessToken();

    const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "문제 정보를 불러오지 못했습니다.");
    }

    return result.data;
}

export async function getProblems({ page = 0, size = 20, readingType } = {}) {
    const query = new URLSearchParams({
        page: String(page),
        size: String(size),
    });

    if (readingType && readingType !== "ALL") {
        return requestProblem(`/api/problems/type/${readingType}`);
    }

    return requestProblem(`/api/problems?${query.toString()}`);
}

export async function getProblemDetail(problemId) {
    return requestProblem(`/api/problems/${problemId}`);
}
