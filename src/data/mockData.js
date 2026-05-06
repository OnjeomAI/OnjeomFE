export const mockUsers = {
    learner: {
        role: "learner",
        displayName: "김상우",
        levelLabel: "학자 레벨 4",
        nickname: "김상우",
        email: "ksw@onjeom.ai",
        joinedAt: "2023년 9월부터 활동 중",
        dailyGoal: 10,
        fontSize: 100,
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

export function updateMockSettings(type, updatedSettings) {
    if (type === "admin") {
        return updateMockUserByType(type, {
            fontSize: updatedSettings.fontSize,
        });
    }

    return updateMockUserByType(type, {
        dailyGoal: updatedSettings.dailyGoal,
        fontSize: updatedSettings.fontSize,
    });
}