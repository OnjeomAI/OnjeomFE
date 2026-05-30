import {
    getAccessToken,
    getAuthUser,
    setAuthUser,
} from "../../utils/authStorage";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function buildNotificationSettings(alarmEnabled) {
    return {
        reviewReminder: Boolean(alarmEnabled),
        goalEncouragement: Boolean(alarmEnabled),
        weaknessReport: Boolean(alarmEnabled),
        achievementMessage: Boolean(alarmEnabled),
    };
}

function normalizeUserProfile(data, fallbackType = "learner") {
    const storedUser = getAuthUser() || {};
    const role = data?.role || storedUser.role || fallbackType;
    const isAdmin = role === "ROLE_ADMIN" || role === "admin";
    const alarmEnabled = Boolean(data?.alarmEnabled);

    return {
        userId: data?.userId ?? storedUser.userId ?? null,
        id: data?.userId ?? storedUser.userId ?? null,
        role: isAdmin ? "admin" : "learner",
        email: data?.email ?? storedUser.email ?? "",
        nickname: data?.nickname ?? storedUser.nickname ?? "",
        displayName: data?.nickname ?? storedUser.nickname ?? "",
        dailyGoal: data?.dailyGoal ?? storedUser.dailyGoal ?? 10,
        alarmEnabled,
        emailVerified: Boolean(data?.emailVerified),
        fontSize: storedUser.fontSize ?? 100,
        joinedAt: storedUser.joinedAt ?? "",
        levelLabel: isAdmin ? "관리자" : storedUser.levelLabel ?? "학습자",
        notificationSettings: buildNotificationSettings(alarmEnabled),
    };
}

async function requestUser(path, options = {}) {
    const accessToken = getAccessToken();

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(accessToken
                ? { Authorization: `Bearer ${accessToken}` }
                : {}),
            ...options.headers,
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(result?.message || "사용자 요청에 실패했습니다.");
    }

    return result;
}

export async function getMyProfile(type = "learner") {
    const result = await requestUser("/api/users/me", {
        method: "GET",
    });

    const normalizedUser = normalizeUserProfile(result.data, type);
    setAuthUser({
        ...getAuthUser(),
        ...result.data,
    });

    return normalizedUser;
}

export async function updateMyProfile(type = "learner", updatedFields = {}) {
    const result = await requestUser("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({
            nickname: updatedFields.nickname,
            dailyGoal: updatedFields.dailyGoal,
            alarmEnabled: updatedFields.alarmEnabled,
        }),
    });

    const normalizedUser = normalizeUserProfile(result.data, type);
    setAuthUser({
        ...getAuthUser(),
        ...result.data,
        nickname: normalizedUser.nickname,
        dailyGoal: normalizedUser.dailyGoal,
        alarmEnabled: normalizedUser.alarmEnabled,
    });

    return normalizedUser;
}
