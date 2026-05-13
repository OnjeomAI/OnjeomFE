import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { getMockUserByType } from "../../data/mockData";

const analyticsData = {
    periodTabs: ["일간", "주간", "월간"],

    summaryCards: [
        {
            id: "total",
            label: "누적 풀이 문항 수",
            value: "1,284",
            suffix: "",
            subText: "↗ +12%",
            accent: true,
        },
        {
            id: "time",
            label: "총 학습 시간",
            value: "142h",
            suffix: "30m",
            subText: "◷",
            accent: false,
        },
        {
            id: "accuracy",
            label: "평균 정답률",
            value: "88.5",
            suffix: "%",
            subText: "",
            accent: false,
        },
        {
            id: "weekly",
            label: "이번 주 풀이 수",
            value: "42",
            suffix: "",
            subText: "목표: 50",
            accent: false,
        },
    ],

    scoreTrend: [
        { day: "월", score: 62 },
        { day: "화", score: 70 },
        { day: "수", score: 67 },
        { day: "목", score: 78 },
        { day: "금", score: 75 },
        { day: "토", score: 86 },
        { day: "일", score: 83 },
    ],

    studyMinutes: [
        { day: "월", minutes: 28 },
        { day: "화", minutes: 46 },
        { day: "수", minutes: 21 },
        { day: "목", minutes: 64 },
        { day: "금", minutes: 54 },
        { day: "토", minutes: 38 },
        { day: "일", minutes: 59 },
    ],

    abilityStats: [
        {
            id: "ability-001",
            title: "사실적 이해",
            level: "심화 (DEEP)",
            score: 94,
            change: 12,
            changeType: "up",
            expanded: false,
        },
        {
            id: "ability-002",
            title: "추론적 사고",
            level: "고급 (ADVANCED)",
            score: 78,
            change: 3,
            changeType: "down",
            expanded: false,
        },
        {
            id: "ability-003",
            title: "비판적 평가",
            level: "중급 (INTERMEDIATE)",
            score: 62,
            change: 8,
            changeType: "up",
            expanded: true,
            recentHistory: [
                {
                    title: "흄의 철학적 논증 분석",
                    date: "2023년 10월 24일",
                    score: 85,
                    scoreType: "good",
                },
                {
                    title: "인플레이션의 경제 모델링",
                    date: "2023년 10월 22일",
                    score: 45,
                    scoreType: "bad",
                },
                {
                    title: "비교 문학: 제임스 조이스",
                    date: "2023년 10월 20일",
                    score: 72,
                    scoreType: "normal",
                },
            ],
        },
        {
            id: "ability-004",
            title: "맥락적 통합",
            level: "초급 (BEGINNER)",
            score: 34,
            change: 5,
            changeType: "up",
            expanded: false,
        },
        {
            id: "ability-005",
            title: "어휘 구사력",
            level: "심화 (DEEP)",
            score: 98,
            change: null,
            changeType: "none",
            expanded: false,
        },
    ],
};

function getScoreLinePoints(items) {
    const width = 420;
    const height = 230;
    const paddingX = 24;
    const paddingY = 30;

    return items
        .map((item, index) => {
            const x =
                paddingX +
                ((width - paddingX * 2) / (items.length - 1)) * index;

            const y =
                height -
                paddingY -
                ((height - paddingY * 2) * item.score) / 100;

            return `${x},${y}`;
        })
        .join(" ");
}

