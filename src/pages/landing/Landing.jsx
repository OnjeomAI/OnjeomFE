import {useNavigate} from "react-router-dom";
import Button from "../../components/common/Button.jsx";
import Card from "../../components/common/Card.jsx";

function Landing() {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/signup");
    };

    const handleLogin = () => {
        navigate("/login");
    };

    const handleScrollToFeatures = () => {
        const target = document.getElementById("features");
        target?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="landing-page">
            <header className="landing-header">
                <div className="landing-logo">
                    <span className="landing-logo-mark"></span>

                    <div>
                        <strong>온점</strong>
                        <p>DIGITAL ARCHIVE TEST</p>
                    </div>
                </div>

                <nav className="landing-nav">
                    <Button
                        variant="light"
                        size="small"
                        className="landing-nav-button"
                        onClick={handleScrollToFeatures}
                    >
                        주요 기능
                    </Button>

                    <Button
                        variant="light"
                        size="small"
                        className="landing-nav-button"
                    >
                        커리큘럼
                    </Button>

                    <Button
                        variant="light"
                        size="small"
                        className="landing-nav-button"
                    >
                        요금제
                    </Button>
                </nav>

                <div className="landing-header-actions">
                    <Button
                        variant="light"
                        size="small"
                        className="landing-login-button"
                        onClick={handleLogin}
                    >
                        로그인
                    </Button>

                    <Button
                        variant="primary"
                        size="small"
                        className="landing-signup-button"
                        onClick={handleStart}
                    >
                        회원가입
                    </Button>
                </div>
            </header>

            <main>
                <section className="landing-hero">
                    <div className="landing-hero-content">
                        <p className="landing-eyebrow">
                            개인 맞춤형 학습 아카이브
                        </p>

                        <h1>
                            지혜의 아카이브,
                            <br />
                            당신만을 위한 AI 학습 가이드
                            <span>.</span>
                        </h1>

                        <p className="landing-hero-description">
                            단순한 오답 노트를 넘어, 당신의 사고 과정을 추적하고
                            최적의 학습 경로를 제안합니다. 온점&#40;Onjeom&#41;은
                            당신의 성장을 기록하고 분석하는 현대적인 디지털
                            서고입니다.
                        </p>

                        <div className="landing-hero-buttons">
                            <Button
                                variant="dark"
                                size="large"
                                className="landing-hero-primary"
                                onClick={handleLogin}
                            >
                                무료로 시작하기
                            </Button>

                            <Button
                                variant="light"
                                size="large"
                                className="landing-hero-secondary"
                                onClick={handleScrollToFeatures}
                            >
                                서비스 둘러보기
                            </Button>
                        </div>
                    </div>

                    <div className="landing-hero-visual" aria-label="책 이미지">
                        <div className="landing-hero-image"></div>
                    </div>
                </section>

                <section id="features" className="landing-feature-section">
                    <div className="landing-section-inner">
                        <h2>기능 그 이상의 가치</h2>

                        <div className="landing-feature-grid">
                            <Card className="landing-feature-card landing-feature-card-large">
                                <div className="landing-feature-icon">☰</div>

                                <h3>AI 자동 채점</h3>

                                <p>
                                    단순 정오표를 넘어 주관식 답변의 논리 구조를
                                    분석합니다. 인공지능이 맥락을 이해하고 정확한
                                    피드백을 즉시 제공합니다.
                                </p>

                                <div className="landing-feature-image"></div>
                            </Card>

                            <Card className="landing-feature-card landing-feature-card-dark">
                                <div className="landing-feature-icon">▣</div>

                                <h3>답변 변화 추적</h3>

                                <p>
                                    시간이 흐름에 따른 서술력과 사고력 변화를
                                    시각화합니다. 과거의 나와 현재의 나를 비교하며
                                    성장의 궤적을 확인하세요.
                                </p>

                                <div className="landing-progress-box">
                                    <div className="landing-progress-line">
                                        <span></span>
                                    </div>

                                    <p>학습 진행도 분석</p>
                                </div>
                            </Card>
                        </div>

                        <Card className="landing-curriculum-card">
                            <div className="landing-curriculum-text">
                                <div className="landing-feature-icon">▤</div>

                                <h3>맞춤형 커리큘럼</h3>

                                <p>
                                    당신의 강점과 약점을 데이터로 분석하여 오늘 가장
                                    필요한 학습 과제를 선별합니다. 지루한 반복 학습이
                                    아닌, 실력 향상을 위한 정교한 설계가 시작됩니다.
                                </p>

                                <Button
                                    variant="light"
                                    size="small"
                                    className="landing-text-link"
                                >
                                    커리큘럼 상세 보기
                                </Button>
                            </div>

                            <div className="landing-stat-list">
                                <Card className="landing-stat-card">
                                    <strong>92%</strong>
                                    <span>평균 답변 향상</span>
                                </Card>

                                <Card className="landing-stat-card">
                                    <strong>12k</strong>
                                    <span>누적 학습 기록</span>
                                </Card>
                            </div>
                        </Card>
                    </div>
                </section>

                <section className="landing-cta-section">
                    <h2>당신의 지적 성장에 온점&#40;.&#41;을 찍으세요.</h2>

                    <p>
                        지금 바로 온점&#40;Onjeom&#41;에 가입하고 당신만의
                        개인화된 학습 아카이브를 구축해 보세요.
                    </p>

                    <div className="landing-cta-buttons">
                        <Button
                            variant="primary"
                            size="large"
                            className="landing-cta-primary"
                            onClick={handleStart}
                        >
                            지금 시작하기
                        </Button>

                        <Button
                            variant="light"
                            size="large"
                            className="landing-cta-secondary"
                        >
                            도입 문의하기
                        </Button>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="landing-footer-inner">
                    <div className="landing-footer-brand">
                        <h3>• 온점</h3>

                        <p>
                            차세대 인공지능 학습 분석 플랫폼.
                            <br />
                            우리는 모든 학습자가 자신의 지식과 사고를 더욱 깊게
                            들여다볼 수 있도록 돕습니다.
                        </p>

                        <div className="landing-footer-icons">
                            <span>◎</span>
                            <span>@</span>
                        </div>
                    </div>

                    <div className="landing-footer-links">
                        <div>
                            <h4>플랫폼</h4>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                서비스 소개
                            </Button>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                이용 요금
                            </Button>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                채용 정보
                            </Button>
                        </div>

                        <div>
                            <h4>법적 고지</h4>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                이용약관
                            </Button>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                개인정보 처리방침
                            </Button>

                            <Button
                                variant="light"
                                size="small"
                                className="landing-footer-link-button"
                            >
                                쿠키 설정
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="landing-footer-bottom">
                    <span>© 2026 ONJEOM. All rights reserved.</span>
                    <span>대한민국 지식 연구소 플랫폼</span>
                </div>
            </footer>
        </div>
    );
}

export default Landing;