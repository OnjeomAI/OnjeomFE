import {
    clearAuthSession,
    getAccessToken,
    getRefreshToken,
    setAuthTokens,
} from "../utils/authStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildUrl(path, query) {
    const url = new URL(path, API_BASE_URL);

    if (query) {
        Object.entries(query).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
                url.searchParams.set(key, String(value));
            }
        });
    }

    return url.toString();
}

async function parseResponse(response) {
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

async function reissueAccessToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        clearAuthSession();
        return null;
    }

    const response = await fetch(buildUrl("/api/auth/token/reissue"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
        },
        body: JSON.stringify({ refreshToken }),
    });

    const result = await parseResponse(response);

    if (!response.ok || !result?.success || !result?.data?.accessToken) {
        clearAuthSession();
        return null;
    }

    setAuthTokens({
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
    });

    return result.data.accessToken;
}

export async function apiRequest(path, options = {}, retryOnUnauthorized = true) {
    const {
        method = "GET",
        headers = {},
        body,
        query,
        requireAuth = false,
    } = options;
    const accessToken = getAccessToken();
    const requestHeaders = {
        "Content-Type": "application/json",
        ...headers,
    };

    if (requireAuth && accessToken) {
        requestHeaders.Authorization = `Bearer ${accessToken}`;
    }

    if (body === undefined || body === null || method.toUpperCase() === "GET") {
        delete requestHeaders["Content-Type"];
    }

    const response = await fetch(buildUrl(path, query), {
        method,
        headers: requestHeaders,
        ...(body !== undefined && body !== null && method.toUpperCase() !== "GET"
            ? { body: JSON.stringify(body) }
            : {}),
    });

    if (response.status === 401 && retryOnUnauthorized && requireAuth) {
        const nextAccessToken = await reissueAccessToken();

        if (nextAccessToken) {
            return apiRequest(path, options, false);
        }
    }

    const result = await parseResponse(response);

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "API request failed.");
    }

    return result;
}

export async function apiGet(path, options = {}) {
    return apiRequest(path, {
        ...options,
        method: "GET",
    });
}

export async function apiPost(path, body, options = {}) {
    return apiRequest(path, {
        ...options,
        method: "POST",
        body,
    });
}

export async function apiPut(path, body, options = {}) {
    return apiRequest(path, {
        ...options,
        method: "PUT",
        body,
    });
}

export async function apiPatch(path, body, options = {}) {
    return apiRequest(path, {
        ...options,
        method: "PATCH",
        body,
    });
}

export async function apiDelete(path, options = {}) {
    return apiRequest(path, {
        ...options,
        method: "DELETE",
    });
}

