import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";

function AdminStats() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserByType("admin").then(setUser);
    }, []);

    if (!user) {
        return <div></div>;
    }

    return (
        <div>
            <PageHeader
                title="통계 분석"
                type="admin"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>관리자 통계 분석 페이지</div>
        </div>
    );
}

export default AdminStats;
