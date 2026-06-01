import { apiPost } from "./client";

export async function generateWeaknessReport(payload) {
    const result = await apiPost("/api/writing/weakness-report", payload, {
        requireAuth: true,
    });

    return result.data || null;
}

export async function adjustCurriculum(payload) {
    const result = await apiPost("/api/writing/curriculum/adjust", payload, {
        requireAuth: true,
    });

    return result.data || null;
}

export async function compareAnswers(payload) {
    const result = await apiPost("/api/writing/compare", payload, {
        requireAuth: true,
    });

    return result.data || null;
}

export const compareWriting = compareAnswers;
export const createWeaknessReport = generateWeaknessReport;
