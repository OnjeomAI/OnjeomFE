import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

function AdminLogin() {
    const [email, setEmail] = useState("admin@onjeom.ai");
    const [password, setPassword] = useState("");

    const handleLogin = (event) => {
        event.preventDefault();
        console.log("관리자 로그인 요청:", { email, password });
    };

    return (
        <main className="admin-login-page">
            <section className="admin-login-brand-section">
                <div className="admin-login-brand-content">
                    <div className="admin-login-brand-row">
                        <span className="admin-login-brand-mark" />
                        <strong>온점</strong>
                    </div>

                    <h1>데이터로 학습의 흐름을 관리합니다</h1>

                    <p>
                        온점 콘텐츠 관리자 시스템에서 문제, 태그, 커리큘럼과
                        학습 통계를 한곳에서 확인하세요.
                    </p>

                    <span className="admin-login-caption">관리자 전용 CMS</span>
                </div>
            </section>

            <section className="admin-login-form-section">
                <div className="admin-login-form-container">
                    <div className="admin-login-title">
                        <h2>관리자 로그인</h2>
                        <p>등록된 관리자 계정으로 로그인해 주세요.</p>
                    </div>

                    <form className="admin-login-form" onSubmit={handleLogin}>
                        <div className="admin-login-input">
                            <Mail size={18} strokeWidth={2} />
                            <Input
                                label="이메일 주소"
                                type="email"
                                name="adminEmail"
                                value={email}
                                placeholder="admin@onjeom.ai"
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
                                variant="box"
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            className="admin-login-submit"
                        >
                            관리자 시스템 로그인
                        </Button>
                    </form>
                </div>
            </section>
        </main>
    );
}

export default AdminLogin;
