import { useEffect, useState } from "react";
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
import { getProblemDetail } from "../../../data/services/problemService";
import { getHighlights } from "../../../api/highlightApi";

const highlightClassByColor = {
    YELLOW: "yellow",
    GREEN: "green",
    BLUE: "blue",
    PINK: "pink",
};

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

function getHighlightSegments(text, highlights) {
    if (!text) {
        return [];
    }

    const normalizedHighlights = (Array.isArray(highlights) ? highlights : [])
        .map((highlight) => ({
            startOffset: Number(highlight.startOffset),
            endOffset: Number(highlight.endOffset),
            color: highlight.color,
        }))
        .filter(
            (highlight) =>
                Number.isInteger(highlight.startOffset) &&
                Number.isInteger(highlight.endOffset) &&
                highlight.startOffset >= 0 &&
                highlight.endOffset > highlight.startOffset &&
                highlight.startOffset < text.length
        )
        .sort((left, right) => left.startOffset - right.startOffset);

    if (normalizedHighlights.length === 0) {
        return [{ text, highlighted: false }];
    }

    const segments = [];
    let cursor = 0;

    normalizedHighlights.forEach((highlight) => {
        const startOffset = Math.max(cursor, highlight.startOffset);
        const endOffset = Math.min(text.length, highlight.endOffset);

        if (endOffset <= startOffset) {
            return;
        }

        if (cursor < startOffset) {
            segments.push({
                text: text.slice(cursor, startOffset),
                highlighted: false,
            });
        }

        segments.push({
            text: text.slice(startOffset, endOffset),
            highlighted: true,
            color: highlight.color,
        });

        cursor = endOffset;
    });

    if (cursor < text.length) {
        segments.push({
            text: text.slice(cursor),
            highlighted: false,
        });
    }

    return segments;
}

function renderHighlightedText(text, highlights) {
    return getHighlightSegments(text, highlights).map((segment, index) => {
        if (!segment.highlighted) {
            return segment.text;
        }

        const colorClass = highlightClassByColor[segment.color] || "yellow";

        return (
            <span
                key={`${segment.color}-${index}`}
                className={`result-passage-highlight ${colorClass}`}
            >
                {segment.text}
            </span>
        );
    });
}

function LearnerResult() {
    const navigate = useNavigate();
    const [responseData, setResponseData] = useState(null);
    const [problemData, setProblemData] = useState(null);
    const [highlights, setHighlights] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadResult() {
            const latestContext = getLatestResponseContext();

            if (!latestContext?.responseId) {
                navigate("/today", { replace: true });
                return;
            }

            try {
                const nextResponseData = await getResponseById(
                    latestContext.responseId
                );
                const problemId =
                    nextResponseData?.problemId ?? latestContext.problemId;
                const [nextProblemData, nextHighlightsResult] = problemId
                    ? await Promise.all([
                          getProblemDetail(problemId).catch(() => null),
                          getHighlights(problemId).catch(() => ({ data: [] })),
                      ])
                    : [null, { data: [] }];

                if (ignore) {
                    return;
                }

                setResponseData(nextResponseData);
                setProblemData(nextProblemData);
                setHighlights(
                    Array.isArray(nextHighlightsResult?.data)
                        ? nextHighlightsResult.data
                        : []
                );
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

    const foundKeywords = Array.isArray(responseData?.foundKeywords)
        ? responseData.foundKeywords
        : [];
    const displayedFinalScore = responseData?.finalScore ?? 0;
    const displayedRawScore = responseData?.rawScore ?? 0;
    const feedbackText = responseData?.feedbackText || "피드백 없음";
    const scoringBasis = responseData?.scoringBasis || "-";
    const passageText = problemData?.passageText || "";

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

                {passageText ? (
                    <section className="result-highlight-section">
                        <div className="answer-column-header">
                            <span className="answer-dot"></span>
                            <h2>지문 하이라이트</h2>
                            <em>{highlights.length}개 저장됨</em>
                        </div>

                        <Card className="result-passage-card">
                            <p>{renderHighlightedText(passageText, highlights)}</p>
                        </Card>
                    </section>
                ) : null}

                <section className="result-detail-section">
                    <div className="result-analysis-area">
                        <h2>응답 분석 정보</h2>

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
                            <p className="expert-label">답안 키워드</p>

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
                            다음 문제 대기
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
                            같은 문제의 이전 응답과 점수 변화는 리뷰 화면에서 비교할 수
                            있습니다.
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default LearnerResult;
