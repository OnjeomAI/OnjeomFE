import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Card from "../../../components/common/Card.jsx";
import { logoutAll } from "../../../data/services/authService";

function ProfileSecurity({ type = "learner" }) {
    const navigate = useNavigate();

    const handleChangePassword = () => {
        navigate("/password/reset-request");
    };

    const handleLogoutAll = async () => {
        const confirmed = window.confirm(
            "모든 기기에서 로그아웃하시겠습니까?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await logoutAll();
            navigate(type === "admin" ? "/admin" : "/login");
        } catch (error) {
            console.error(error);
            alert(error.message || "전체 기기 로그아웃에 실패했습니다.");
        }
    };

    return (
        <Card className="profile-security-card" accent>
            <div className="profile-security-header">
                <h3>보안 및 접근 권한</h3>
                <Shield size={18} strokeWidth={2} />
            </div>

            <p className="profile-security-description">
                계정 보안을 위해 비밀번호 관리와 세션 정리를 할 수 있습니다.
            </p>

            <div className="profile-security-actions">
                <button
                    className="profile-security-link-button"
                    type="button"
                    onClick={handleChangePassword}
                >
                    비밀번호 변경하기
                    <span>&gt;</span>
                </button>

                <button
                    className="profile-security-danger-button"
                    type="button"
                    onClick={handleLogoutAll}
                >
                    전체 기기 로그아웃
                </button>
            </div>
        </Card>
    );
}

export default ProfileSecurity;
