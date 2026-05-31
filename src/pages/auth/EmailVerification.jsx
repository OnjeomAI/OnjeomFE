import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound, MailCheck } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function maskEmail(email) {
    if (!email || !email.includes("@")) {
        return "";
    }

    const [localPart, domain] = email.split("@");
    const visible = localPart.slice(0, 2);
    const masked = "*".repeat(Math.max(localPart.length - 2, 2));

    return `${visible}${masked}@${domain}`;
}

function EmailVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const initialEmail = location.state?.email || "";

    const [email, setEmail] = useState(initialEmail);
    const [otpCode, setOtpCode] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [infoMessage] = useState(
        "현재 이메일 인증 API는 지원하지 않습니다. 로그인 화면으로 이동해주세요."
    );

    const maskedEmail = useMemo(() => maskEmail(email), [email]);

    const handleVerifyClick = async () => {
        if (!email || !otpCode) {
            setErrorMessage("이메일과 인증 코드를 모두 입력해주세요.");
            return;
        }

        navigate("/login", {
            replace: true,
            state: {
                message: "이메일 인증은 아직 지원하지 않습니다. 로그인으로 진행해주세요.",
            },
        });
    };

    return (
        <div className="auth-page email-verification-page">
            <section className="auth-visual-section">
                <div className="auth-visual-overlay">
                    <div className="auth-brand-block">
                        <div className="auth-brand-row">
                            <span className="auth-brand-mark"></span>
                            <strong>온점</strong>
                        </div>

                        <h1>
                            이메일 인증은
                            <br />
                            아직 준비 중입니다
                        </h1>

                        <p>OpenAPI 명세 기준으로 이메일 인증 엔드포인트가 없어 실제 호출은 하지 않습니다.</p>

                        <div className="auth-visual-caption">
                            <span></span>
                            Soon
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>이메일 인증</h2>
                        <p>
                            {maskedEmail
                                ? `${maskedEmail} 주소 기준 안내 화면입니다.`
                                : "현재는 안내 화면만 제공합니다."}
                        </p>
                    </div>

                    <div className="email-verification-status">
                        <div className="email-verification-badge">
                            <MailCheck size={18} strokeWidth={2.2} />
                            <span>인증 API 미지원</span>
                        </div>

                        <p>{infoMessage}</p>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <MailCheck size={18} strokeWidth={2} />
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

                        <div className="auth-input-with-icon">
                            <KeyRound size={18} strokeWidth={2} />
                            <Input
                                label="6자리 인증 코드"
                                name="otpCode"
                                value={otpCode}
                                placeholder="123456"
                                variant="box"
                                onChange={(event) =>
                                    setOtpCode(
                                        event.target.value.replace(/\D/g, "").slice(0, 6)
                                    )
                                }
                            />
                        </div>
                    </div>

                    {errorMessage && (
                        <p className="auth-login-error">{errorMessage}</p>
                    )}

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleVerifyClick}
                    >
                        로그인으로 이동
                    </Button>

                    <div className="email-verification-actions">
                        <button type="button" onClick={() => setOtpCode("")}>
                            입력 초기화
                        </button>
                        <button type="button" onClick={() => navigate("/signup")}>
                            회원가입으로 돌아가기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default EmailVerification;
