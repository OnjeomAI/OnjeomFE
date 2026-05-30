// 복습 화면에서 보여줄 제출 아카이브와 연결된 제출 이력 ID를 보관합니다.
export const reviewArchives = [
    {
        id: "review-archive-001",
        learnerId: "user-learner-001",
        questionId: "question-study-003",
        badge: "비판적 읽기",
        code: "ARCH-402",
        title: "19세기 영국 산업 자동화의 사회경제적 영향에 대하여",
        subtitle: "성취도 분석",
        pageTitle: "답변 변화 추적",
        insight: {
            title: "지속적인 진화",
            description: "\"핵심 키워드를 2개 더 포함했습니다. 점수가 15점 올랐어요!\"",
            detail: "세 번째 문단의 논리적 연결성이 개선되었습니다.",
        },
        submissionIds: [
            "submission-archive-004",
            "submission-archive-003",
            "submission-archive-002",
            "submission-archive-001",
        ],
    },
];
