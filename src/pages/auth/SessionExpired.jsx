import { useNavigate } from "react-router-dom";
import { LogIn, RefreshCw } from "lucide-react";
import Button from "../../components/common/Button";

function SessionExpired() {
    const navigate = useNavigate();

    return (
        <div className="session-expired-page">
            <div className="session-expired-card">
                <div className="session-expired-icon">
                    <RefreshCw size={40} />
                </div>

                <h1 className="session-expired-title">세션이 만료되었습니다</h1>

                <p className="session-expired-desc">
                    오랫동안 활동이 없어 자동으로 로그아웃되었습니다.
                    <br />
                    계속하려면 다시 로그인해 주세요.
                </p>

                <Button
                    variant="primary"
                    size="large"
                    className="session-expired-btn"
                    onClick={() => navigate("/login")}
                >
                    <LogIn size={18} />
                    로그인하기
                </Button>
            </div>
        </div>
    );
}

export default SessionExpired;
