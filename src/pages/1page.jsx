import Button from "../components/common/Button";
import Card from "../components/common/Card";

const OnePage = () => {
    return (
        <div style={{ backgroundColor: "#f9f9f7", minHeight: "100vh", fontFamily: "serif" }}>
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px 50px",
                    alignItems: "center",
                }}
            >
                <h2 style={{ color: "#4a3f35" }}>온점(.)</h2>
                <nav>
                    <Button style={{ background: "transparent", color: "#000" }}>로그인</Button>
                    <Button style={{ background: "#4a3f35", color: "#fff", marginLeft: "10px" }}>
                        시작하기
                    </Button>
                </nav>
            </header>

            <section
                style={{
                    display: "flex",
                    padding: "100px 50px",
                    alignItems: "center",
                    gap: "50px",
                }}
            >
                <div style={{ flex: 1 }}>
                    <p style={{ color: "#c4a484", fontWeight: "bold" }}>학습 가이드 플랫폼</p>
                    <h1 style={{ fontSize: "3rem", margin: "20px 0", color: "#222" }}>
                        지식의 아카이브,
                        <br />
                        나만을 위한 AI 학습 가이드.
                    </h1>
                    <p style={{ color: "#666", lineHeight: "1.6", marginBottom: "30px" }}>
                        단순한 오답 노트를 넘어, 학습 과정을 이해하고 최적의 학습 경로를 제안합니다.
                    </p>
                    <Button style={{ background: "#222", color: "#fff", padding: "15px 30px" }}>
                        지금 시작하기
                    </Button>
                </div>
                <div style={{ flex: 1 }} />
            </section>

            <section style={{ padding: "80px 50px", textAlign: "center" }}>
                <h2 style={{ fontSize: "2rem", marginBottom: "50px" }}>기능 그 이상의 가치</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
                    <Card>
                        <div style={{ padding: "30px", textAlign: "left" }}>
                            <h3>AI 자동 채점</h3>
                            <p>작성한 답안을 AI가 분석하여 즉시 피드백을 제공합니다.</p>
                        </div>
                    </Card>
                    <Card style={{ backgroundColor: "#2e2620", color: "#fff" }}>
                        <div style={{ padding: "30px", textAlign: "left" }}>
                            <h3>답변 변화 추적</h3>
                            <p>시간에 따른 사고와 성장을 한눈에 확인하세요.</p>
                        </div>
                    </Card>
                </div>
            </section>

            <section style={{ backgroundColor: "#f0ece2", padding: "100px 0", textAlign: "center" }}>
                <h2>나의 지식 성장을 온점(.)과 함께하세요.</h2>
                <div style={{ marginTop: "30px" }}>
                    <Button style={{ background: "#7a5c33", color: "#fff", marginRight: "10px" }}>
                        지금 시작하기
                    </Button>
                    <Button>먼저 보기</Button>
                </div>
            </section>

            <footer
                style={{
                    padding: "50px",
                    backgroundColor: "#fff",
                    borderTop: "1px solid #eee",
                }}
            >
                <p>© 2026 Onjeom. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default OnePage;
