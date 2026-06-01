import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircle2,
    CircleAlert,
    Sparkles,
} from "lucide-react";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { getLatestDiagnosisResult } from "../../data/services/diagnosisService";
import { markDiagnosisCompleted } from "../../data/services/learnerService";

const scoreMeta = [
    {
        key: "factualScore",
        label: "사실 이해",
        shortFeedback: "지문의 핵심 정보와 명시적 근거를 파악하는 영역입니다.",
    },
    {
        key: "inferentialScore",
        label: "추론 이해",
        shortFeedback: "문맥을 바탕으로 숨은 의미를 연결하는 영역입니다.",
    },
    {
        key: "criticalScore",
        label: "비판 이해",
        shortFeedback: "주장과 근거를 평가하고 관점을 점검하는 영역입니다.",
    },
    {
        key: "logicalScore",
        label: "논리 이해",
        shortFeedback: "생각을 구조적으로 정리하고 전개하는 영역입니다.",
    },
    {
        key: "vocabularyScore",
        label: "어휘 이해",
        shortFeedback: "문맥 속 어휘 의미를 정확히 해석하는 영역입니다.",
    },
];

const curriculumMeta = {
    1: {
        duration: "12주",
        steps: [
            {
                step: "STEP 01",
                title: "사실 이해 정리",
                description: "핵심 정보를 빠르게 찾고 근거를 표시하는 훈련입니다.",
            },
            {
                step: "STEP 02",
                title: "추론 확장",
                description: "직접 쓰이지 않은 의미를 연결해 답을 만드는 훈련입니다.",
            },
            {
                step: "STEP 03",
                title: "비판 점검",
                description: "주장과 근거의 타당성을 비교하며 읽는 훈련입니다.",
            },
            {
                step: "STEP 04",
                title: "서술 완성",
                description: "답안을 논리적으로 구성하고 표현을 다듬는 단계입니다.",
            },
        ],
    },
    2: {
        duration: "10주",
        steps: [
            {
                step: "STEP 01",
                title: "어휘 보강",
                description: "빈도가 높은 학습 어휘를 문맥과 함께 정리합니다.",
            },
            {
                step: "STEP 02",
                title: "사실 요약",
                description: "지문 구조를 짧은 문장으로 요약하는 연습입니다.",
            },
            {
                step: "STEP 03",
                title: "근거 연결",
                description: "답안 문장과 지문 근거를 명확히 연결하는 단계입니다.",
            },
            {
                step: "STEP 04",
                title: "실전 적용",
                description: "제한 시간 안에서 읽기와 서술을 함께 점검합니다.",
            },
        ],
    },
};

function getLevelLabel(level) {
    if (level >= 5) {
        return "상급";
    }

    if (level >= 3) {
        return "중급";
    }

    return "기초";
}

function buildRadarPoints(scores) {
    const centerX = 200;
    const centerY = 180;
    const radius = 138;
    const angleOffset = -Math.PI / 2;

    return scores.map((item, index) => {
        const angle = angleOffset + (Math.PI * 2 * index) / scores.length;
        const ratio = Math.max(0, Math.min(item.score, 100)) / 100;

        return {
            ...item,
            x: centerX + Math.cos(angle) * radius * ratio,
            y: centerY + Math.sin(angle) * radius * ratio,
        };
    });
}

