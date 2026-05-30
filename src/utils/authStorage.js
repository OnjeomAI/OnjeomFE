const ACCESS_TOKEN_KEY = "onjeom-access-token";
const REFRESH_TOKEN_KEY = "onjeom-refresh-token";
const USER_KEY = "onjeom-user";

export function setAuthTokens({ accessToken, refreshToken }) {
    if (accessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    }
}

export function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function clearAuthTokens() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function setAuthUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getAuthUser() {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
        return null;
    }

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
}

export function clearAuthUser() {
    localStorage.removeItem(USER_KEY);
}

export function clearAuthSession() {
    clearAuthTokens();
    clearAuthUser();
}
