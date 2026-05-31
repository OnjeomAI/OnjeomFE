import { apiPost } from "./client";

export async function signup(email, password, nickname) {
    return apiPost("/api/auth/signup", { email, password, nickname });
}

export async function verifyEmail(email, otpCode) {
    return apiPost("/api/auth/email/verify", { email, otpCode });
}

export async function login(email, password) {
    return apiPost("/api/auth/login", { email, password });
}

export async function reissueToken(refreshToken) {
    return apiPost(
        "/api/auth/token/reissue",
        { refreshToken },
        {
            headers: {
                Authorization: `Bearer ${refreshToken}`,
            },
        }
    );
}

export async function logout() {
    return apiPost("/api/auth/logout", undefined, { requireAuth: true });
}

export async function logoutAll() {
    return apiPost("/api/auth/logout/all", undefined, { requireAuth: true });
}

export async function requestPasswordReset(email) {
    return apiPost("/api/auth/password/reset-request", { email });
}

export async function resetPassword(token, newPassword) {
    return apiPost("/api/auth/password/reset", { token, newPassword });
}

