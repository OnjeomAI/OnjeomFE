import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    CircleUserRound,
    Check,
    ExternalLink,
    RotateCcw,
    X,
    Zap,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";

const resultData = {
    sessionTitle: "학습 세션 채점: 기술 경제학",
    score: 78,
    maxScore: 100,
    statusLabel: "보완 필요",
    gradingTime: "AI 채점 완료 (2.3초)",
    strongPoints: 3,
    weakPoints: 2,

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

function LearnerResult() {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate("/today");
    };

    const handleNextProblem = () => {
        navigate("/today");
    };

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    const handleReviewConcept = () => {
        navigate("/review");
    };

    return (
        <div className="learner-result-page">
            <header className="result-header">
                <div className="result-header-left">
                    <button
                        type="button"
                        className="result-back-button"
                        onClick={handleBack}
                        aria-label="학습 화면으로 돌아가기"
                    >
                        <ArrowLeft size={22} strokeWidth={2.2} />
                    </button>

                    <h1>{resultData.sessionTitle}</h1>
                </div>

                <div className="result-header-icons">
                    <button type="button" aria-label="알림">
                        <Bell size={21} strokeWidth={2} />
                    </button>

                    <button type="button" aria-label="프로필">
                        <CircleUserRound size={25} strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className="result-main">
                <section className="result-score-section">
                    <div className="result-score-left">
                        <p className="result-score-label">최종 평가</p>

                        <div className="result-score-row">
                            <strong>{resultData.score}</strong>
                            <span>/100</span>

                            <em>{resultData.statusLabel}</em>
                        </div>

                        <p className="result-grading-time">
                            <Zap size={14} strokeWidth={2.2} />
                            {resultData.gradingTime}
                        </p>
                    </div>

                    <div className="result-point-summary">
                        <span>현황</span>

                        <div>
                            <strong>우수 포인트 {resultData.strongPoints}</strong>
                            <strong className="weak">
                                부족 포인트 {resultData.weakPoints}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="result-answer-compare">
                    <div className="answer-column">
                        <div className="answer-column-header">
                            <span className="answer-dot"></span>
                            <h2>나의 답변</h2>
                        </div>

                        <Card className="answer-card user-answer-card">
                            <p>{resultData.userAnswer}</p>
                        </Card>
                    </div>

                    <div className="answer-column">
                        <div className="answer-column-header model">
                            <span className="answer-dot"></span>
                            <h2>모범 답안</h2>
                            <em>아카이브 표준</em>
                        </div>

                        <Card className="answer-card model-answer-card">
                            <p>{resultData.modelAnswer}</p>
                        </Card>
                    </div>
                </section>

                <section className="result-detail-section">
                    <div className="result-analysis-area">
                        <h2>왜 이런 점수가 나왔나요?</h2>
                        <p>
                            키워드 통합 및 개념적 깊이에 대한 상세
                            분석입니다.
                        </p>

                        <div className="analysis-list">
                            {resultData.analysisItems.map((item) => (
                                <div
                                    key={item.id}
                                    className={
                                        item.type === "good"
                                            ? "analysis-item good"
                                            : "analysis-item bad"
                                    }
                                >
                                    <span className="analysis-icon">
                                        {item.type === "good" ? (
                                            <Check size={16} strokeWidth={2.4} />
                                        ) : (
                                            <X size={16} strokeWidth={2.4} />
                                        )}
                                    </span>

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <aside className="result-side-actions">
                        <Card className="expert-insight-card">
                            <p className="expert-label">
                                {resultData.expertInsight.label}
                            </p>

                            <span>{resultData.expertInsight.category}</span>

                            <p>{resultData.expertInsight.description}</p>

                            <Button
                                variant="primary"
                                size="medium"
                                className="concept-review-button"
                                onClick={handleReviewConcept}
                            >
                                개념 복습하기
                                <ExternalLink size={14} strokeWidth={2.2} />
                            </Button>
                        </Card>

                        <Button
                            variant="dark"
                            size="large"
                            fullWidth
                            className="next-problem-button"
                            onClick={handleNextProblem}
                        >
                            다음 문제 풀기 (#2)
                        </Button>

                        <Button
                            variant="outline"
                            size="large"
                            fullWidth
                            className="dashboard-return-button"
                            onClick={handleDashboard}
                        >
                            대시보드로 돌아가기
                        </Button>
                    </aside>
                </section>

                <section className="result-bottom-banner">
                    <div className="result-bottom-overlay">
                        <h2>학습의 깊이를 더하세요</h2>

                        <p>
                            온점 기록관은 더 나은 균형 논리 학습을 위해
                            “국부론” 제4장을 정독할 것을 제안합니다.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LearnerResult;