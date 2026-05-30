import { useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { KeyRound, LockKeyhole } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { resetPassword } from "../../data/services/authService";

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

        try {
            const result = await resetPassword({ token, newPassword });
            setErrorMessage("");
            setMessage(result.message || "비밀번호가 재설정되었습니다.");
            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            setMessage("");
            setErrorMessage(error.message || "비밀번호 재설정에 실패했습니다.");
        }
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
                            새 비밀번호로
                            <br />
                            계정 접근을 복구하세요
                        </h1>

                        <p>
                            이메일로 받은 재설정 토큰과 새 비밀번호를 입력하면
                            바로 로그인할 수 있습니다.
                        </p>

                        <div className="auth-visual-caption">
                            <span></span>
                            최소 8자 비밀번호
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
                                ? `${email}로 받은 재설정 정보를 입력해주세요.`
                                : "메일로 받은 토큰과 새 비밀번호를 입력해주세요."}
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
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
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
                        비밀번호 변경 완료
                    </Button>

                    <div className="auth-bottom-link">
                        <button
                            type="button"
                            onClick={() => navigate("/password/reset-request")}
                        >
                            재설정 메일 다시 요청하기
                        </button>
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
