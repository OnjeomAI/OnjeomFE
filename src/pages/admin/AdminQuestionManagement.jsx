import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function AdminQuestionManagement() {
    const user = getMockUserByType("admin");

    return (
        <div>
            <PageHeader
                title="신규 문항 등록"
                type="admin"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>관리자 문항 관리 페이지</div>
        </div>
    );
}

export default AdminQuestionManagement;