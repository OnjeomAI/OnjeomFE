import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import { getMockUserByType } from "../../../data/mockData";

function LearnerStudy() {
    const navigate = useNavigate();
    const user = getMockUserByType("learner");

    const handleSubmit = () => {
        navigate("/today/result");
    };

    return (
        <div>
            <PageHeader
                subtitle="진행 중인 세션"
                title="학습 3일차 - 문항 3"
                type="learner"
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div>오늘의 학습 문제 풀이 화면</div>

            <Button variant="primary" onClick={handleSubmit}>
                정답 제출하기
            </Button>
        </div>
    );
}

export default LearnerStudy;