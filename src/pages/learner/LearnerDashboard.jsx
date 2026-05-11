import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getMockUserByType } from "../../data/mockData";

const dashboardPrototypeData = {
    todaySummary: {
        completedCount: 7,
        studyMinutes: 32,
        studyTimeChangeRate: 12,
        averageScore: 74,
        scoreTrendLabel: "안정적인 추세",
    },

    abilityStats: [
        {
            key: "vocabulary",
            label: "어휘력",
            current: 78,
            previous: 72,
        },
        {
            key: "reading",
            label: "독해력",
            current: 82,
            previous: 76,
        },
        {
            key: "speaking",
            label: "말하기",
            current: 70,
            previous: 68,
        },
        {
            key: "listening",
            label: "듣기",
            current: 86,
            previous: 80,
        },
        {
            key: "grammar",
            label: "문법",
            current: 74,
            previous: 71,
        },
    ],

    weaknessItems: [
        {
            key: "inferential-reading",
            label: "추론적 독해",
            percent: 42,
        },
        {
            key: "context-understanding",
            label: "문맥 파악",
            percent: 58,
        },
    ],

    aiRecommendation: {
        title: "AI 맞춤 추천",
        description:
            "추론적 독해 연습에 집중하세요. 복합적인 한국어 서사 지문에서 직역으로 인한 오류 패턴이 관찰됩니다.",
    },

    reviewSummary: {
        title: "복습이 필요한 3개의 항목",
        description:
            "기억 보유량이 62% 수준입니다. 장기 기억 전환을 위해 지금 확인하세요.",
        retentionRate: 62,
        reviewCount: 3,
    },

    recentRecords: [
        {
            id: "record-001",
            title: "고전 문학: 이상의 '날개' 분석",
            completedAt: "2026.05.10",
            score: 88,
            scoreType: "good",
        },
        {
            id: "record-002",
            title: "사설: AI 큐레이션의 윤리적 쟁점",
            completedAt: "2026.05.09",
            score: 54,
            scoreType: "bad",
        },
        {
            id: "record-003",
            title: "문법: 상황에 따른 높임 표현의 활용",
            completedAt: "2026.05.08",
            score: 72,
            scoreType: "normal",
        },
    ],
};

function getRadarPointString(items, valueKey = "current") {
    const centerX = 210;
    const centerY = 210;
    const maxRadius = 155;
    const angleOffset = -90;

    return items
        .map((item, index) => {
            const angle =
                ((Math.PI * 2) / items.length) * index +
                (angleOffset * Math.PI) / 180;

            const value = item[valueKey] ?? 0;
            const radius = maxRadius * (value / 100);

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return `${x},${y}`;
        })
        .join(" ");
}

function getRadarGridPointString(itemCount, radius) {
    const centerX = 210;
    const centerY = 210;
    const angleOffset = -90;

    return Array.from({ length: itemCount })
        .map((_, index) => {
            const angle =
                ((Math.PI * 2) / itemCount) * index +
                (angleOffset * Math.PI) / 180;

            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);

            return `${x},${y}`;
        })
        .join(" ");
}

