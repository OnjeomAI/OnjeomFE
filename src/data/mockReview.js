const mockReviewData = {
    subtitle: "성취도 분석",
    title: "답변 변화 추적",

    archive: {
        badge: "비판적 읽기",
        code: "ARCH-402",
        title: "19세기 영국 산업 자동화의 사회경제적 영향에 대하여",
    },

    achievement: {
        title: "성취도 변화 곡선",
    },

    insight: {
        title: "지속적인 진화",
        description:
            '"핵심 키워드를 2개 더 포함했습니다. 점수가 15점 올랐어요! 🎉"',
        detail: "세 번째 문단의 논리적 연결성이 개선되었습니다.",
    },

    submissions: [
        {
            id: "submit-004",
            attemptNumber: 4,
            score: 92,
            submittedAt: "2026-10-24T14:20:00",
            text: "기술 발전과 노동력 대체의 상호 작용은 미묘한 관점을 시사하며...",
            isLatest: true,
        },
        {
            id: "submit-003",
            attemptNumber: 3,
            score: 77,
            submittedAt: "2026-10-20T11:45:00",
            text: "영국의 산업 자동화는 노동 시장의 급격한 변화를 가져왔으며...",
            isLatest: false,
        },
        {
            id: "submit-002",
            attemptNumber: 2,
            score: 62,
            submittedAt: "2026-10-15T09:12:00",
            text: "당시 숙련된 장인들에게 있어 가장 큰 영향은 일자리의 상실이었습니다...",
            isLatest: false,
        },
        {
            id: "submit-001",
            attemptNumber: 1,
            score: 45,
            submittedAt: "2026-10-12T16:30:00",
            text: "본문은 19세기에 기계가 어떻게 모든 것을 바꾸었는지 설명합니다.",
            isLatest: false,
        },
    ],
};

function formatSubmissionDate(submittedAt) {
    const date = new Date(submittedAt);
    const period = date.getHours() >= 12 ? "PM" : "AM";
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");

    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 · ${hour}:${minute} ${period}`;
}

function getSubmissionTitle(submission) {
    return submission.isLatest
        ? "현재 제출분"
        : `${submission.attemptNumber}회차 제출`;
}

function getAchievementScores(submissions) {
    return [...submissions]
        .sort((a, b) => a.attemptNumber - b.attemptNumber)
        .map((submission) => ({
            id: submission.id,
            label: submission.isLatest ? "최근" : `${submission.attemptNumber}회차`,
            score: submission.score,
        }));
}

export function getMockReviewData() {
    return {
        ...mockReviewData,
        achievement: {
            ...mockReviewData.achievement,
            scores: getAchievementScores(mockReviewData.submissions),
        },
        submissions: mockReviewData.submissions.map((submission) => ({
            ...submission,
            title: getSubmissionTitle(submission),
            date: formatSubmissionDate(submission.submittedAt),
            current: submission.isLatest,
        })),
    };
}
