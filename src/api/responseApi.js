import { apiGet, apiPost } from "./client";

export async function submitResponse(payload) {
    return apiPost("/api/responses", payload, { requireAuth: true });
}

export async function getResponse(responseId) {
    return apiGet(`/api/responses/${responseId}`, { requireAuth: true });
}

export async function getResponsesByProblem(problemId) {
    return apiGet(`/api/responses/problem/${problemId}`, { requireAuth: true });
}

export async function compareResponse(responseId) {
    return apiGet(`/api/responses/${responseId}/compare`, { requireAuth: true });
}

