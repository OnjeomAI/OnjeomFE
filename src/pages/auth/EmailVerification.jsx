import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { KeyRound, MailCheck } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { verifyEmail } from "../../data/services/authService";

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
    const [infoMessage, _setInfoMessage] = useState(
        initialEmail
            ? "인증 메일을 발송했습니다. 받은 메일의 6자리 코드를 입력해주세요."
            : "가입에 사용한 이메일과 6자리 코드를 입력해주세요."
    );

    const maskedEmail = useMemo(() => maskEmail(email), [email]);

    const handleVerifyClick = async () => {
        if (!email || !otpCode) {
            setErrorMessage("이메일과 인증 코드를 모두 입력해주세요.");
            return;
        }

        try {
            await verifyEmail({ email, otpCode });
            navigate("/login");
        } catch (error) {
            setErrorMessage(error.message || "이메일 인증에 실패했습니다.");
        }
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
                            이메일 인증으로
                            <br />
                            계정을 활성화하세요
                        </h1>

                        <p>
                            가입 후 발송된 6자리 OTP 코드를 입력하면 계정이
                            활성화되고 학습을 시작할 수 있습니다.
                        </p>

                        <div className="auth-visual-caption">
                            <span></span>
                            10분 내 인증 필요
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
                                ? `${maskedEmail}로 보낸 인증 코드를 입력해주세요.`
                                : "가입에 사용한 이메일 주소와 6자리 인증 코드를 입력해주세요."}
                        </p>
                    </div>

                    <div className="email-verification-status">
                        <div className="email-verification-badge">
                            <MailCheck size={18} strokeWidth={2.2} />
                            <span>인증 메일 발송 완료</span>
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
                        인증 완료하기
                    </Button>

                    <div className="email-verification-actions">
                        <button type="button" onClick={() => setOtpCode("")}>
                            인증 코드 다시 입력하기
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
