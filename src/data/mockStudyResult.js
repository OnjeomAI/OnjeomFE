import { getScoreStatusLabel } from "./mockFormatters.js";

const mockStudyResult = {
    sessionTitle: "학습 세션 채점: 기술 경제학",
    score: 78,
    maxScore: 100,
    grading: {
        engine: "AI",
        elapsedSeconds: 2.3,
    },

    userAnswer:
        "이 정책을 선택하는 데 따른 근본적인 기회비용은 높습니다. 한계 효용은 언뜻 보기에 긍정적으로 보이지만, 균형 이동에 대한 고려가 부족하여 예측이 불안정합니다. 또한 공급망에 미치는 영향도 살펴봐야 합니다. 그러나 이 맥락에서 희소성의 원칙은 충분히 다뤄지지 않았습니다.",

    modelAnswer:
        "효과적인 분석을 위해서는 기회비용과 희소성의 원칙 사이의 균형이 필요합니다. 자원의 한계 효용을 분석함으로써 공급망 내의 균형 이동을 예측하고 장기적인 재정 안정을 보장할 수 있습니다.",

    analysisItems: [
        {
            id: "keyword-001",
            type: "good",
            title: "기회비용 (OPPORTUNITY COST)",
            description:
                "완벽하게 적용되었습니다. 모든 선택에는 상충 관계가 있음을 정확히 식별하고 이를 주요 정책 결정과 연결했습니다.",
        },
        {
            id: "keyword-002",
            type: "bad",
            title: "균형 이동 (EQUILIBRIUM SHIFTS)",
            description:
                "언급은 되었으나 설명이 부족합니다. 용어는 사용했지만, 수요-공급 균형이 실제로 어떻게 변하는지에 대한 설명이 누락되었습니다.",
        },
        {
            id: "keyword-003",
            type: "good",
            title: "한계 효용 (MARGINAL UTILITY)",
            description:
                "강력한 통합입니다. 효용에 대한 설명 내에서 한계 효용 체감의 법칙 논리를 아주 훌륭하게 사용했습니다.",
        },
    ],

    expertInsight: {
        label: "AI 전문가 인사이트",
        category: "논리적 공백",
        description:
            "사용자는 개별 용어에 대한 이해도는 높으나, 희소성과 가격 균형 사이의 관계를 설명하는 연결 고리가 부족합니다. 미시경제적 흐름도에 집중하여 학습할 것을 권장합니다.",
    },
};

export function getMockStudyResult() {
    const strongPoints = mockStudyResult.analysisItems.filter(
        (item) => item.type === "good"
    ).length;

    const weakPoints = mockStudyResult.analysisItems.filter(
        (item) => item.type === "bad"
    ).length;

    return {
        ...mockStudyResult,
        statusLabel: getScoreStatusLabel(mockStudyResult.score),
        gradingTime: `${mockStudyResult.grading.engine} 채점 완료 (${mockStudyResult.grading.elapsedSeconds}초)`,
        strongPoints,
        weakPoints,
    };
}
