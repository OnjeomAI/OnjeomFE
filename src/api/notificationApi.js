import { apiGet } from "./client";

export async function getNotifications() {
    return apiGet("/api/notifications", { requireAuth: true });
}