function DiagnosisResult() {
    const navigate = useNavigate();
    const location = useLocation();
    const stateResult = location.state?.diagnosisResult || null;

    const [result, setResult] = useState(stateResult);
    const [isLoading, setIsLoading] = useState(!stateResult);
    const [error, setError] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadResult() {
            if (stateResult) {
                await markDiagnosisCompleted();
                return;
            }

            setIsLoading(true);
            setError("");

            try {
                const nextResult = await getLatestDiagnosisResult();

                if (ignore) {
                    return;
                }

                setResult(nextResult);
                await markDiagnosisCompleted();
            } catch (loadError) {
                if (!ignore) {
                    setError(loadError.message);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadResult();

        return () => {
            ignore = true;
        };
    }, [stateResult]);

    const scores = useMemo(() => {
        if (!result) {
            return [];
        }

        return scoreMeta.map((meta) => ({
            ...meta,
            score: result[meta.key] || 0,
        }));
    }, [result]);

    const radarScores = useMemo(() => buildRadarPoints(scores), [scores]);
    const radarPointString = useMemo(() => {
        return radarScores.map((item) => `${item.x},${item.y}`).join(" ");
    }, [radarScores]);

    const sortedScores = useMemo(() => {
        return [...scores].sort((left, right) => right.score - left.score);
    }, [scores]);

    const strengths = sortedScores.slice(0, 2);
    const weaknesses = [...sortedScores].reverse().slice(0, 2);
    const curriculum = curriculumMeta[result?.curriculumId] || curriculumMeta[1];

    const handleStartLearning = () => {
        navigate("/onboarding/goal");
    };

    if (isLoading) {
        return (
            <div className="diagnosis-result-page">
                <main className="diagnosis-result-main">
                    <section className="diagnosis-result-state">
                        진단 결과를 불러오는 중입니다.
                    </section>
                </main>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div className="diagnosis-result-page">
                <main className="diagnosis-result-main">
                    <section className="diagnosis-result-state error">
                        {error || "조회 가능한 진단 결과가 없습니다."}
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="diagnosis-result-page">
            <main className="diagnosis-result-main">
                <section className="diagnosis-result-hero">
                    <span className="diagnosis-result-badge">분석 완료</span>

                    <h1>진단 결과가 준비되었습니다.</h1>

                    <p>
                        최근 진단 결과를 바탕으로 현재 읽기 역량과 추천 학습
                        경로를 정리했습니다.
                    </p>
                </section>

                <section className="diagnosis-result-summary">
                    <Card className="diagnosis-radar-card">
                        <div className="radar-card-label">
                            <span>문해 역량 프로파일</span>
                        </div>

                        <div className="radar-chart-wrap">
                            <svg
                                className="radar-chart"
                                viewBox="0 0 400 360"
                                role="img"
                                aria-label="문해 역량 레이더 차트"
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
                                        key={item.key}
                                        cx={item.x}
                                        cy={item.y}
                                        r="7"
                                        className="radar-score-point"
                                    />
                                ))}
                            </svg>

                            <div className="radar-score-label radar-score-top">
                                <span>{scores[0].label}</span>
                                <strong>{scores[0].score}</strong>
                            </div>

                            <div className="radar-score-label radar-score-right">
                                <span>{scores[1].label}</span>
                                <strong>{scores[1].score}</strong>
                            </div>

                            <div className="radar-score-label radar-score-bottom-right">
                                <span>{scores[2].label}</span>
                                <strong>{scores[2].score}</strong>
                            </div>

                            <div className="radar-score-label radar-score-bottom-left">
                                <span>{scores[3].label}</span>
                                <strong>{scores[3].score}</strong>
                            </div>

                            <div className="radar-score-label radar-score-left">
                                <span>{scores[4].label}</span>
                                <strong>{scores[4].score}</strong>
                            </div>
                        </div>

                        <div className="diagnosis-level-box">
                            <span>종합 레벨</span>
                            <strong>{getLevelLabel(result.level)}</strong>
                            <em>LEVEL {String(result.level).padStart(2, "0")}</em>
                        </div>

                        <div className="diagnosis-theta-box">
                            <span>Theta</span>
                            <strong>{Number(result.theta || 0).toFixed(1)}</strong>
                        </div>
                    </Card>

                    <div className="diagnosis-feedback-column">
                        <div className="diagnosis-feedback-group">
                            <h2>주요 강점</h2>

                            {strengths.map((item) => (
                                <Card
                                    key={item.key}
                                    className="diagnosis-feedback-card strength"
                                >
                                    <span className="feedback-icon">
                                        <CheckCircle2 size={22} />
                                    </span>

                                    <div>
                                        <h3>{item.label}</h3>
                                        <p>
                                            {item.score}점. {item.shortFeedback}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="diagnosis-feedback-group">
                            <h2>보완이 필요한 영역</h2>

                            {weaknesses.map((item) => (
                                <Card
                                    key={item.key}
                                    className="diagnosis-feedback-card weakness"
                                >
                                    <span className="feedback-icon">
                                        <CircleAlert size={22} />
                                    </span>

                                    <div>
                                        <h3>{item.label}</h3>
                                        <p>
                                            {item.score}점. {item.shortFeedback}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <Card className="diagnosis-feedback-card neutral diagnosis-meta-card">
                            <span className="feedback-icon">
                                <Sparkles size={22} />
                            </span>

                            <div>
                                <h3>추천 커리큘럼</h3>
                                <p>
                                    커리큘럼 ID {result.curriculumId} 기준으로
                                    학습 경로를 연결합니다.
                                </p>
                            </div>
                        </Card>
                    </div>
                </section>

                <Card className="diagnosis-curriculum-card">
                    <div className="curriculum-card-header">
                        <div>
                            <span>개인 맞춤 커리큘럼</span>
                            <h2>다음 학습 단계</h2>
                        </div>

                        <div className="curriculum-period">
                            <span>예상 학습 기간</span>
                            <strong>{curriculum.duration}</strong>
                        </div>
                    </div>

                    <div className="curriculum-step-list">
                        {curriculum.steps.map((item, index) => (
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
                        학습 목표 설정하기
                    </Button>
                </div>
            </main>

            <footer className="diagnosis-result-footer">
                <div className="diagnosis-result-logo">
                    <span className="diagnosis-result-logo-mark"></span>

                    <div>
                        <strong>온점</strong>
                        <p>진단 기반 맞춤 학습</p>
                    </div>
                </div>

                <span>최근 진단 ID {result.diagnosisId}</span>
            </footer>
        </div>
    );
}

export default DiagnosisResult;
