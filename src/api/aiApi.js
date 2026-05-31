import { apiPost } from "./client";

export async function askTutor(payload) {
    return apiPost("/api/ai/tutor", payload, { requireAuth: true });
}

export async function explainTerm(payload) {
    return apiPost("/api/ai/explain", payload, { requireAuth: true });
}

