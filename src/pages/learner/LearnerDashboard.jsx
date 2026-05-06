import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function LearnerDashboard() {
    const user = getMockUserByType("learner");

    return (
        <div>
            <PageHeader
                title="학습 현황 개요"
                type="learner"
                showBack={false}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>학습자 대시보드 페이지</div>
        </div>
    );
}

export default LearnerDashboard;