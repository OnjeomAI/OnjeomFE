import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, MessageSquare } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("scholar@onjeom.ai");
    const [password, setPassword] = useState("12345678");
    const [rememberMe, setRememberMe] = useState(false);

    const handleLoginClick = () => {
        if (email === "admin@onjeom.ai") {
            navigate("/admin/question");
            return;
        }

        navigate("/dashboard");
    };

    const handleSignupClick = () => {
        navigate("/signup");
    };

    const handleSocialLogin = () => {
        navigate("/dashboard");
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
                            디지털 시대에 보존하는
                            <br />
                            지혜의 가치.
                        </h1>

                        <p>
                            온점에 오신 것을 환영합니다. 당신의 지적 여정을 위해
                            큐레이션된 개인 디지털 기록 보관소를 확인하세요.
                        </p>

                        <div className="auth-visual-caption">
                            <span></span>
                            디지털 기록가
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>다시 오신 것을 환영합니다</h2>
                        <p>학문적 탐구를 계속 이어가세요.</p>
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
                            Google 계정으로 계속하기
                        </Button>

                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button kakao"
                            onClick={handleSocialLogin}
                        >
                            <MessageSquare size={18} strokeWidth={2.4} />
                            카카오톡으로 계속하기
                        </Button>
                    </div>

                    <div className="auth-divider">
                        <span></span>
                        <p>또는 이메일 사용</p>
                        <span></span>
                    </div>

                    <div className="auth-input-list">
                        <div className="auth-input-with-icon">
                            <Mail size={18} strokeWidth={2} />

                            <Input
                                label="이메일 주소"
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
                                placeholder="비밀번호를 입력하세요"
                                variant="box"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="auth-forgot-button"
                            >
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>
                    </div>

                    <label className="auth-check-row">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(event) =>
                                setRememberMe(event.target.checked)
                            }
                        />

                        <span>로그인 상태 유지</span>
                    </label>

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleLoginClick}
                    >
                        기록 보관소 로그인
                    </Button>

                    <div className="auth-bottom-link">
                        <span>처음이신가요?</span>

                        <button type="button" onClick={handleSignupClick}>
                            새 계정 생성하기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Login;