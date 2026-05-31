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
    requestPasswordReset as requestPasswordResetApi,
    resetPassword as resetPasswordApi,
    reissueToken as reissueTokenApi,
    signup as signupApi,
    verifyEmail as verifyEmailApi,
} from "../../api/authApi";

export async function signup({ email, password, nickname }) {
    return signupApi(email, password, nickname);
}

export async function login({ email, password }) {
    const result = await loginApi(email, password);
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

export async function verifyEmail({ email, otpCode }) {
    return verifyEmailApi(email, otpCode);
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

export async function requestPasswordReset(email) {
    return requestPasswordResetApi(email);
}

export async function resetPassword({ token, newPassword }) {
    return resetPasswordApi(token, newPassword);
}

export function getUserTypeFromRole(role) {
    return mapUserTypeFromRole(role);
}

