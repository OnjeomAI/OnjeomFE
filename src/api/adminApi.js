import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";

export async function getAdminProblems(page = 0, size = 20) {
    return apiGet("/api/admin/cms/problems", {
        requireAuth: true,
        query: { page, size },
    });
}

export async function createAdminProblem(payload) {
    return apiPost("/api/admin/cms/problems", payload, { requireAuth: true });
}

export async function generateProblem(payload) {
    return apiPost("/api/admin/cms/problems/generate", payload, {
        requireAuth: true,
    });
}

export async function updateAdminProblem(problemId, payload) {
    return apiPatch(`/api/admin/cms/problems/${problemId}`, payload, {
        requireAuth: true,
    });
}

export async function deleteAdminProblem(problemId) {
    return apiDelete(`/api/admin/cms/problems/${problemId}`, {
        requireAuth: true,
    });
}

export async function updateKeywords(problemId, payload) {
    return apiPut(`/api/admin/cms/problems/${problemId}/keywords`, payload, {
        requireAuth: true,
    });
}

export async function updateCurriculumOrder(curriculumId, problemIds) {
    return apiPut(
        `/api/admin/cms/curriculum/${curriculumId}/order`,
        { problemIds },
        { requireAuth: true }
    );
}

export async function reindexProblem(problemId) {
    return apiPost(
        `/api/admin/cms/problems/${problemId}/reindex`,
        undefined,
        { requireAuth: true }
    );
}

export async function getAdminStats() {
    return apiGet("/api/admin/dashboard/stats", { requireAuth: true });
}

export async function exportAdminStatsCsv() {
    return apiGet("/api/admin/dashboard/stats/export", { requireAuth: true });
}

