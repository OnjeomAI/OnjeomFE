import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";

function AdminQuestionManagement() {
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
