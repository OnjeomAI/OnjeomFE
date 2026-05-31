import { apiGet } from "./client";

export async function getProblems(page = 0, size = 20) {
    return apiGet("/api/problems", {
        requireAuth: true,
        query: { page, size },
    });
}

export async function getProblem(problemId) {
    return apiGet(`/api/problems/${problemId}`, { requireAuth: true });
}

export async function getProblemsByReadingType(readingType) {
    return apiGet(`/api/problems/type/${readingType}`, { requireAuth: true });
}