function LearningAnalytics() {
    const user = getMockUserByType("learner");
    const scoreLinePoints = getScoreLinePoints(analyticsData.scoreTrend);

    return (
        <div className="learning-analytics-page">
            <PageHeader
                title="학습 분석 보고서"
                type="learner"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
                showBell={true}
                showUser={true}
                status={
                    <span className="analytics-period-tabs">
                        {analyticsData.periodTabs.map((tab, index) => (
                            <button
                                key={tab}
                                type="button"
                                className={
                                    index === 0
                                        ? "analytics-period-tab active"
                                        : "analytics-period-tab"
                                }
                            >
                                {tab}
                            </button>
                        ))}
                    </span>
                }
            />

            <section className="analytics-summary-grid">
                {analyticsData.summaryCards.map((card) => (
                    <Card
                        key={card.id}
                        className={
                            card.accent
                                ? "analytics-summary-card accent"
                                : "analytics-summary-card"
                        }
                    >
                        <p>{card.label}</p>

                        <div className="analytics-summary-value-row">
                            <strong>{card.value}</strong>

                            {card.suffix && <span>{card.suffix}</span>}

                            {card.subText && (
                                <em
                                    className={
                                        card.id === "total"
                                            ? "positive"
                                            : ""
                                    }
                                >
                                    {card.subText}
                                </em>
                            )}
                        </div>

                        {card.id === "accuracy" && (
                            <div className="analytics-small-line"></div>
                        )}
                    </Card>
                ))}
            </section>

            <section className="analytics-chart-grid">
                <Card className="analytics-chart-card">
                    <div className="analytics-card-header">
                        <h2>일별 평균 점수 추이</h2>
                        <button type="button">•••</button>
                    </div>

                    <div className="analytics-line-chart-wrap">
                        <svg
                            className="analytics-line-chart"
                            viewBox="0 0 420 230"
                            role="img"
                            aria-label="일별 평균 점수 추이"
                        >
                            <line x1="24" y1="62" x2="396" y2="62" />
                            <line x1="24" y1="120" x2="396" y2="120" />
                            <line x1="24" y1="178" x2="396" y2="178" />

                            <polyline points={scoreLinePoints} />

                            {scoreLinePoints.split(" ").map((point, index) => {
                                const [x, y] = point.split(",");

                                return (
                                    <circle
                                        key={analyticsData.scoreTrend[index].day}
                                        cx={x}
                                        cy={y}
                                        r="5"
                                    />
                                );
                            })}
                        </svg>

                        <div className="analytics-chart-labels">
                            {analyticsData.scoreTrend.map((item) => (
                                <span key={item.day}>{item.day}</span>
                            ))}
                        </div>
                    </div>
                </Card>

                <Card className="analytics-chart-card">
                    <div className="analytics-card-header">
                        <h2>일일 학습 시간</h2>

                        <div className="analytics-chart-legend">
                            <span></span>
                            분 (Minutes)
                        </div>
                    </div>

                    <div className="analytics-bar-chart">
                        {analyticsData.studyMinutes.map((item, index) => (
                            <div className="analytics-bar-item" key={item.day}>
                                <div
                                    className={
                                        index === 3
                                            ? "analytics-bar active"
                                            : "analytics-bar"
                                    }
                                    style={{ height: `${item.minutes * 2.3}px` }}
                                ></div>
                                <span>{item.day}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>

            <section className="analytics-ability-section">
                <div className="analytics-section-title-row">
                    <h2>영역별 숙련도</h2>
                    <span>기록 분석 평가</span>
                </div>

                <div className="analytics-ability-list">
                    {analyticsData.abilityStats.map((ability) => (
                        <Card
                            key={ability.id}
                            className={
                                ability.expanded
                                    ? "analytics-ability-card expanded"
                                    : "analytics-ability-card"
                            }
                        >
                            <div className="analytics-ability-main-row">
                                <div className="analytics-ability-title">
                                    <h3>{ability.title}</h3>
                                    <span>{ability.level}</span>
                                </div>

                                <div className="analytics-ability-score">
                                    <strong>{ability.score}</strong>
                                    <span>/ 100</span>

                                    {ability.change !== null && (
                                        <em
                                            className={
                                                ability.changeType === "down"
                                                    ? "down"
                                                    : "up"
                                            }
                                        >
                                            {ability.changeType === "down"
                                                ? "▼"
                                                : "▲"}{" "}
                                            {ability.change}
                                        </em>
                                    )}

                                    {ability.change === null && <em>—</em>}

                                    <button type="button">
                                        {ability.expanded ? "⌃" : "⌄"}
                                    </button>
                                </div>
                            </div>

                            <div className="analytics-progress-track">
                                <div
                                    className="analytics-progress-fill"
                                    style={{ width: `${ability.score}%` }}
                                ></div>
                            </div>

                            {ability.expanded && (
                                <div className="analytics-recent-box">
                                    <p>최근 풀이 내역</p>

                                    {ability.recentHistory.map((history) => (
                                        <div
                                            key={history.title}
                                            className="analytics-history-row"
                                        >
                                            <span>{history.title}</span>

                                            <div>
                                                <em>{history.date}</em>
                                                <strong
                                                    className={
                                                        history.scoreType
                                                    }
                                                >
                                                    {history.score} 점
                                                </strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            <footer className="analytics-footer">
                <div className="analytics-footer-left">
                    <div className="analytics-footer-icon"></div>
                    <span>큐레이션 ID : ON-29402-KR</span>
                </div>

                <span>© 2024 온점 디지털 아카이브</span>
            </footer>
        </div>
    );
}

export default LearningAnalytics;