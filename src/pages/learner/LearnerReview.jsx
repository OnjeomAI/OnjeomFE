import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function LearnerReview() {
    const user = getMockUserByType("learner");

    return (
        <div>
            <PageHeader
                subtitle="성취도 분석"
                title="답변 변화 추적"
                type="learner"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>복습하기 페이지</div>
        </div>
    );
}

export default LearnerReview;