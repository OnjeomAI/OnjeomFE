import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import Card from "../../components/common/Card";
import { getUserByType } from "../../data/services/learnerService";
import { getAdminStats } from "../../api/adminApi";

function AdminStats() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

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
                    setErrorMessage(
                        error.message || "관리자 통계 정보를 불러오지 못했습니다."
                    );
                }
            }
        }

        loadPage();

        return () => {
            ignore = true;
        };
    }, []);

    if (errorMessage && !user) {
        return <div>{errorMessage}</div>;
    }

    if (!user) {
        return <div>관리자 정보를 불러오는 중입니다.</div>;
    }

    return (
        <div>
            <PageHeader
                title="통계 분석"
                type="admin"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            {errorMessage ? <p className="admin-problem-error">{errorMessage}</p> : null}

            <div className="admin-problem-layout">
                <Card
                    className="admin-problem-detail-card"
                    title="관리자 통계"
                    subtitle="GET /api/admin/dashboard/stats"
                >
                    <div className="admin-problem-detail">
                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                            {JSON.stringify(stats || {}, null, 2)}
                        </pre>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default AdminStats;
