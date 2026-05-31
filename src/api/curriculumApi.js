import { apiGet, apiPatch } from "./client";

export async function getMyCurriculum() {
    return apiGet("/api/curriculum/me", { requireAuth: true });
}

export async function getCurriculumProgress() {
    return apiGet("/api/curriculum/progress", { requireAuth: true });
}

export async function startCurriculumItem(itemId) {
    return apiPatch(`/api/curriculum/items/${itemId}/start`, undefined, {
        requireAuth: true,
    });
}

export async function skipCurriculumItem(itemId) {
    return apiPatch(`/api/curriculum/items/${itemId}/skip`, undefined, {
        requireAuth: true,
    });
}

export async function completeCurriculumItem(itemId) {
    return apiPatch(`/api/curriculum/items/${itemId}/complete`, undefined, {
        requireAuth: true,
    });
}

