import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail } from "lucide-react";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { getAfterLoginPath } from "../../data/services/learnerService";
import { getUserTypeFromRole, login } from "../../data/services/authService";

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
            const loginResult = await login({ email, password });
            const userType = getUserTypeFromRole(loginResult.role);

            if (userType !== "admin") {
                throw new Error("관리자 계정이 아닙니다.");
            }

            navigate(await getAfterLoginPath(userType));
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
                    <h1>디지털 시대에 보존하는 지혜의 가치.</h1>
                    <p>
                        온점 콘텐츠 관리자 시스템(CMS)입니다.
                        <br />
                        등록된 관리자 계정으로 로그인해 주세요.
                    </p>
                    <span className="admin-login-caption">디지털 기록가</span>
                </div>
            </section>

            <section className="admin-login-form-section">
                <div className="admin-login-form-container">
                    <div className="admin-login-title">
                        <h2>관리자 로그인</h2>
                        <p>학문적 탐구를 관리하고 기록을 보존합니다.</p>
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
                                placeholder="비밀번호를 입력하세요"
                                autoComplete="new-password"
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
