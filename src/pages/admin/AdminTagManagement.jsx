import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function AdminTagManagement() {
    const user = getMockUserByType("admin");

    return (
        <div>
            <PageHeader
                title="태그 관리"
                type="admin"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>관리자 태그 관리 페이지</div>
        </div>
    );
}

export default AdminTagManagement;