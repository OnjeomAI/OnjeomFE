import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, MessageSquare, UserRound } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { signup } from "../../data/services/authService";

function Signup() {
    const navigate = useNavigate();
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [infoMessage, setInfoMessage] = useState("");

    const handleSignupClick = async () => {
        if (!nickname || !email || !password || !passwordConfirm) {
            setErrorMessage("모든 항목을 입력해주세요.");
            return;
        }

        if (password !== passwordConfirm) {
            setErrorMessage("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!agreeTerms) {
            setErrorMessage("이용 약관 동의가 필요합니다.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");
        setInfoMessage("");

        try {
            await signup({ email, password, nickname });
            navigate("/signup/verify", { state: { email } });
        } catch (error) {
            setErrorMessage(error.message || "회원가입에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSocialSignup = () => {
        setInfoMessage("아직 지원하지 않는 기능입니다.");
        setErrorMessage("");
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
                            개인 학습 기록을
                            <br />
                            지금 시작하세요
                        </h1>
                        <p>회원가입 후 이메일 인증을 거쳐 로그인할 수 있습니다.</p>
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
                        <h2>회원가입</h2>
                        <p>기존 UI를 유지한 채 실제 가입 API로 연결했습니다.</p>
                    </div>

                    <div className="auth-social-buttons">
                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button google"
                            onClick={handleSocialSignup}
                        >
                            <span className="auth-social-icon google-icon"></span>
                            Google로 가입하기
                        </Button>

                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button kakao"
                            onClick={handleSocialSignup}
                        >
                            <MessageSquare size={18} strokeWidth={2.4} />
                            Kakao로 가입하기
                        </Button>
                    </div>

                    <div className="auth-divider">
                        <span></span>
                        <p>또는 이메일로 가입</p>
                        <span></span>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <UserRound size={18} strokeWidth={2} />
                            <Input
                                label="닉네임"
                                name="nickname"
                                value={nickname}
                                placeholder="사용할 이름을 입력하세요"
                                variant="box"
                                onChange={(event) => setNickname(event.target.value)}
                            />
                        </div>

                        <div className="auth-input-with-icon">
                            <Mail size={18} strokeWidth={2} />
                            <Input
                                label="이메일"
                                type="email"
                                name="email"
                                value={email}
                                placeholder="scholar@onjeom.ai"
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
                                placeholder="8자 이상 입력하세요"
                                variant="box"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        <div className="auth-input-with-icon">
                            <LockKeyhole size={18} strokeWidth={2} />
                            <Input
                                label="비밀번호 확인"
                                type="password"
                                name="passwordConfirm"
                                value={passwordConfirm}
                                placeholder="비밀번호를 다시 입력하세요"
                                variant="box"
                                onChange={(event) => setPasswordConfirm(event.target.value)}
                            />
                        </div>
                    </div>

                    <label className="auth-check-row">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(event) => setAgreeTerms(event.target.checked)}
                        />
                        <span>이용 약관 및 개인정보 처리방침에 동의합니다.</span>
                    </label>

                    {infoMessage ? <p className="auth-success-message">{infoMessage}</p> : null}
                    {errorMessage ? <p className="auth-login-error">{errorMessage}</p> : null}

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleSignupClick}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "가입 중..." : "계정 만들기"}
                    </Button>

                    <div className="auth-bottom-link">
                        <span>이미 계정이 있나요?</span>
                        <button type="button" onClick={() => navigate("/login")}>
                            로그인
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Signup;
