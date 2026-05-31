import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit3, Sparkles } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getReviewArchive } from "../../data/services/reviewService";

function getLinePoints(scores) {
    if (scores.length === 1) {
        const score = scores[0].score;
        const x = 280;
        const y = 220 - 24 - ((220 - 48) * score) / 100;

        return `${x},${y}`;
    }

    const maxScore = 100;
    const width = 560;
    const height = 220;
    const paddingX = 24;
    const paddingY = 24;

    return scores
        .map((item, index) => {
            const x =
                paddingX +
                ((width - paddingX * 2) / (scores.length - 1)) * index;

            const y =
                height -
                paddingY -
                ((height - paddingY * 2) * item.score) / maxScore;

            return `${x},${y}`;
        })
        .join(" ");
}

function LearnerReview() {
    const navigate = useNavigate();
    const [reviewData, setReviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadReview() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const nextReviewData = await getReviewArchive();

                if (ignore) {
                    return;
                }

                setReviewData(nextReviewData);
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(
                        error.message || "복습 데이터를 불러오지 못했습니다."
                    );
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadReview();

        return () => {
            ignore = true;
        };
    }, []);

    if (isLoading) {
        return <div className="learner-review-page">복습 데이터를 불러오는 중입니다.</div>;
    }

    if (errorMessage) {
        return <div className="learner-review-page">{errorMessage}</div>;
    }

    if (!reviewData) {
        return <div className="learner-review-page">복습 데이터를 찾을 수 없습니다.</div>;
    }

    const linePoints = getLinePoints(reviewData.achievement.scores);

    const handleStartNewAttempt = () => {
        navigate("/today");
    };

    return (
        <div className="learner-review-page">
            <PageHeader
                subtitle={reviewData.subtitle}
                title={reviewData.title}
                type="learner"
                showBack={false}
                showBell={true}
                showUser={true}
                userName=""
                userLevel=""
            />

            <Card className="review-hero-card">
                <div className="review-hero-content">
                    <div>
                        <div className="review-hero-meta">
                            <span className="review-hero-badge">
                                {reviewData.archive.badge}
                            </span>

                            <span className="review-hero-code">
                                ||| {reviewData.archive.code}
                            </span>
                        </div>

                        <h2>{reviewData.archive.title}</h2>
                    </div>

                    <div className="review-hero-image"></div>
                </div>
            </Card>

            <section className="review-analysis-grid">
                <Card className="review-chart-card">
                    <div className="review-card-header">
                        <h2>{reviewData.achievement.title}</h2>

                        <div className="review-chart-legend">
                            <span></span>
                            나의 점수
                        </div>
                    </div>

                    <div className="review-chart-wrap">
                        <svg
                            className="review-line-chart"
                            viewBox="0 0 560 220"
                            role="img"
                            aria-label="성취도 변화 곡선"
                        >
                            <line x1="24" y1="52" x2="536" y2="52" />
                            <line x1="24" y1="110" x2="536" y2="110" />
                            <line x1="24" y1="168" x2="536" y2="168" />

                            <polyline points={linePoints} />

                            {reviewData.achievement.scores.map((item, index) => {
                                const points = linePoints.split(" ")[index].split(",");

                                return (
                                    <circle
                                        key={item.id}
                                        cx={points[0]}
                                        cy={points[1]}
                                        r="7"
                                    />
                                );
                            })}
                        </svg>

                        <div className="review-chart-labels">
                            {reviewData.achievement.scores.map((item) => (
                                <span key={item.id}>{item.label}</span>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="review-insight-card">
                    <Sparkles size={28} strokeWidth={2.2} />

                    <h2>{reviewData.insight.title}</h2>

                    <p>{reviewData.insight.description}</p>

                    <div className="review-insight-divider"></div>

                    <strong>핵심 통찰</strong>
                    <span>{reviewData.insight.detail}</span>
                </Card>
            </section>

            <section className="review-submission-section">
                <h2>제출 기록 아카이브</h2>

                <div className="review-submission-list">
                    {reviewData.submissions.map((submission) => (
                        <Card
                            key={submission.id}
                            className={
                                submission.current
                                    ? "review-submission-card current"
                                    : "review-submission-card"
                            }
                        >
                            <div className="review-submission-score">
                                <span>점수</span>
                                <strong>{submission.score}</strong>
                            </div>

                            <div className="review-submission-content">
                                <h3>{submission.title}</h3>
                                <p>{submission.date}</p>
                                <span>"{submission.text}"</span>
                            </div>

                            <button
                                type="button"
                                className="review-submission-more"
                                aria-label={`${submission.title} 상세 보기`}
                            >
                                <ChevronRight size={24} strokeWidth={2.2} />
                            </button>
                        </Card>
                    ))}
                </div>
            </section>

            <div className="review-action-area">
                <Button
                    variant="primary"
                    size="large"
                    className="review-new-attempt-button"
                    onClick={handleStartNewAttempt}
                >
                    새로운 시도 시작하기
                    <Edit3 size={18} strokeWidth={2.2} />
                </Button>
            </div>

            <footer className="review-footer">
                학습 로그 종료 · 온점 디지털 아카이브
            </footer>
        </div>
    );
}

export default LearnerReview;
