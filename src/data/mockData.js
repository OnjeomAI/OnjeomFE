let mockUsers = {
    learner: {
        role: "learner",
        displayName: "김상우",
        levelLabel: "학자 레벨 4",
        nickname: "김상우",
        email: "ksw@onjeom.ai",
        joinedAt: "2023년 9월부터 활동 중",
        dailyGoal: 10,
        fontSize: 100,
        notificationSettings: {
            reviewReminder: true,
            goalEncouragement: true,
            weaknessReport: false,
            achievementMessage: true,
        },
    },

    admin: {
        role: "admin",
        displayName: "관리자",
        levelLabel: "시스템 관리자",
        nickname: "관리자",
        email: "admin@onjeom.ai",
        joinedAt: "관리자 계정",
        fontSize: 100,
    },
};

export function getMockUserByType(type) {
    return type === "admin" ? mockUsers.admin : mockUsers.learner;
}

export function updateMockUserByType(type, updatedFields) {
    const targetType = type === "admin" ? "admin" : "learner";

    mockUsers[targetType] = {
        ...mockUsers[targetType],
        ...updatedFields,
    };

    if (updatedFields.nickname) {
        mockUsers[targetType].displayName = updatedFields.nickname;
    }

    return mockUsers[targetType];
}

export function updateMockProfile(type, updatedProfile) {
    return updateMockUserByType(type, {
        nickname: updatedProfile.nickname,
        email: updatedProfile.email,
    });
}

export function updateMockSettings(type, updatedSettings) {
    const nextFields = {};

    if (updatedSettings.fontSize !== undefined) {
        nextFields.fontSize = updatedSettings.fontSize;
    }

    if (type === "learner" && updatedSettings.dailyGoal !== undefined) {
        nextFields.dailyGoal = updatedSettings.dailyGoal;
    }

    if (type === "learner" && updatedSettings.notificationSettings !== undefined) {
        nextFields.notificationSettings = updatedSettings.notificationSettings;
    }

    return updateMockUserByType(type, nextFields);
}