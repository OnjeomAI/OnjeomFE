import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
    setAuthUser,
} from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

async function requestAuth(path, options = {}) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "인증 요청에 실패했습니다.");
    }

    return result;
}

export async function signup({ email, password, nickname }) {
    return requestAuth("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
            nickname,
        }),
    });
}

export async function login({ email, password }) {
    const result = await requestAuth("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
            email,
            password,
        }),
    });

    const userData = result.data || {};

    setAuthTokens({
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
    });
    setAuthUser(userData);

    return userData;
}

export async function verifyEmail({ email, otpCode }) {
    return requestAuth("/api/auth/email/verify", {
        method: "POST",
        body: JSON.stringify({
            email,
            otpCode,
        }),
    });
}

export async function reissueToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error("refresh token이 없습니다.");
    }

    const result = await requestAuth("/api/auth/token/reissue", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${refreshToken}`,
        },
    });

    setAuthTokens({
        accessToken: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
    });

    return result.data;
}

export async function logout() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        clearAuthSession();
        return;
    }

    try {
        await requestAuth("/api/auth/logout", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } finally {
        clearAuthSession();
    }
}

export async function logoutAll() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        clearAuthSession();
        return;
    }

    try {
        await requestAuth("/api/auth/logout/all", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } finally {
        clearAuthSession();
    }
}

export async function requestPasswordReset(email) {
    return requestAuth("/api/auth/password/reset-request", {
        method: "POST",
        body: JSON.stringify({
            email,
        }),
    });
}

export async function resetPassword({ token, newPassword }) {
    return requestAuth("/api/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({
            token,
            newPassword,
        }),
    });
}

export function getUserTypeFromRole(role) {
    if (role === "ROLE_ADMIN" || role === "admin") {
        return "admin";
    }

    return "learner";
}
