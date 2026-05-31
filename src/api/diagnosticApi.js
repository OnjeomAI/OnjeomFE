import { apiGet, apiPost } from "./client";

export async function startDiagnostic() {
    return apiPost("/api/diagnostic/start", undefined, { requireAuth: true });
}

export async function submitDiagnosticAnswer(payload) {
    return apiPost("/api/diagnostic/submit", payload, { requireAuth: true });
}

export async function getDiagnosticResult() {
    return apiGet("/api/diagnostic/result", { requireAuth: true });
}

