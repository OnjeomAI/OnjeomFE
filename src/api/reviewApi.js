import { apiGet } from "./client";

export async function getTodayReviews() {
    return apiGet("/api/review/today", { requireAuth: true });
}

export async function getAllReviewSchedules() {
    return apiGet("/api/review/all", { requireAuth: true });
}
