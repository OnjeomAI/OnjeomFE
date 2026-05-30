import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { requestPasswordReset } from "../../data/services/authService";

function PasswordResetRequest() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async () => {
        if (!email) {
            setErrorMessage("이메일을 입력해주세요.");
            return;
        }

        try {
            const result = await requestPasswordReset(email);
            setErrorMessage("");
            setMessage(
                result.message ||
                    "비밀번호 재설정 이메일을 발송했습니다. 메일의 토큰으로 다음 단계를 진행하세요."
            );
        } catch (error) {
            setMessage("");
            setErrorMessage(
                error.message || "비밀번호 재설정 요청에 실패했습니다."
            );
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
                            비밀번호를 잊었다면
                            <br />
                            이메일로 다시 시작하세요
                        </h1>

                        <p>
                            가입한 이메일 주소로 비밀번호 재설정 링크와 토큰을
                            보내드립니다.
                        </p>

                        <div className="auth-visual-caption">
                            <span></span>
                            재설정 메일 발송
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>비밀번호 재설정 요청</h2>
                        <p>가입한 이메일 주소를 입력해주세요.</p>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <Mail size={18} strokeWidth={2} />
                            <Input
                                label="이메일 주소"
                                type="email"
                                name="email"
                                value={email}
                                placeholder="user@example.com"
                                variant="box"
                                onChange={(event) => setEmail(event.target.value)}
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
                        <Send size={16} strokeWidth={2.2} />
                        재설정 메일 보내기
                    </Button>

                    <div className="auth-bottom-link">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/password/reset", {
                                    state: { email },
                                })
                            }
                        >
                            이미 토큰이 있다면 재설정하기
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

export default PasswordResetRequest;
