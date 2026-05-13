import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LockKeyhole,
    Mail,
    MessageSquare,
    UserRound,
} from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function Signup() {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleSignupClick = () => {
        navigate("/onboarding/diagnosis");
    };

    const handleSocialSignup = () => {
        navigate("/onboarding/diagnosis");
    };

    const handleLoginClick = () => {
        navigate("/login");
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
                            당신만의 지식 아카이브를
                            <br />
                            시작하세요.
                        </h1>

                        <p>
                            온점은 학습자의 답변과 사고 과정을 기록하고, 더 나은
                            독해와 글쓰기 성장을 위한 맞춤형 경로를 제안합니다.
                        </p>

                        <div className="auth-visual-caption">
                            <span></span>
                            개인 학습 큐레이션
                        </div>
                    </div>
                </div>
            </section>

            <section className="auth-form-section">
                <div className="auth-form-container">
                    <div className="auth-title-box">
                        <h2>새 기록 보관소 만들기</h2>
                        <p>온점과 함께 첫 진단을 시작해보세요.</p>
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
                            Google 계정으로 가입하기
                        </Button>

                        <Button
                            variant="light"
                            size="large"
                            fullWidth
                            className="auth-social-button kakao"
                            onClick={handleSocialSignup}
                        >
                            <MessageSquare size={18} strokeWidth={2.4} />
                            카카오톡으로 가입하기
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
                                onChange={(event) =>
                                    setNickname(event.target.value)
                                }
                            />
                        </div>

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
                                placeholder="8자 이상 입력하세요"
                                variant="box"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
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
                                onChange={(event) =>
                                    setPasswordConfirm(event.target.value)
                                }
                            />
                        </div>
                    </div>

                    <label className="auth-check-row">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={(event) =>
                                setAgreeTerms(event.target.checked)
                            }
                        />

                        <span>이용약관과 개인정보 처리방침에 동의합니다</span>
                    </label>

                    <Button
                        variant="primary"
                        size="large"
                        fullWidth
                        className="auth-submit-button"
                        onClick={handleSignupClick}
                    >
                        새 계정 생성하기
                    </Button>

                    <div className="auth-bottom-link">
                        <span>이미 계정이 있으신가요?</span>

                        <button type="button" onClick={handleLoginClick}>
                            로그인하기
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Signup;