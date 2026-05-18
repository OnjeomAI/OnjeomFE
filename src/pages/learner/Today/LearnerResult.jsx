import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    CircleUserRound,
    Check,
    ExternalLink,
    X,
    Zap,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import { startMockTodayStudy } from "../../../data/mockData";
import { getMockStudyResult } from "../../../data/mockStudyResult";

function LearnerResult() {
    const navigate = useNavigate();
    const resultData = getMockStudyResult();

    const handleBack = () => {
        navigate("/today");
    };

    const handleNextProblem = () => {
        startMockTodayStudy();
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
