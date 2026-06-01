import { apiDelete, apiGet, apiPatch, apiPost, apiPut } from "./client";

export async function getAllProblems(page = 0, size = 20) {
    return apiGet("/api/admin/cms/problems", {
        requireAuth: true,
        query: { page, size },
    });
}

export async function createProblem(payload) {
    return apiPost("/api/admin/cms/problems", payload, { requireAuth: true });
}

export async function generateProblem(payload) {
    return apiPost("/api/admin/cms/problems/generate", payload, {
        requireAuth: true,
    });
}

export async function updateProblem(problemId, payload) {
    return apiPatch(`/api/admin/cms/problems/${problemId}`, payload, {
        requireAuth: true,
    });
}

export async function deleteProblem(problemId) {
    return apiDelete(`/api/admin/cms/problems/${problemId}`, {
        requireAuth: true,
    });
}

export async function updateKeywords(problemId, payload) {
    return apiPut(`/api/admin/cms/problems/${problemId}/keywords`, payload, {
        requireAuth: true,
    });
}

export async function reorderCurriculum(curriculumId, problemIds) {
    return apiPut(
        `/api/admin/cms/curriculum/${curriculumId}/order`,
        { problemIds },
        { requireAuth: true }
    );
}

export async function searchCurriculumUsers(query = "", size = 20) {
    return apiGet("/api/admin/cms/users", {
        requireAuth: true,
        query: { query, size },
    });
}

export async function getUserCurricula(userId) {
    return apiGet(`/api/admin/cms/users/${userId}/curricula`, {
        requireAuth: true,
    });
}

export async function getCurriculumItems(curriculumId) {
    return apiGet(`/api/admin/cms/curriculum/${curriculumId}/items`, {
        requireAuth: true,
    });
}

export async function reindexProblem(problemId) {
    return apiPost(`/api/admin/cms/problems/${problemId}/reindex`, undefined, {
        requireAuth: true,
    });
}
