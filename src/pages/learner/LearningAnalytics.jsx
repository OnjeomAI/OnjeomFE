import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { getMockUserByType } from "../../data/mockData";
import { getMockAnalyticsData } from "../../data/mockAnalytics";

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
    const analyticsData = getMockAnalyticsData();
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
