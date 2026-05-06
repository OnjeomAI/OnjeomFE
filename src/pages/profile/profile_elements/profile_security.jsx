import { Shield } from "lucide-react";
import Card from "../../../components/common/Card.jsx";

function ProfileSecurity() {
    const handleChangePassword = () => {
        alert("비밀번호 변경 기능은 백엔드 연결 후 구현 예정.");
    };

    return (
        <Card className="profile-security-card" accent>
            <div className="profile-security-header">
                <h3>보안 및 접근 권한</h3>
                <Shield size={18} strokeWidth={2} />
            </div>

            <p className="profile-security-description">
                아카이브 접근 보안을 위해 복잡한 암호를 사용하세요.
            </p>

            <button
                className="profile-security-link-button"
                type="button"
                onClick={handleChangePassword}
            >
                비밀번호 변경하기
                <span>→</span>
            </button>
        </Card>
    );
}

export default ProfileSecurity;