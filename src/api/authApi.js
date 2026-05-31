import { apiPost } from "./client";

export async function signup(payload) {
    return apiPost("/api/auth/signup", payload);
}

export async function login(payload) {
    return apiPost("/api/auth/login", payload);
}

export async function reissueToken(refreshToken) {
    return apiPost("/api/auth/token/reissue", { refreshToken }, {
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    });
}

export async function logout() {
    return apiPost("/api/auth/logout", undefined, { requireAuth: true });
}

export async function logoutAll() {
    return apiPost("/api/auth/logout/all", undefined, { requireAuth: true });
}
