import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, MessageSquare } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getAfterLoginPath } from "../../data/services/learnerService";
import { getUserTypeFromRole, login } from "../../data/services/authService";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(() => localStorage.getItem("onjeom-remember-email") || "");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(() => !!localStorage.getItem("onjeom-remember-email"));
    const [loginError, setLoginError] = useState("");
    const [infoMessage, setInfoMessage] = useState(location.state?.message || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLoginClick = async () => {
        if (!email || !password) {
            setLoginError("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        setLoginError("");
        setInfoMessage("");

        try {
            const loginResult = await login({ email, password });
            const userType = getUserTypeFromRole(loginResult.role);

            if (rememberMe) {
                localStorage.setItem("onjeom-remember-email", email);
            } else {
                localStorage.removeItem("onjeom-remember-email");
            }

            navigate(await getAfterLoginPath(userType), { replace: true });
        } catch (error) {
            setLoginError(error.message || "로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialLogin = () => {
        setInfoMessage("아직 지원하지 않는 기능입니다.");
        setLoginError("");
    };

    return (
        <div className="auth-page">
            <section className="auth-visual-section">
                <div className="auth-visual-overlay">
                    <div className="auth-brand-block">
                        <div className="auth-brand-row">
                            <span className="auth-brand-mark"></span>
                            <strong>온점</strong>
                        </div>
                        <h1>
                            읽고 쓰는 힘을
                            <br />
                            차곡차곡 기록합니다
                        </h1>
                        <p>온점에 오신 것을 환영합니다. 당신의 지적 여정을 위해 큐레이션된 개인 디지털 기록 보관소를 확인하세요.</p>
                        <div className="auth-visual-caption">
                            <span></span>
                            Personal learning archive
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>로그인</h2>
                        <p>학습을 이어가려면 계정으로 로그인해주세요.</p>
                    </div>

                    <div className="auth-social-buttons">
                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button google"
                            onClick={handleSocialLogin}
                        >
                            <span className="auth-social-icon google-icon"></span>
                            Google로 계속하기
                        </Button>

                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button kakao"
                            onClick={handleSocialLogin}
                        >
                            <MessageSquare size={18} strokeWidth={2.4} />
                            Kakao로 계속하기
                        </Button>
                    </div>

                    <div className="auth-divider">
                        <span></span>
                        <p>또는 이메일로 로그인</p>
                        <span></span>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <Mail size={18} strokeWidth={2} />
                            <Input
                                label="이메일"
                                type="email"
                                name="email"
                                value={email}
                                placeholder="user@example.com"
                                autoComplete="off"
                                variant="box"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="auth-input-with-icon">
                            <LockKeyhole size={18} strokeWidth={2} />
                            <Input
                                label="비밀번호"
                                type="password"
                                name="password"
                                value={password}
                                placeholder="비밀번호를 입력해주세요"
                                autoComplete="current-password"
                                variant="box"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                            <button
                                type="button"
                                className="auth-forgot-button"
                                onClick={() => navigate("/password/reset-request")}
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>
                    </div>

                    <label className="auth-check-row">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) => setRememberMe(event.target.checked)}
                        />
                        <span>이메일 기억하기</span>
                    </label>

                    {infoMessage ? <p className="auth-success-message">{infoMessage}</p> : null}
                    {loginError ? <p className="auth-login-error">{loginError}</p> : null}

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleLoginClick}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "로그인 중..." : "로그인"}
                    </Button>

                    <div className="auth-bottom-link">
                        <span>처음 오셨나요?</span>
                        <button type="button" onClick={() => navigate("/signup")}>
                            회원가입
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;
