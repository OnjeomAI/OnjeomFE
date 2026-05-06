import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function AdminStats() {
    const user = getMockUserByType("admin");

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