import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Bell,
    CircleUserRound,
    ExternalLink,
    Hash,
    MessageSquareText,
    Tags,
    Timer,
} from "lucide-react";

import Card from "../../../components/common/Card";
import Button from "../../../components/common/Button";
import {
    getLatestResponseContext,
    getResponseById,
} from "../../../data/services/responseService";

function getScoreLabel(score) {
    if (score >= 85) {
        return "우수";
    }

    if (score >= 70) {
        return "양호";
    }

    if (score >= 50) {
        return "보통";
    }

    return "보완 필요";
}

function formatDateLabel(value) {
    if (!value) {
        return "-";
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(value));
}

function isGradingFallbackMessage(value) {
    const text = String(value || "").toLowerCase();

    return (
        text.includes("채점 서버") ||
        text.includes("서버 연결 실패") ||
        text.includes("server") ||
        text.includes("failed")
    );
}

function buildFallbackFeedback(responseData) {
    const score = Number(responseData?.finalScore ?? 0);
    const answerLength = String(responseData?.answerText || "").trim().length;

    if (score >= 80) {
        return "핵심 내용을 안정적으로 반영한 답안입니다. 근거 문장을 함께 제시하면 더 완성도 높은 답안이 됩니다.";
    }

    if (score >= 60) {
        return "답안이 정상 제출되었습니다. 다만 현재 AI 상세 피드백을 불러오지 못해 기본 분석만 표시합니다.";
    }

    if (answerLength < 80) {
        return "답안 분량이 짧아 핵심 근거와 설명이 충분히 드러나지 않았을 수 있습니다. 지문 근거를 포함해 다시 정리해 보세요.";
    }

    return "답안이 정상 제출되었습니다. 주장, 근거, 결론의 연결이 분명한지 다시 점검해 보세요.";
}

function buildFallbackScoringBasis(responseData) {
    const score = Number(responseData?.finalScore ?? 0);
    const rawScore = Number(responseData?.rawScore ?? score);
    const answerLength = String(responseData?.answerText || "").trim().length;

    return `기본 채점 결과 ${score}점, 원점수 ${rawScore}점, 답안 ${answerLength}자 기준으로 표시했습니다.`;
}

function LearnerResult() {
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const [aiGrading, setAiGrading] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadResult() {
            const latestContext = getLatestResponseContext();

            if (!latestContext?.responseId) {
                navigate("/today", { replace: true });
                return;
            }

            setAiGrading(latestContext.aiGrading || null);

            try {
                const nextResponseData = await getResponseById(
                    latestContext.responseId
                );

                if (ignore) {
                    return;
                }

                setResponseData(nextResponseData);
            } catch (loadError) {
                if (!ignore) {
                    setError(loadError.message);
                }
            }
        }

        loadResult();

        return () => {
            ignore = true;
        };
    }, [navigate]);

    const foundKeywords = useMemo(() => {
        if (Array.isArray(aiGrading?.matchedKeywords)) {
            return aiGrading.matchedKeywords;
        }

        return Array.isArray(responseData?.foundKeywords)
            ? responseData.foundKeywords
            : [];
    }, [aiGrading, responseData]);
    const displayedFinalScore = aiGrading?.finalScore ?? responseData?.finalScore ?? 0;
    const displayedRawScore = aiGrading?.rawScore ?? responseData?.rawScore ?? 0;
    const feedbackText = useMemo(() => {
        if (!responseData && !aiGrading) {
            return "";
        }

        if (aiGrading?.feedback) {
            return aiGrading.feedback;
        }

        if (isGradingFallbackMessage(responseData?.feedbackText)) {
            return buildFallbackFeedback(responseData);
        }

        return responseData?.feedbackText || buildFallbackFeedback(responseData);
    }, [aiGrading, responseData]);
    const scoringBasis = useMemo(() => {
        if (!responseData && !aiGrading) {
            return "";
        }

        if (aiGrading?.feedbackType) {
            return `AI 직접 채점 결과: ${aiGrading.feedbackType}`;
        }

        if (isGradingFallbackMessage(responseData?.scoringBasis)) {
            return buildFallbackScoringBasis(responseData);
        }

        return responseData?.scoringBasis || buildFallbackScoringBasis(responseData);
    }, [aiGrading, responseData]);

    const handleBack = () => {
        navigate("/today");
    };

    const handleNextProblem = async () => {
        navigate("/today");
    };

    const handleDashboard = () => {
        navigate("/dashboard");
    };

    const handleReviewConcept = () => {
        navigate("/review");
    };

    if (error) {
        return <div className="learner-result-page">{error}</div>;
    }

    if (!responseData) {
        return <div className="learner-result-page"></div>;
    }

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

                    <h1>응답 결과 조회</h1>
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
                        <p className="result-score-label">최종 점수</p>

                        <div className="result-score-row">
                            <strong>{displayedFinalScore}</strong>
                            <span>/100</span>

                            <em>{getScoreLabel(displayedFinalScore)}</em>
                        </div>

                        <p className="result-grading-time">
                            <Timer size={14} strokeWidth={2.2} />
                            제출 시각 {formatDateLabel(responseData.createdAt)}
                        </p>
                    </div>

                    <div className="result-point-summary">
                        <span>채점 정보</span>

                        <div>
                            <strong>원점수 {displayedRawScore}</strong>
                            <strong className="weak">
                                시도 {responseData.attemptNumber ?? 1}회
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="result-answer-compare single">
                    <div className="answer-column">
                        <div className="answer-column-header">
                            <span className="answer-dot"></span>
                            <h2>제출 답안</h2>
                        </div>

                        <Card className="answer-card user-answer-card">
                            <p>{responseData.answerText}</p>
                        </Card>
                    </div>
                </section>

                <section className="result-detail-section">
                    <div className="result-analysis-area">
                        <h2>응답 분석 정보</h2>
                        <p>Response API가 제공하는 채점 결과와 피드백입니다.</p>

                        <div className="analysis-list">
                            <div className="analysis-item good">
                                <span className="analysis-icon">
                                    <Hash size={16} strokeWidth={2.4} />
                                </span>

                                <div>
                                    <h3>응답 ID</h3>
                                    <p>{responseData.id}</p>
                                </div>
                            </div>

                            <div className="analysis-item good">
                                <span className="analysis-icon">
                                    <MessageSquareText
                                        size={16}
                                        strokeWidth={2.4}
                                    />
                                </span>

                                <div>
                                    <h3>피드백</h3>
                                    <p>{feedbackText}</p>
                                </div>
                            </div>

                            <div className="analysis-item good">
                                <span className="analysis-icon">
                                    <Tags size={16} strokeWidth={2.4} />
                                </span>

                                <div>
                                    <h3>채점 기준</h3>
                                    <p>{scoringBasis}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="result-side-actions">
                        <Card className="expert-insight-card">
                            <p className="expert-label">핵심 키워드</p>

                            <span>{foundKeywords.length}개 추출</span>

                            <p>
                                {foundKeywords.length > 0
                                    ? foundKeywords.join(", ")
                                    : "추출된 키워드가 없습니다."}
                            </p>

                            <Button
                                variant="primary"
                                size="medium"
                                className="concept-review-button"
                                onClick={handleReviewConcept}
                            >
                                응답 이력 보기
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
                            다음 문제 풀기
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
                        <h2>답안 기록이 저장되었습니다</h2>

                        <p>
                            같은 문제의 이전 응답과 점수 변화를 리뷰 화면에서
                            비교할 수 있습니다.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LearnerResult;
