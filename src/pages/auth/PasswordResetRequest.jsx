import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Send } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

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

                        <p>OpenAPI 명세 기준 인증 관련 재설정 엔드포인트가 없어 안내만 제공합니다.</p>

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
                        <h2>비밀번호 재설정 요청</h2>
                        <p>현재는 실제 메일 발송 없이 안내 메시지만 표시합니다.</p>
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

export default PasswordResetRequest;
