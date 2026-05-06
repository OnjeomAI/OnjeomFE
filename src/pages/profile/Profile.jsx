import PageHeader from "../../components/common/PageHeader";
import { getMockUserByType } from "../../data/mockData";

function Profile({ type = "learner" }) {
    const user = getMockUserByType(type);

    return (
        <div className="profile-page">
            <PageHeader
                title="내 프로필 및 환경설정"
                type={type}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />
        </div>
    );
}

export default Profile;