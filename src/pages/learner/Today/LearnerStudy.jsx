import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    CircleUserRound,
    Clock,
    HelpCircle,
    Send,
    Sparkles,
} from "lucide-react";

import Button from "../../../components/common/Button";
import Card from "../../../components/common/Card";
import Input from "../../../components/common/Input";
import {
    getTodayStudySession,
    getTodayStudyStatus,
    startTodayStudy,
    submitStudyAnswer,
} from "../../../data/services/studyService";

function renderParagraph(paragraph) {
    if (paragraph.type !== "highlight") {
        return paragraph.text;
    }

    const [beforeText, afterText] = paragraph.text.split(paragraph.highlightText);

    return (
        <>
            {beforeText}
            <span className="study-highlight-text">
                {paragraph.highlightText}
            </span>
            {afterText}
        </>
    );
}

function LearnerStudy() {
    const navigate = useNavigate();

    const [studyData, setStudyData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [chatInput, setChatInput] = useState("");

    const answerMaxLength = 500;
    const answerLength = answer.length;

    useEffect(() => {
        let ignore = false;

        async function loadTodayStudy() {
            if (await getTodayStudyStatus() === "COMPLETED") {
                navigate("/today/result", { replace: true });
                return;
            }

            await startTodayStudy();
            const nextStudyData = await getTodayStudySession();

            if (ignore) {
                return;
            }

            setStudyData(nextStudyData);
        }

        loadTodayStudy();

        return () => {
            ignore = true;
        };
    }, [navigate]);

    const handleSubmit = async () => {
        await submitStudyAnswer({
            sessionId: studyData.sessionId,
            questionId: studyData.questionId,
            answerText: answer,
        });

        navigate("/today/result");
    };

    const handleAskAI = () => {
        setChatInput("데이터 패턴 분석이 어떤 의미인가요?");
    };

    const handleSendQuestion = () => {
        if (!chatInput.trim()) {
            return;
        }

        setChatInput("");
    };

    if (!studyData) {
        return <div className="learner-study-page"></div>;
    }

    return (
        <div className="learner-study-page">
            <header className="study-header">
                <div className="study-header-left">
                    <p>{studyData.sessionLabel}</p>

                    <div className="study-title-row">
                        <h1>{studyData.title}</h1>

                        <span className="study-type-badge">
                            {studyData.category}
                        </span>

                        <div className="study-stars" aria-label="난이도 별점">
                            {"★".repeat(studyData.difficulty)}
                            {"☆".repeat(5 - studyData.difficulty)}
                        </div>
                    </div>
                </div>

                <div className="study-header-right">
                    <div className="study-timer">
                        <Clock size={18} strokeWidth={2.2} />
                        <span>{studyData.timeLeft}</span>
                    </div>

                    <div className="study-font-controls">
                        <button type="button">Tt 축소</button>
                        <button type="button">기본</button>
                        <button type="button">Tt 확대</button>
                    </div>

                    <button type="button" className="study-icon-button">
                        <Bell size={22} strokeWidth={2} />
                    </button>

                    <button type="button" className="study-icon-button">
                        <CircleUserRound size={26} strokeWidth={2} />
                    </button>
                </div>
            </header>

            <main className="study-main-layout">
                <Card className="study-passage-card">
                    <div className="study-passage-title">
                        <h2>{studyData.passageTitle}</h2>
                    </div>

                    <div className="study-passage-content">
                        {studyData.passageParagraphs.map((paragraph) => (
                            <p
                                key={paragraph.id}
                                className={
                                    paragraph.type === "notice"
                                        ? "study-notice-paragraph"
                                        : ""
                                }
                            >
                                {renderParagraph(paragraph)}
                            </p>
                        ))}
                    </div>
                </Card>

                <aside className="study-side-area">
                    <Card className="study-answer-card">
                        <div className="study-question-box">
                            <span className="study-question-icon">●</span>
                            <h2>{studyData.question}</h2>
                        </div>

                        <div className="study-answer-input-wrap">
                            <Input
                                multiline
                                name="answer"
                                value={answer}
                                onChange={(event) =>
                                    setAnswer(event.target.value.slice(0, answerMaxLength))
                                }
                                placeholder="지문의 내용을 바탕으로 답변을 작성해주세요"
                                variant="box"
                                className="study-answer-input"
                            />

                            <span className="study-answer-count">
                                {answerLength} / {answerMaxLength}
                            </span>
                        </div>

                        <Button
                            variant="dark"
                            size="large"
                            fullWidth
                            className="study-submit-button"
                            onClick={handleSubmit}
                        >
                            정답 제출하기
                        </Button>

                        <Button
                            variant="outline"
                            size="large"
                            fullWidth
                            className="study-ai-help-button"
                            onClick={handleAskAI}
                        >
                            <HelpCircle size={18} strokeWidth={2.2} />
                            도움이 필요한가요? AI에게 묻기
                        </Button>
                    </Card>

                    <Card className="study-ai-card">
                        <div className="study-ai-title-row">
                            <div>
                                <Sparkles size={20} strokeWidth={2.2} />
                                <span>인공지능 연구 보조</span>
                            </div>

                            <span className="study-ai-status-dot"></span>
                        </div>

                        <div className="study-chat-user">
                            "데이터 패턴 분석"이 어떤 의미인가요?
                        </div>

                        <div className="study-chat-ai">
                            <p>
                                데이터 패턴 분석이란, 알고리즘이 이용자의 클릭,
                                체류 시간, 검색어 등을 수집하여 무엇이 가치 있는
                                정보인지를 스스로 학습하는 과정을 의미합니다.
                            </p>

                            <p>
                                이는 전통적인 사서의 주관적 판단과는 달리 통계적
                                빈도수와 상관관계에 의존하기 때문에, 대중적인
                                정보가 곧 역사적 가치로 오인될 수 있는 위험성을
                                내포하고 있습니다.
                            </p>
                        </div>

                        <div className="study-chat-input-row">
                            <Input
                                name="chatInput"
                                value={chatInput}
                                onChange={(event) =>
                                    setChatInput(event.target.value)
                                }
                                placeholder="추가 질문을 입력하세요..."
                                variant="box"
                                className="study-chat-input"
                            />

                            <button
                                type="button"
                                className="study-chat-send-button"
                                onClick={handleSendQuestion}
                            >
                                <Send size={20} strokeWidth={2.4} />
                            </button>
                        </div>
                    </Card>
                </aside>
            </main>
        </div>
    );
}

export default LearnerStudy;
