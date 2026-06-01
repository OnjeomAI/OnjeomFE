import { apiPost } from "./client";

export async function askTutor(payload) {
    const result = await apiPost("/api/ai/tutor", payload, {
        requireAuth: true,
    });

    return result.data || null;
}

export async function explainTerm(payload) {
    const result = await apiPost("/api/ai/explain", payload, {
        requireAuth: true,
    });

    return result.data || null;
}

export async function generateAiProblem(payload) {
    const result = await apiPost("/api/admin/cms/problems/generate", payload, {
        requireAuth: true,
    });

    return result.data || null;
}
