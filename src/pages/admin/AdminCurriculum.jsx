import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function AdminCurriculum() {
    const user = getMockUserByType("admin");

    return (
        <div>
            <PageHeader
                title="커리큘럼"
                type="admin"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>관리자 커리큘럼 페이지</div>
        </div>
    );
}

export default AdminCurriculum;