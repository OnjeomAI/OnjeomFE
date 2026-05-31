import { apiPost } from "./client";

export async function adjustCurriculum(payload) {
    return apiPost("/api/writing/curriculum/adjust", payload, {
        requireAuth: true,
    });
}

export async function compareWriting(payload) {
    return apiPost("/api/writing/compare", payload, { requireAuth: true });
}

export async function createWeaknessReport(payload) {
    return apiPost("/api/writing/weakness-report", payload, {
        requireAuth: true,
    });
}

