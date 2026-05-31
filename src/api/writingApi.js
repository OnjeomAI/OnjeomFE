import { apiPost } from "./client";

export async function generateWeaknessReport(payload) {
    return apiPost("/api/writing/weakness-report", payload, {
        requireAuth: true,
    });
}

export async function adjustCurriculum(payload) {
    return apiPost("/api/writing/curriculum/adjust", payload, {
        requireAuth: true,
    });
}

export async function compareAnswers(payload) {
    return apiPost("/api/writing/compare", payload, { requireAuth: true });
}

export const compareWriting = compareAnswers;
export const createWeaknessReport = generateWeaknessReport;
