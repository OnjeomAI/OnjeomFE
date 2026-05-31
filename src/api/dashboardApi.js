import { apiGet } from "./client";

export async function getRadar() {
    return apiGet("/api/dashboard/radar", { requireAuth: true });
}

export async function getStats() {
    return apiGet("/api/dashboard/stats", { requireAuth: true });
}

export async function getToday() {
    return apiGet("/api/dashboard/today", { requireAuth: true });
}

export async function getRecentResponses(page = 0, size = 10) {
    return apiGet("/api/dashboard/recent-responses", {
        requireAuth: true,
        query: { page, size },
    });
}

export async function getWeakPoints() {
    return apiGet("/api/dashboard/weak-points", { requireAuth: true });
}

export async function getAdminStats() {
    return apiGet("/api/admin/dashboard/stats", { requireAuth: true });
}

export async function exportAdminStatsCsv() {
    return apiGet("/api/admin/dashboard/stats/export", {
        requireAuth: true,
        responseType: "blob",
    });
}
