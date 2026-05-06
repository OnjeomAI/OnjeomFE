import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import { getMockUserByType } from "../../../data/mockData";

function LearnerResult() {
    const navigate = useNavigate();
    const user = getMockUserByType("learner");

    return (
        <div>
            <PageHeader
                title="학습 세션 채점 결과"
                type="learner"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>오늘의 학습 결과 화면</div>

            <Button variant="primary" onClick={() => navigate("/dashboard")}>
                대시보드로 돌아가기
            </Button>
        </div>
    );
}

export default LearnerResult;