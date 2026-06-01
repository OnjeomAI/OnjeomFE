import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";
import { exportAdminStatsCsv, getAdminStats } from "../../api/adminApi";

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

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-detail-card"
                    title="관리자 통계"
                >
                    <div className="admin-stats-grid">
                        {Object.entries(stats || {}).length === 0 ? (
                            <p className="admin-problem-empty">표시할 통계가 없습니다.</p>
                        ) : (
                            Object.entries(stats || {}).map(([key, value]) => (
                                <div className="admin-tag-summary-item" key={key}>
                                    <strong>{key}</strong>
                                    <span>{typeof value === "object" ? "객체" : "값"}</span>
                                    <em>
                                        {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value)}
                                    </em>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AdminStats;
