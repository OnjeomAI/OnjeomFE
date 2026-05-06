import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function LearningAnalytics() {
    const user = getMockUserByType("learner");

    return (
        <div>
            <PageHeader
                title="학습 분석 보고서"
                type="learner"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>학습 기록 및 분석 페이지</div>
        </div>
    );
}

export default LearningAnalytics;