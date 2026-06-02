import { getAuthUser, setAuthUser } from "../../utils/authStorage";
import {
    mapFontSizePercentToEnum,
    mapUserTypeFromRole,
    normalizeUserProfile,
} from "../../utils/mappers";
import { getDiagnosticResult } from "../../api/diagnosticApi";
import { getMyProfile, updateMyProfile } from "./userService";

export async function getUserByType(type) {
    const storedUser = getAuthUser();

    if (!storedUser) {
        return null;
    }

    const normalizedUser = normalizeUserProfile(storedUser, type);

    if (normalizedUser.role === "learner" || type === "learner") {
        try {
            return await getMyProfile(type);
        } catch {
            return normalizedUser;
        }
    }

    return normalizedUser;
}

export async function getUserById(userId) {
    const storedUser = getAuthUser();

    if (!storedUser) {
        return null;
    }

    const normalizedUser = normalizeUserProfile(storedUser);

    return normalizedUser.id === userId ? normalizedUser : null;
}

export async function verifyLogin() {
    return null;
}

export async function getAfterLoginPath(type) {
    if (type === "admin") {
        return "/admin/question";
    }

    const learner = normalizeUserProfile(getAuthUser(), "learner");

    if (learner.hasCompletedDiagnosis) {
        return "/dashboard";
    }

    try {
        const result = await getDiagnosticResult();

        if (result.data) {
            const nextUser = {
                ...learner,
                hasCompletedDiagnosis: true,
                learningState: {
                    ...(learner.learningState || {}),
                    hasCompletedDiagnosis: true,
                },
            };

            setAuthUser(nextUser);
            return "/dashboard";
        }
    } catch {
        return "/onboarding/diagnosis";
    }

    return "/onboarding/diagnosis";
}

export async function updateProfile(type, updatedProfile) {
    return updateMyProfile(type, {
        nickname: updatedProfile.nickname,
    });
}

export async function updateSettings(type, updatedSettings) {
    const currentUser = normalizeUserProfile(getAuthUser(), type);

    if (type === "admin") {
        const nextUser = {
            ...currentUser,
            fontSize: updatedSettings.fontSize ?? currentUser.fontSize,
        };

        setAuthUser(nextUser);
        return nextUser;
    }

    return updateMyProfile(type, {
        nickname: currentUser.nickname,
        dailyGoal: updatedSettings.dailyGoal ?? currentUser.dailyGoal,
        alarmEnabled:
            updatedSettings.alarmEnabled ??
            (updatedSettings.notificationSettings
                ? Object.values(updatedSettings.notificationSettings).some(Boolean)
                : currentUser.alarmEnabled),
        fontSize: updatedSettings.fontSize ?? currentUser.fontSize,
        fontSizeMode:
            updatedSettings.fontSizeMode ??
            mapFontSizePercentToEnum(
                updatedSettings.fontSize ?? currentUser.fontSize
            ),
    }).then((updatedUser) => {
        const nextUser = {
            ...updatedUser,
            fontSize: updatedSettings.fontSize ?? currentUser.fontSize,
        };

        setAuthUser(nextUser);
        return nextUser;
    });
}

export async function markDiagnosisCompleted() {
    const currentUser = normalizeUserProfile(getAuthUser(), "learner");
    const nextUser = {
        ...currentUser,
        hasCompletedDiagnosis: true,
        learningState: {
            ...(currentUser.learningState || {}),
            hasCompletedDiagnosis: true,
        },
    };

    setAuthUser(nextUser);

    return nextUser.learningState;
}

export function getUserTypeFromRole(role) {
    return mapUserTypeFromRole(role);
}
