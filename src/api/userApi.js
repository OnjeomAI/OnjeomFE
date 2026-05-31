import { apiGet, apiPut } from "./client";

export async function getMyProfile() {
    return apiGet("/api/users/me", { requireAuth: true });
}

export async function updateMyProfile(payload) {
    return apiPut("/api/users/me", payload, { requireAuth: true });
}

