import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType } from "../../data/services/learnerService";

function AdminCurriculum() {
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
