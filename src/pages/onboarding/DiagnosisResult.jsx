import { useNavigate } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const radarScores = [
    { label: "사실적", score: 85, x: 200, y: 58 },
    { label: "추론적", score: 92, x: 330, y: 150 },
    { label: "비판적", score: 68, x: 282, y: 300 },
    { label: "논리적", score: 74, x: 118, y: 300 },
    { label: "어휘력", score: 78, x: 70, y: 150 },
];

const strengths = [
    {
        title: "추론적 독해",
        description: "문맥을 통한 정보 추론 능력이 뛰어납니다.",
        type: "strength",
    },
    {
        title: "사실적 분석",
        description: "텍스트의 명시적 정보를 정확하게 파악합니다.",
        type: "strength",
    },
];

const weaknesses = [
    {
        title: "비판적 사고",
        description: "비판적 시각에서의 평가 능력을 보완해야 합니다.",
        type: "weakness",
    },
    {
        title: "논리적 구조화",
        description: "글의 논리적 구조를 재구성하는 연습이 필요합니다.",
        type: "weakness",
    },
];

const curriculumSteps = [
    {
        step: "단계 01",
        title: "사실적 독해",
        description: "사실적 독해의 견고한 기초를 다집니다.",
    },
    {
        step: "단계 02",
        title: "추론적 독해",
        description: "숨겨진 의미를 찾아내는 추론 훈련입니다.",
    },
    {
        step: "단계 03",
        title: "비판적 독해",
        description: "관점의 한계를 분석하는 심화 단계입니다.",
    },
    {
        step: "단계 04",
        title: "창의적 독해",
        description: "자신만의 새로운 가치를 생산하는 독해입니다.",
    },
];

function DiagnosisResult() {
    const navigate = useNavigate();

    const handleStartLearning = () => {
        navigate("/onboarding/goal");
    };

    const radarPointString = radarScores
        .map((item) => `${item.x},${item.y}`)
        .join(" ");

    return (
        <div className="diagnosis-result-page">
            <main className="diagnosis-result-main">
                <section className="diagnosis-result-hero">
                    <span className="diagnosis-result-badge">분석 완료</span>

                    <h1>진단이 완료되었습니다!</h1>

                    <p>
                        당신의 독해 아카이브를 분석했습니다. 정밀 진단 결과와
                        온점이 설계한 최적의 커리큘럼을 확인하세요.
                    </p>
                </section>

                <section className="diagnosis-result-summary">
                    <Card className="diagnosis-radar-card">
                        <div className="radar-card-label">
                            <span>문해력 레이더</span>
                        </div>

                        <div className="radar-chart-wrap">
                            <svg
                                className="radar-chart"
                                viewBox="0 0 400 360"
                                role="img"
                                aria-label="문해력 레이더 차트"
                            >
                                <polygon
                                    points="200,42 348,150 292,320 108,320 52,150"
                                    className="radar-grid"
                                />
                                <polygon
                                    points="200,92 300,165 262,282 138,282 100,165"
                                    className="radar-grid"
                                />
                                <polygon
                                    points="200,142 252,180 232,244 168,244 148,180"
                                    className="radar-grid"
                                />

                                <line x1="200" y1="180" x2="200" y2="42" />
                                <line x1="200" y1="180" x2="348" y2="150" />
                                <line x1="200" y1="180" x2="292" y2="320" />
                                <line x1="200" y1="180" x2="108" y2="320" />
                                <line x1="200" y1="180" x2="52" y2="150" />

                                <polygon
                                    points={radarPointString}
                                    className="radar-score-area"
                                />

                                {radarScores.map((item) => (
                                    <circle
                                        key={item.label}
                                        cx={item.x}
                                        cy={item.y}
                                        r="7"
                                        className="radar-score-point"
                                    />
                                ))}
                            </svg>

                            <div className="radar-score-label radar-score-top">
                                <span>사실적</span>
                                <strong>85</strong>
                            </div>

                            <div className="radar-score-label radar-score-right">
                                <span>추론적</span>
                                <strong>92</strong>
                            </div>

                            <div className="radar-score-label radar-score-bottom-right">
                                <span>비판적</span>
                                <strong>68</strong>
                            </div>

                            <div className="radar-score-label radar-score-bottom-left">
                                <span>논리적</span>
                                <strong>74</strong>
                            </div>

                            <div className="radar-score-label radar-score-left">
                                <span>어휘력</span>
                                <strong>78</strong>
                            </div>
                        </div>

                        <div className="diagnosis-level-box">
                            <span>종합 숙련도</span>
                            <strong>중급</strong>
                            <em>LEVEL 03</em>
                        </div>
                    </Card>

                    <div className="diagnosis-feedback-column">
                        <div className="diagnosis-feedback-group">
                            <h2>주요 강점</h2>

                            {strengths.map((item) => (
                                <Card
                                    key={item.title}
                                    className="diagnosis-feedback-card strength"
                                >
                                    <span className="feedback-icon">✹</span>

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="diagnosis-feedback-group">
                            <h2>보완이 필요한 영역</h2>

                            {weaknesses.map((item) => (
                                <Card
                                    key={item.title}
                                    className="diagnosis-feedback-card weakness"
                                >
                                    <span className="feedback-icon">⌘</span>

                                    <div>
                                        <h3>{item.title}</h3>
                                        <p>{item.description}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                <Card className="diagnosis-curriculum-card">
                    <div className="curriculum-card-header">
                        <div>
                            <span>개인 맞춤형 커리큘럼</span>
                            <h2>당신만을 위한 4단계 학습 경로</h2>
                        </div>

                        <div className="curriculum-period">
                            <span>예상 학습 기간</span>
                            <strong>12주</strong>
                        </div>
                    </div>

                    <div className="curriculum-step-list">
                        {curriculumSteps.map((item, index) => (
                            <Card
                                key={item.step}
                                className={
                                    index === 0
                                        ? "curriculum-step-card active"
                                        : "curriculum-step-card"
                                }
                            >
                                <span>{item.step}</span>
                                <h3>{item.title}</h3>
                                <p>{item.description}</p>
                            </Card>
                        ))}
                    </div>
                </Card>

                <div className="diagnosis-result-action">
                    <Button
                        variant="primary"
                        size="large"
                        className="diagnosis-start-button"
                        onClick={handleStartLearning}
                    >
                        학습 시작하기
                    </Button>
                </div>
            </main>

            <footer className="diagnosis-result-footer">
                <div className="diagnosis-result-logo">
                    <span className="diagnosis-result-logo-mark"></span>

                    <div>
                        <strong>온점</strong>
                        <p>지식의 마침표</p>
                    </div>
                </div>

                <span>© 2024 ONJEOM AI. ALL RIGHTS RESERVED.</span>
            </footer>
        </div>
    );
}

export default DiagnosisResult;