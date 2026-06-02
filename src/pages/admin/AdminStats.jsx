import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import {
    exportAdminStatsCsv,
    getAdminStats,
} from "../../data/services/adminService";

const statCards = [
    {
        key: "totalUsers",
        label: "전체 사용자",
        description: "가입된 전체 계정 수",
        suffix: "명",
    },
    {
        key: "newUsersThisMonth",
        label: "이번 달 신규 사용자",
        description: "이번 달 새로 가입한 사용자",
        suffix: "명",
    },
    {
        key: "activeUsersThisMonth",
        label: "이번 달 활성 사용자",
        description: "이번 달 학습 활동이 있는 사용자",
        suffix: "명",
    },
    {
        key: "totalResponses",
        label: "전체 제출 답안",
        description: "누적 답안 제출 수",
        suffix: "건",
    },
    {
        key: "overallAverageScore",
        label: "전체 평균 점수",
        description: "채점된 답안의 평균 점수",
        suffix: "점",
    },
];

const competencyLabels = {
    FACTUAL: "사실 이해",
    INFERENTIAL: "추론 이해",
    CRITICAL: "비판 이해",
    CREATIVE: "창의 이해",
    VOCABULARY: "어휘 이해",
    LOGICAL: "논리 이해",
};

function formatNumber(value, fractionDigits = 0) {
    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return "0";
    }

    return numeric.toLocaleString("ko-KR", {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    });
}

function getCompetencyLabel(type) {
    return competencyLabels[type] || type || "-";
}

function getExtraStats(stats) {
    const knownKeys = new Set([
        ...statCards.map((item) => item.key),
        "competencyStats",
    ]);

    return Object.entries(stats || {}).filter(([key]) => !knownKeys.has(key));
}

function AdminStats() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        let ignore = false;

        async function loadPage() {
            try {
                const [nextUser, result] = await Promise.all([
                    getUserByType("admin"),
                    getAdminStats(),
                ]);

                if (!ignore) {
                    setUser(nextUser);
                    setStats(result.data || {});
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || "관리자 통계를 불러오지 못했습니다.");
                }
            }
        }

        loadPage();

        return () => {
            ignore = true;
        };
    }, []);

    const handleDownloadCsv = async () => {
        setIsDownloading(true);
        setErrorMessage("");

        try {
            const blob = await exportAdminStatsCsv();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "admin-dashboard-stats.csv";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setErrorMessage(error.message || "통계 파일 내보내기에 실패했습니다.");
        } finally {
            setIsDownloading(false);
        }
    };

    if (errorMessage && !user) {
        return <div>{errorMessage}</div>;
    }

    if (!user) {
        return <div>관리자 정보를 불러오는 중입니다.</div>;
    }

    const competencyStats = Array.isArray(stats?.competencyStats)
        ? stats.competencyStats
        : [];
    const extraStats = getExtraStats(stats);

    return (
        <div className="admin-problem-page">
            <PageHeader
                title="통계"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="admin-problem-toolbar admin-problem-toolbar-end">
                <Button
                    variant="outline"
                    size="medium"
                    className="admin-inline-button"
                    onClick={handleDownloadCsv}
                    disabled={isDownloading}
                >
                    <Download size={16} strokeWidth={2} />
                    {isDownloading ? "다운로드 중..." : "통계 파일 내보내기"}
                </Button>
            </div>

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}

            <section className="admin-stats-summary-grid">
                {statCards.map((card) => (
                    <Card key={card.key} className="admin-stats-summary-card">
                        <span>{card.description}</span>
                        <strong>
                            {formatNumber(
                                stats?.[card.key],
                                card.key === "overallAverageScore" ? 1 : 0
                            )}
                        </strong>
                        <p>
                            {card.label}
                            {card.suffix ? ` (${card.suffix})` : ""}
                        </p>
                    </Card>
                ))}
            </section>

            <Card className="admin-stats-table-card" title="역량별 통계">
                {competencyStats.length === 0 ? (
                    <p className="admin-problem-empty">표시할 역량 통계가 없습니다.</p>
                ) : (
                    <div className="admin-stats-table-wrap">
                        <table className="admin-stats-table">
                            <thead>
                                <tr>
                                    <th>역량</th>
                                    <th>평균 점수</th>
                                    <th>참여 사용자</th>
                                </tr>
                            </thead>
                            <tbody>
                                {competencyStats.map((item) => (
                                    <tr key={item.type}>
                                        <td>
                                            <strong>{getCompetencyLabel(item.type)}</strong>
                                            <span>{item.type}</span>
                                        </td>
                                        <td>{formatNumber(item.averageScore, 1)}점</td>
                                        <td>{formatNumber(item.userCount)}명</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {extraStats.length > 0 ? (
                <Card title="기타 통계">
                    <div className="admin-stats-extra-grid">
                        {extraStats.map(([key, value]) => (
                            <div className="admin-stats-extra-item" key={key}>
                                <span>{key}</span>
                                <strong>
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </strong>
                            </div>
                        ))}
                    </div>
                </Card>
            ) : null}
        </div>
    );
}

export default AdminStats;
