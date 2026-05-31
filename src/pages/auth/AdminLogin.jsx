import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { login } from "../../data/services/authService";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();

        if (!email || !password) {
            setErrorMessage("이메일과 비밀번호를 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        setErrorMessage("");

        try {
            await login({ email, password });
            navigate("/admin/question", { replace: true });
        } catch (error) {
            setErrorMessage(error.message || "관리자 로그인에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="admin-login-page">
            <section className="admin-login-brand-section">
                <div className="admin-login-brand-content">
                    <div className="admin-login-brand-row">
                        <span className="admin-login-brand-mark" />
                        <strong>온점</strong>
                    </div>
                    <h1>학습자와 같은 인증 체계로 관리자 화면에 진입합니다.</h1>
                    <p>
                        별도 관리자 인증 API 없이 동일한 로그인 API를 사용합니다.
                        <br />
                        관리자 role을 가진 계정이면 자동으로 관리자 화면으로 이동합니다.
                    </p>
                    <span className="admin-login-caption">Admin console</span>
                </div>
            </section>

            <section className="admin-login-form-section">
                <div className="admin-login-form-container">
                    <div className="admin-login-title">
                        <h2>관리자 로그인</h2>
                        <p>기존 계정 시스템을 그대로 사용합니다.</p>
                    </div>

                    <form className="admin-login-form" onSubmit={handleLogin} autoComplete="off">
                        <div className="admin-login-input">
                            <Mail size={18} strokeWidth={2} />
                            <Input
                                label="이메일"
                                type="email"
                                name="adminEmail"
                                value={email}
                                placeholder="admin@onjeom.ai"
                                autoComplete="off"
                                variant="box"
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>

                        <div className="admin-login-input">
                            <LockKeyhole size={18} strokeWidth={2} />
                            <Input
                                label="비밀번호"
                                type="password"
                                name="adminPassword"
                                value={password}
                                placeholder="비밀번호를 입력해주세요"
                                autoComplete="current-password"
                                variant="box"
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>

                        {errorMessage ? <p className="auth-login-error">{errorMessage}</p> : null}

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            className="admin-login-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "로그인 중..." : "관리자 로그인"}
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default AdminLogin;
