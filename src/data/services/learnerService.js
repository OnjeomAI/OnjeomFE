// 사용자 조회, 로그인 검증, 프로필/설정 변경을 담당하는 mock API 서비스입니다.
import { credentials, users } from "../mockDb/users.js";

function findUserByRole(role) {
    return users.find((user) => user.role === role);
}

export async function getUserByType(type) {
    return findUserByRole(type === "admin" ? "admin" : "learner");
}

export async function getUserById(userId) {
    return users.find((user) => user.id === userId) || null;
}

export async function verifyLogin(email, password) {
    const credential = credentials.find(
        (item) =>
            item.email.toLowerCase() === email.trim().toLowerCase() &&
            item.password === password
    );

    if (!credential) {
        return null;
    }

    const user = await getUserById(credential.userId);

    return {
        userType: user.role,
        user,
    };
}

export async function getAfterLoginPath(type) {
    if (type === "admin") {
        return "/admin/question";
    }

    const learner = findUserByRole("learner");

    return learner.learningState.hasCompletedDiagnosis
        ? "/dashboard"
        : "/onboarding/diagnosis";
}

export async function updateProfile(type, updatedProfile) {
    const user = findUserByRole(type === "admin" ? "admin" : "learner");

    Object.assign(user, {
        nickname: updatedProfile.nickname,
        displayName: updatedProfile.nickname,
        email: updatedProfile.email,
    });

    return user;
}

export async function updateSettings(type, updatedSettings) {
    const user = findUserByRole(type === "admin" ? "admin" : "learner");

    if (updatedSettings.fontSize !== undefined) {
        user.fontSize = updatedSettings.fontSize;
    }

    if (user.role === "learner" && updatedSettings.dailyGoal !== undefined) {
        user.dailyGoal = updatedSettings.dailyGoal;
    }

    if (
        user.role === "learner" &&
        updatedSettings.notificationSettings !== undefined
    ) {
        user.notificationSettings = updatedSettings.notificationSettings;
    }

    return user;
}

export async function markDiagnosisCompleted() {
    const learner = findUserByRole("learner");

    learner.learningState.hasCompletedDiagnosis = true;

    return learner.learningState;
}
