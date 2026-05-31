import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { getUserByType } from "../../data/services/learnerService";
import { getLearningAnalytics } from "../../data/services/analyticsService";
import { formatDotDate } from "../../data/selectors/dateSelectors";

function mapReadingTypeLabel(type) {
    const labels = {
        FACTUAL: "사실 이해",
        INFERENTIAL: "추론 이해",
        CRITICAL: "비판 이해",
        CREATIVE: "창의 이해",
    };

    return labels[type] || type || "-";
}

function LearningAnalytics() {
    const [user, setUser] = useState(null);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function loadAnalytics() {
            setIsLoading(true);
            try {
                const [nextUser, nextAnalyticsData] = await Promise.all([
                    getUserByType("learner"),
                    getLearningAnalytics(),
                ]);

                if (ignore) {
                    return;
                }

                setUser(nextUser);
                setAnalyticsData(nextAnalyticsData);
            } catch (loadError) {
                if (!ignore) {
                    setError(loadError.message);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadAnalytics();

        return () => {
            ignore = true;
        };
    }, []);

    const summaryCards = useMemo(() => {
        if (!analyticsData) {
            return [];
        }

        const recentResponses = analyticsData.recentResponses || [];
        const averageScore =
            recentResponses.length > 0
                ? (
                      recentResponses.reduce(
                          (sum, item) => sum + (item.finalScore || 0),
                          0
                      ) / recentResponses.length
                  ).toFixed(1)
                : "0.0";

        return [
            {
                id: "responses",
                label: "최근 응답 수",
                value: recentResponses.length,
                suffix: "건",
            },
            {
                id: "average",
                label: "최근 평균 점수",
                value: averageScore,
                suffix: "점",
            },
            {
                id: "adjustment",
                label: "커리큘럼 재조정",
                value: analyticsData.adjustmentResult?.needsAdjustment
                    ? "필요"
                    : "안정",
                suffix: "",
            },
            {
                id: "priority",
                label: "우선 보완 역량",
                value: mapReadingTypeLabel(
                    analyticsData.weaknessReportResult?.priorityCompetency
                ),
                suffix: "",
            },
        ];
    }, [analyticsData]);

    if (error) {
        return <div className="learning-analytics-page">{error}</div>;
    }

    if (isLoading) {
        return <div className="learning-analytics-page">학습 분석 정보를 불러오는 중입니다.</div>;
    }

    if (!user || !analyticsData) {
        return <div className="learning-analytics-page">학습 분석 정보를 찾을 수 없습니다.</div>;
    }

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
            />

            <section className="analytics-summary-grid">
                {summaryCards.map((card) => (
                    <Card
                        key={card.id}
                        className={
                            card.id === "adjustment"
                                ? "analytics-summary-card accent"
                                : "analytics-summary-card"
                        }
                    >
                        <p>{card.label}</p>

                        <div className="analytics-summary-value-row">
                            <strong>{card.value}</strong>
                            {card.suffix ? <span>{card.suffix}</span> : null}
                        </div>
                    </Card>
                ))}
            </section>

            <section className="analytics-writing-grid">
                <Card className="analytics-writing-card">
                    <div className="analytics-card-header">
                        <h2>답변 비교</h2>
                    </div>

                    {analyticsData.compareResult ? (
                        <div className="analytics-writing-body">
                            <div className="analytics-writing-metric">
                                <span>점수 차이</span>
                                <strong>
                                    {analyticsData.compareResult.scoreDiff}
                                </strong>
                            </div>

                            <div className="analytics-writing-metric">
                                <span>성장 여부</span>
                                <strong>
                                    {analyticsData.compareResult.isImproved
                                        ? "향상"
                                        : "유지/하락"}
                                </strong>
                            </div>

                            <p className="analytics-writing-message">
                                {analyticsData.compareResult.growthMessage}
                            </p>

                            <div className="analytics-tag-row">
                                {(analyticsData.compareResult
                                    .newlyIncludedKeywords || []
                                ).map((keyword) => (
                                    <span key={keyword} className="analytics-tag">
                                        + {keyword}
                                    </span>
                                ))}

                                {(analyticsData.compareResult
                                    .stillMissingKeywords || []
                                ).map((keyword) => (
                                    <span
                                        key={keyword}
                                        className="analytics-tag muted"
                                    >
                                        - {keyword}
                                    </span>
                                ))}
                            </div>

                            <p className="analytics-writing-analysis">
                                {analyticsData.compareResult.analysis}
                            </p>
                        </div>
                    ) : (
                        <p className="analytics-empty-text">
                            비교 가능한 이전 응답이 아직 없습니다.
                        </p>
                    )}
                </Card>

                <Card className="analytics-writing-card">
                    <div className="analytics-card-header">
                        <h2>커리큘럼 동적 재조정</h2>
                    </div>

                    {analyticsData.adjustmentResult ? (
                        <div className="analytics-writing-body">
                            <div className="analytics-writing-metric">
                                <span>재조정 필요</span>
                                <strong>
                                    {analyticsData.adjustmentResult.needsAdjustment
                                        ? "예"
                                        : "아니오"}
                                </strong>
                            </div>

                            <div className="analytics-writing-metric">
                                <span>추천 집중 영역</span>
                                <strong>
                                    {mapReadingTypeLabel(
                                        analyticsData.adjustmentResult.recommendedFocus
                                    )}
                                </strong>
                            </div>

                            <p className="analytics-writing-message">
                                {analyticsData.adjustmentResult.adjustmentMessage}
                            </p>

                            <div className="analytics-tag-row">
                                {(analyticsData.adjustmentResult.weakCompetencies || []).map(
                                    (competency) => (
                                        <span
                                            key={competency}
                                            className="analytics-tag muted"
                                        >
                                            {mapReadingTypeLabel(competency)}
                                        </span>
                                    )
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="analytics-empty-text">
                            재조정 분석에 필요한 응답 이력이 부족합니다.
                        </p>
                    )}
                </Card>
            </section>

            <section className="analytics-ability-section">
                <div className="analytics-section-title-row">
                    <h2>약점 분석 리포트</h2>
                    <span>Writing API 기반 분석</span>
                </div>

                <Card className="analytics-report-card">
                    {analyticsData.weaknessReportResult ? (
                        <>
                            <p className="analytics-report-text">
                                {analyticsData.weaknessReportResult.report}
                            </p>

                            <div className="analytics-weakness-list">
                                {(
                                    analyticsData.weaknessReportResult
                                        .weakCompetencies || []
                                ).map((item) => (
                                    <div
                                        key={item.competencyType}
                                        className="analytics-weakness-item"
                                    >
                                        <div>
                                            <h3>
                                                {mapReadingTypeLabel(
                                                    item.competencyType
                                                )}
                                            </h3>
                                            <span>{item.level}</span>
                                        </div>

                                        <strong>{item.averageScore}점</strong>
                                    </div>
                                ))}
                            </div>

                            <div className="analytics-tag-row">
                                {(
                                    analyticsData.weaknessReportResult
                                        .recommendations || []
                                ).map((item) => (
                                    <span key={item} className="analytics-tag">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="analytics-empty-text">
                            약점 분석 리포트를 생성할 데이터가 부족합니다.
                        </p>
                    )}
                </Card>
            </section>

            <section className="analytics-ability-section">
                <div className="analytics-section-title-row">
                    <h2>최근 응답 기록</h2>
                    <span>{analyticsData.recentResponses.length}건</span>
                </div>

                <Card className="analytics-record-card">
                    <div className="analytics-record-list">
                        {analyticsData.recentResponses.map((response) => (
                            <div
                                key={response.responseId}
                                className="analytics-record-item"
                            >
                                <div>
                                    <h3>{response.questionText}</h3>
                                    <p>
                                        {mapReadingTypeLabel(response.readingType)} ·{" "}
                                        문제 {response.problemId}
                                    </p>
                                </div>

                                <div className="analytics-record-meta">
                                    <strong>{response.finalScore}점</strong>
                                    <span>{formatDotDate(response.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </section>
        </div>
    );
}

export default LearningAnalytics;