function LearnerDashboard() {
    const navigate = useNavigate();

    const learner = getMockUserByType("learner");
    const dashboard = dashboardPrototypeData;

    const dailyGoal = learner.dailyGoal || 10;
    const todaySummary = dashboard.todaySummary;
    const abilityItems = dashboard.abilityStats;
    const weaknessItems = dashboard.weaknessItems;
    const aiRecommendation = dashboard.aiRecommendation;
    const reviewSummary = dashboard.reviewSummary;
    const recentRecords = dashboard.recentRecords;

    const completedCount = todaySummary.completedCount;
    const goalRate = Math.min(
        100,
        Math.round((completedCount / dailyGoal) * 100)
    );

    const currentRadarPoints = getRadarPointString(abilityItems, "current");
    const previousRadarPoints = getRadarPointString(abilityItems, "previous");

    const handleStartStudy = () => {
        navigate("/today");
    };

    const handleReview = () => {
        navigate("/review");
    };

    const handleViewHistory = () => {
        navigate("/history");
    };

    return (
        <div className="learner-dashboard-page">
            <PageHeader
                title="학습 현황 개요"
                type="learner"
                showBack={false}
                userName={learner.displayName}
                userLevel={learner.levelLabel}
                showBell={true}
                showUser={true}
            />

            <section className="dashboard-summary-grid">
                <Card className="dashboard-summary-card">
                    <div className="summary-card-content">
                        <div>
                            <p className="summary-label">목표 달성률</p>

                            <div className="summary-main-value">
                                <strong>{completedCount}</strong>
                                <span>/ {dailyGoal}</span>
                            </div>

                            <p className="summary-sub-text gold">
                                완료한 문항 수
                            </p>
                        </div>

                        <div
                            className="summary-ring"
                            style={{
                                background: `conic-gradient(#806600 ${goalRate}%, #dedad0 ${goalRate}% 100%)`,
                            }}
                            aria-label={`목표 달성률 ${goalRate}%`}
                        >
                            <div className="summary-ring-inner"></div>
                        </div>
                    </div>
                </Card>

                <Card className="dashboard-summary-card">
                    <div className="summary-card-content">
                        <div>
                            <p className="summary-label">학습 시간</p>

                            <div className="summary-main-value">
                                <strong>{todaySummary.studyMinutes}</strong>
                                <span>분</span>
                            </div>

                            <p className="summary-sub-text gold">
                                어제 대비 +{todaySummary.studyTimeChangeRate}%
                            </p>
                        </div>

                        <div className="summary-icon-circle">◔</div>
                    </div>
                </Card>

                <Card className="dashboard-summary-card">
                    <div className="summary-card-content">
                        <div>
                            <p className="summary-label">평균 점수</p>

                            <div className="summary-main-value">
                                <strong>{todaySummary.averageScore}</strong>
                                <span>점</span>
                            </div>

                            <p className="summary-sub-text">
                                {todaySummary.scoreTrendLabel}
                            </p>
                        </div>

                        <div className="summary-chart-icon">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </Card>
            </section>

            <section className="dashboard-main-grid">
                <Card className="dashboard-ability-card">
                    <div className="dashboard-section-header">
                        <div>
                            <h2>영역별 숙련도</h2>
                            <p>지난주 대비 현재 핵심 역량 분포</p>
                        </div>

                        <div className="ability-legend">
                            <span className="current"></span>
                            현재
                            <span className="previous"></span>
                            이전
                        </div>
                    </div>

                    <div className="ability-radar-wrap">
                        <svg
                            className="ability-radar"
                            viewBox="0 0 420 420"
                            role="img"
                            aria-label="영역별 숙련도 그래프"
                        >
                            <polygon
                                className="ability-radar-grid"
                                points={getRadarGridPointString(
                                    abilityItems.length,
                                    155
                                )}
                            />

                            <polygon
                                className="ability-radar-grid"
                                points={getRadarGridPointString(
                                    abilityItems.length,
                                    110
                                )}
                            />

                            <polygon
                                className="ability-radar-grid"
                                points={getRadarGridPointString(
                                    abilityItems.length,
                                    65
                                )}
                            />

                            {abilityItems.map((item, index) => {
                                const centerX = 210;
                                const centerY = 210;
                                const radius = 155;
                                const angle =
                                    ((Math.PI * 2) / abilityItems.length) *
                                    index -
                                    Math.PI / 2;

                                const x = centerX + radius * Math.cos(angle);
                                const y = centerY + radius * Math.sin(angle);

                                return (
                                    <line
                                        key={item.key}
                                        x1={centerX}
                                        y1={centerY}
                                        x2={x}
                                        y2={y}
                                    />
                                );
                            })}

                            <polygon
                                className="ability-radar-previous"
                                points={previousRadarPoints}
                            />

                            <polygon
                                className="ability-radar-value"
                                points={currentRadarPoints}
                            />
                        </svg>

                        <span className="ability-label ability-top">
                            {abilityItems[0]?.label} △
                        </span>

                        <span className="ability-label ability-right">
                            {abilityItems[4]?.label}
                        </span>

                        <span className="ability-label ability-bottom-right">
                            {abilityItems[3]?.label}
                        </span>

                        <span className="ability-label ability-bottom-left">
                            {abilityItems[2]?.label}
                        </span>

                        <span className="ability-label ability-left">
                            {abilityItems[1]?.label} △
                        </span>
                    </div>
                </Card>

                <div className="dashboard-side-column">
                    <Card className="dashboard-weakness-card">
                        <h2>취약점 분석</h2>

                        <div className="weakness-list">
                            {weaknessItems.map((item) => (
                                <div
                                    className="weakness-item"
                                    key={item.key}
                                >
                                    <div className="weakness-title-row">
                                        <span>{item.label}</span>
                                        <strong>{item.percent}%</strong>
                                    </div>

                                    <div className="weakness-track">
                                        <div
                                            className="weakness-fill"
                                            style={{
                                                width: `${item.percent}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="ai-recommend-box">
                            <span>✦</span>

                            <div>
                                <h3>{aiRecommendation.title}</h3>
                                <p>{aiRecommendation.description}</p>
                            </div>
                        </div>
                    </Card>

                    <Card className="dashboard-review-card">
                        <span className="review-card-icon">↻</span>

                        <p className="review-card-label">
                            에빙하우스 망각곡선 알림
                        </p>

                        <h2>{reviewSummary.title}</h2>

                        <p>{reviewSummary.description}</p>

                        <Button
                            variant="primary"
                            size="medium"
                            className="review-start-button"
                            onClick={handleStartStudy}
                        >
                            지금 풀기
                        </Button>
                    </Card>
                </div>
            </section>

            <Card className="dashboard-record-card">
                <div className="record-card-header">
                    <h2>최근 학습 기록</h2>

                    <button type="button" onClick={handleViewHistory}>
                        전체 보기
                    </button>
                </div>

                <table className="record-table">
                    <thead>
                    <tr>
                        <th>학습 문항</th>
                        <th>완료일</th>
                        <th>점수</th>
                        <th>관리</th>
                    </tr>
                    </thead>

                    <tbody>
                    {recentRecords.map((record) => (
                        <tr key={record.id}>
                            <td>{record.title}</td>
                            <td>{record.completedAt}</td>
                            <td>
                                    <span
                                        className={`record-score ${record.scoreType}`}
                                    >
                                        {record.score} 점
                                    </span>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="record-retry-button"
                                    onClick={handleStartStudy}
                                >
                                    다시 풀기 ↻
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
}

export default LearnerDashboard;