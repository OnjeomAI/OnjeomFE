import { useState } from "react";
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

const studyData = {
    sessionLabel: "진행 중인 세션",
    title: "학습 3일차 - 문항 3",
    category: "추론형",
    difficulty: 4,
    timeLeft: "14:52",

    passageTitle: "디지털 시대의 아카이브: 기억의 보존과 알고리즘의 선택",

    passageParagraphs: [
        {
            id: "p1",
            text: "디지털 기술의 발전은 인류가 정보를 기록하고 저장하는 방식을 근본적으로 변화시켰다. 과거의 아카이브가 물리적 공간의 제약을 받는 종이 문서와 유물 위주였다면, 현대의 디지털 아카이브는 방대한 양의 데이터를 빛의 속도로 복제하고 공유한다. 그러나 이러한 '무한한 저장'의 가능성이 곧 '완벽한 기억'을 의미하지는 않는다.",
            type: "normal",
        },
        {
            id: "p2",
            text: "오히려 정보의 과잉 속에서 무엇을 남기고 무엇을 삭제할 것인가를 결정하는 주체로서의 인공지능과 알고리즘의 역할이 부각되고 있다. 과거에는 전문 사서나 역사가가 가치 판단의 주체였다면, 이제는 이용자의 데이터 패턴을 분석하여 '중요도'를 할당하는 수치적 모델이 그 자리를 대신하고 있다.",
            type: "highlight",
            highlightText: "주체로서의 인공지능과 알고리즘",
        },
        {
            id: "p3",
            text: "이 지점에서 우리는 중요한 질문을 던져야 한다. 알고리즘이 선택한 기억은 객관적인가? 혹은 그것이 우리가 미래에 보게 될 역사를 편향적으로 재구성하고 있지는 않은가? 디지털 아카이브는 단순한 데이터 저장소가 아니라, 당대의 권력 구조와 기술적 한계가 투영된 유동적인 공간이다.",
            type: "notice",
        },
        {
            id: "p4",
            text: "결국 미래 세대에게 전달될 기록은 기술적 보존의 문제를 넘어, 우리가 현재 어떤 가치관을 가지고 데이터를 선별하느냐에 달려 있다. 인공지능이 도출하는 결과물은 결국 인간이 제공한 데이터의 편향을 학습한 결과이기 때문이다.",
            type: "normal",
        },
    ],

    question:
        "작가가 주장하는 '디지털 아카이브의 주체성 변화'가 미래 역사관에 미칠 수 있는 영향에 대해 지문의 핵심 키워드를 포함하여 서술하시오.",
};

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

    const [answer, setAnswer] = useState("");
    const [chatInput, setChatInput] = useState("");

    const answerMaxLength = 500;
    const answerLength = answer.length;

    const handleSubmit = () => {
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