export const mockUsers = {
    learner: {
        role: "learner",
        displayName: "김상우",
        levelLabel: "학자 레벨 4",
        nickname: "김상우",
        email: "ksw@onjeom.ai",
        joinedAt: "2023년 9월부터 활동 중",
    },

    admin: {
        role: "admin",
        displayName: "관리자",
        levelLabel: "시스템 관리자",
        nickname: "관리자",
        email: "admin@onjeom.ai",
        joinedAt: "관리자 계정",
    },
};

export function getMockUserByType(type) {
    return type === "admin" ? mockUsers.admin : mockUsers.learner;
}