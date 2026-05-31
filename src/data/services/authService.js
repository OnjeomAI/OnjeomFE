import {
    clearAuthSession,
    getRefreshToken,
    setAuthTokens,
    setAuthUser,
} from "../../utils/authStorage";
import { mapUserTypeFromRole, normalizeUserProfile } from "../../utils/mappers";
import {
    login as loginApi,
    logout as logoutApi,
    logoutAll as logoutAllApi,
    reissueToken as reissueTokenApi,
    signup as signupApi,
} from "../../api/authApi";

export async function signup({ email, password, nickname }) {
    return signupApi({ email, password, nickname });
}

export async function login({ email, password }) {
    const result = await loginApi({ email, password });
    const userData = result.data || {};
    const normalizedUser = normalizeUserProfile(userData);

    setAuthTokens({
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
    });
    setAuthUser({
        ...userData,
        ...normalizedUser,
    });

    return {
        ...userData,
        ...normalizedUser,
    };
}

export async function verifyEmail() {
    return {
        success: false,
        message: "아직 지원하지 않는 기능입니다.",
    };
}

export async function reissueToken() {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
        throw new Error("Refresh token is missing.");
    }

    const result = await reissueTokenApi(refreshToken);

    setAuthTokens({
        accessToken: result.data?.accessToken,
        refreshToken: result.data?.refreshToken,
    });

    return result.data;
}

export async function logout() {
    try {
        await logoutApi();
    } finally {
        clearAuthSession();
    }
}

export async function logoutAll() {
    try {
        await logoutAllApi();
    } finally {
        clearAuthSession();
    }
}

export async function requestPasswordReset() {
    return {
        success: false,
        message: "아직 지원하지 않는 기능입니다.",
    };
}

export async function resetPassword() {
    return {
        success: false,
        message: "아직 지원하지 않는 기능입니다.",
    };
}

export function getUserTypeFromRole(role) {
    return mapUserTypeFromRole(role);
}
