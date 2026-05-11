import { useNavigate } from "react-router-dom";
import { ChevronRight, Edit3, Sparkles } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const reviewData = {
    subtitle: "성취도 분석",
    title: "답변 변화 추적",

    archive: {
        badge: "비판적 읽기",
        code: "ARCH-402",
        title: "19세기 영국 산업 자동화의 사회경제적 영향에 대하여",
    },

    achievement: {
        title: "성취도 변화 곡선",
        scores: [
            {
                id: "attempt-001",
                label: "1회차",
                score: 45,
            },
            {
                id: "attempt-002",
                label: "2회차",
                score: 62,
            },
            {
                id: "attempt-003",
                label: "3회차",
                score: 77,
            },
            {
                id: "attempt-004",
                label: "최근",
                score: 92,
            },
        ],
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
            score: 92,
            title: "현재 제출분",
            date: "2026년 10월 24일 · 14:20 PM",
            text: "기술 발전과 노동력 대체의 상호 작용은 미묘한 관점을 시사하며...",
            current: true,
        },
        {
            id: "submit-003",
            score: 77,
            title: "3회차 제출",
            date: "2026년 10월 20일 · 11:45 AM",
            text: "영국의 산업 자동화는 노동 시장의 급격한 변화를 가져왔으며...",
            current: false,
        },
        {
            id: "submit-002",
            score: 62,
            title: "2회차 제출",
            date: "2026년 10월 15일 · 09:12 AM",
            text: "당시 숙련된 장인들에게 있어 가장 큰 영향은 일자리의 상실이었습니다...",
            current: false,
        },
        {
            id: "submit-001",
            score: 45,
            title: "1회차 제출",
            date: "2026년 10월 12일 · 16:30 PM",
            text: "본문은 19세기에 기계가 어떻게 모든 것을 바꾸었는지 설명합니다.",
            current: false,
        },
    ],
};

function getLinePoints(scores) {
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
                                const points = linePoints
                                    .split(" ")
                                    [index].split(",");

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