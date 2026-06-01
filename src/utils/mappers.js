import { getAuthUser } from "./authStorage";

export function getScoreType(score) {
    if (score >= 85) {
        return "excellent";
    }

    if (score >= 70) {
        return "good";
    }

    if (score >= 50) {
        return "average";
    }

    return "low";
}

export function mapReadingTypeLabel(readingType) {
    const labels = {
        FACTUAL: "사실 이해",
        INFERENTIAL: "추론 이해",
        CRITICAL: "비판 이해",
        CREATIVE: "창의 이해",
        LOGICAL: "논리 이해",
        VOCABULARY: "어휘 이해",
    };

    return labels[readingType] || readingType || "-";
}

export function mapUserTypeFromRole(role) {
    if (role === "ROLE_ADMIN" || role === "admin") {
        return "admin";
    }

    return "learner";
}

export function mapFontSizeEnumToPercent(fontSize) {
    if (fontSize === "SMALL") {
        return 90;
    }

    if (fontSize === "LARGE") {
        return 110;
    }

    return 100;
}

export function mapFontSizePercentToEnum(fontSize) {
    const numeric = Number(fontSize);

    if (numeric <= 95) {
        return "SMALL";
    }

    if (numeric >= 105) {
        return "LARGE";
    }

    return "MEDIUM";
}

export function normalizeUserProfile(data, fallbackType = "learner") {
    const storedUser = getAuthUser() || {};
    const merged = {
        ...storedUser,
        ...data,
    };
    const role = merged.role || fallbackType;
    const isAdmin = mapUserTypeFromRole(role) === "admin";
    const alarmEnabled = Boolean(merged.alarmEnabled);
    const normalizedFontSize =
        typeof merged.fontSize === "string"
            ? mapFontSizeEnumToPercent(merged.fontSize)
            : merged.fontSize ?? 100;

    return {
        userId: merged.userId ?? merged.id ?? null,
        id: merged.userId ?? merged.id ?? null,
        role: isAdmin ? "admin" : "learner",
        email: merged.email || "",
        nickname: merged.nickname || merged.displayName || "",
        displayName: merged.nickname || merged.displayName || "",
        dailyGoal: merged.dailyGoal ?? 10,
        alarmEnabled,
        emailVerified: Boolean(merged.emailVerified),
        fontSize: normalizedFontSize,
        fontSizeMode:
            typeof merged.fontSize === "string"
                ? merged.fontSize
                : mapFontSizePercentToEnum(normalizedFontSize),
        joinedAt: merged.joinedAt || "",
        levelLabel: isAdmin ? "관리자" : merged.levelLabel || "학습자",
        notificationSettings: {
            reviewReminder: alarmEnabled,
            goalEncouragement: alarmEnabled,
            weaknessReport: alarmEnabled,
            achievementMessage: alarmEnabled,
        },
        hasCompletedDiagnosis:
            merged.hasCompletedDiagnosis ??
            merged.learningState?.hasCompletedDiagnosis ??
            merged.diagnosisCompleted ??
            false,
    };
}
