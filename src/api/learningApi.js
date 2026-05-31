import { apiDelete, apiGet, apiPost } from "./client";

export async function createHighlight(payload) {
    return apiPost("/api/highlights", payload, { requireAuth: true });
}

export async function getHighlights(problemId) {
    return apiGet(`/api/highlights/${problemId}`, { requireAuth: true });
}

export async function deleteHighlight(problemId, startOffset, endOffset) {
    return apiDelete(`/api/highlights/${problemId}`, {
        requireAuth: true,
        query: { startOffset, endOffset },
    });
}

export async function getTodayReview() {
    return apiGet("/api/review/today", { requireAuth: true });
}

export async function getAllReview() {
    return apiGet("/api/review/all", { requireAuth: true });
}

