import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "../utils/authStorage";

const RAW_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL =
    typeof RAW_API_BASE_URL === "string"
        ? RAW_API_BASE_URL.trim()
        : RAW_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL 값이 없습니다.");
}

try {
    new URL(API_BASE_URL);
} catch {
    throw new Error(
        `VITE_API_BASE_URL 값이 올바르지 않습니다: ${String(API_BASE_URL)}`
    );
}

function buildUrl(path, query) {
    const url = new URL(path, API_BASE_URL);

    if (query && typeof query === "object") {
        const searchParams = new URLSearchParams();

        Object.entries(query).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                return;
            }

            if (Array.isArray(value)) {
                value.forEach((item) => searchParams.append(key, String(item)));
                return;
            }

            searchParams.set(key, String(value));
        });

        url.search = searchParams.toString();
    }

    return url.toString();
}

function redirectToLogin() {
    if (typeof window === "undefined") {
        return;
    }

    const nextPath = window.location.pathname.startsWith("/admin")
        ? "/admin"
        : "/login";

    if (window.location.pathname !== nextPath) {
        window.location.assign(nextPath);
    }
}

async function parseJsonSafely(response) {
    const contentType = response.headers.get("content-type") || "";

    if (!contentType.includes("application/json")) {
        return null;
    }

    try {
        return await response.json();
    } catch {
        return null;
    }
}

async function parseResponseByType(response, responseType) {
    if (responseType === "blob") {
        return response.blob();
    }

    if (responseType === "text") {
        return response.text();
    }

    return parseJsonSafely(response);
}

async function handleAuthFailure() {
    clearAuthSession();
    redirectToLogin();
}

async function requestTokenReissue(refreshToken) {
    const response = await fetch(buildUrl("/api/auth/token/reissue"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
    });

    const result = await parseJsonSafely(response);

    if (!response.ok || !result?.success || !result?.data?.accessToken) {
        return null;
    }

    return result.data;
}

async function reissueAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        await handleAuthFailure();
        return null;
    }

    const tokenData = await requestTokenReissue(refreshToken);

    if (!tokenData) {
        await handleAuthFailure();
        return null;
    }

    setAuthTokens({
        accessToken: tokenData.accessToken,
        refreshToken: tokenData.refreshToken,
    });

    return tokenData.accessToken;
}

export async function apiRequest(path, options = {}, retryOnUnauthorized = true) {
    const {
        method = "GET",
        headers = {},
        body,
        query,
        requireAuth = false,
        responseType = "json",
    } = options;
    const normalizedMethod = method.toUpperCase();
    const accessToken = getAccessToken();
    const requestHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (requireAuth && accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    if (normalizedMethod === "GET" || body === undefined || body === null) {
        delete requestHeaders["Content-Type"];
    }

    const response = await fetch(buildUrl(path, query), {
        method: normalizedMethod,
        headers: requestHeaders,
        ...(normalizedMethod !== "GET" && body !== undefined && body !== null
            ? { body: JSON.stringify(body) }
            : {}),
    });

    if (response.status === 401 && retryOnUnauthorized && requireAuth) {
        const nextAccessToken = await reissueAccessToken();

        if (nextAccessToken) {
            return apiRequest(path, options, false);
        }
    }

    const parsed = await parseResponseByType(response, responseType);

    if (responseType !== "json") {
        if (!response.ok) {
            throw new Error("API request failed.");
        }

        return parsed;
    }

    if (!response.ok || !parsed?.success) {
        if (response.status === 401 && requireAuth) {
            await handleAuthFailure();
        }

        throw new Error(parsed?.message || "API request failed.");
    }

    return parsed;
}

export async function apiGet(path, options = {}) {
    return apiRequest(path, { ...options, method: "GET" });
}

export async function apiPost(path, body, options = {}) {
    return apiRequest(path, { ...options, method: "POST", body });
}

export async function apiPut(path, body, options = {}) {
    return apiRequest(path, { ...options, method: "PUT", body });
}

export async function apiPatch(path, body, options = {}) {
    return apiRequest(path, { ...options, method: "PATCH", body });
}

export async function apiDelete(path, options = {}) {
    return apiRequest(path, { ...options, method: "DELETE" });
}
