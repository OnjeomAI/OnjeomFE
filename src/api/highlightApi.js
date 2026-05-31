import { apiDelete, apiGet, apiPost } from "./client";

export async function saveHighlight(payload) {
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
