import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, LockKeyhole } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function PasswordReset() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const initialToken = useMemo(
        () => searchParams.get("token") || "",
        [searchParams]
    );

    const [token, setToken] = useState(initialToken);
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const email = location.state?.email || "";

    const handleSubmit = async () => {
        if (!token || !newPassword) {
            setErrorMessage("토큰과 새 비밀번호를 모두 입력해주세요.");
            return;
        }

        setErrorMessage("");
        setMessage("아직 지원하지 않는 기능입니다.");
    };

    return (
        <div className="auth-page password-reset-page">
            <section className="auth-visual-section">
                <div className="auth-visual-overlay">
                    <div className="auth-brand-block">
                        <div className="auth-brand-row">
                            <span className="auth-brand-mark"></span>
                            <strong>온점</strong>
                        </div>

                        <h1>
                            비밀번호 재설정은
                            <br />
                            아직 준비 중입니다
                        </h1>

                        <p>명세에 없는 API는 호출하지 않고 기존 화면 흐름만 유지합니다.</p>

                        <div className="auth-visual-caption">
                            <span></span>
                            Password reset
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>비밀번호 재설정</h2>
                        <p>
                            {email
                                ? `${email} 계정 기준 안내 화면입니다.`
                                : "현재는 실제 재설정 API 없이 안내만 제공합니다."}
                        </p>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <KeyRound size={18} strokeWidth={2} />
                            <Input
                                label="재설정 토큰"
                                name="token"
                                value={token}
                                placeholder="reset-token"
                                variant="box"
                                onChange={(event) => setToken(event.target.value)}
                            />
                        </div>

                        <div className="auth-input-with-icon">
                            <LockKeyhole size={18} strokeWidth={2} />
                            <Input
                                label="새 비밀번호"
                                type="password"
                                name="newPassword"
                                value={newPassword}
                                placeholder="newPassword123"
                                variant="box"
                                onChange={(event) => setNewPassword(event.target.value)}
                            />
                        </div>
                    </div>

                    {message && <p className="auth-success-message">{message}</p>}
                    {errorMessage && (
                        <p className="auth-login-error">{errorMessage}</p>
                    )}

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleSubmit}
                    >
                        안내 확인
                    </Button>

                    <div className="auth-bottom-link">
                        <button type="button" onClick={() => navigate("/login")}>
                            로그인으로 돌아가기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default PasswordReset;
