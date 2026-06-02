import { useEffect, useRef, useState } from "react";
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
    markTodayStudySubmitted,
    skipTodayStudyItem,
    startTodayStudy,
} from "../../../data/services/studyService";
import {
    saveLatestResponseContext,
    submitResponse,
} from "../../../data/services/responseService";
import { askAiTutor } from "../../../data/services/aiTutorService";

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

function formatElapsedTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;

    return `${String(minute).padStart(2, "0")}:${String(second).padStart(2, "0")}`;
}

function LearnerStudy() {
    const navigate = useNavigate();
    const timerRef = useRef(0);

    const [studyData, setStudyData] = useState(null);
    const [answer, setAnswer] = useState("");
    const [chatInput, setChatInput] = useState("");
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSkipping, setIsSkipping] = useState(false);
    const [isAskingTutor, setIsAskingTutor] = useState(false);
    const [error, setError] = useState("");
    const [tutorError, setTutorError] = useState("");
    const [chatMessages, setChatMessages] = useState([
        {
            id: "ai-default",
            role: "ai",
            text: "질문을 보내면 지문과 문제를 바탕으로 풀이 방향을 설명합니다.",
            references: [],
        },
    ]);

    const answerMaxLength = 500;
    const answerLength = answer.length;

    useEffect(() => {
        let ignore = false;

        async function loadTodayStudy() {
            setError("");

            try {
                const nextStudyData = await getTodayStudySession();

                if (ignore) {
                    return;
                }

                if (nextStudyData?.itemId && nextStudyData.status === "PENDING") {
                    await startTodayStudy(nextStudyData.itemId);

                    const startedStudyData = await getTodayStudySession();

                    if (ignore) {
                        return;
                    }

                    setStudyData(startedStudyData);
                } else {
                    setStudyData(nextStudyData);
                }

                setAnswer("");
                setElapsedSeconds(0);
                timerRef.current = Date.now();
            } catch (loadError) {
                if (!ignore) {
                    setError(loadError.message);
                }
            }
        }

        loadTodayStudy();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (!studyData) {
            return undefined;
        }

        const intervalId = window.setInterval(() => {
            const diffInSeconds = Math.max(
                0,
                Math.floor((Date.now() - timerRef.current) / 1000)
            );

            setElapsedSeconds(diffInSeconds);
        }, 1000);

        return () => window.clearInterval(intervalId);
    }, [studyData]);

    const handleSubmit = async () => {
        if (!studyData || isSubmitting || isSkipping) {
            return;
        }

        if (!answer.trim()) {
            setError("답변 내용을 입력해 주세요.");
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const response = await submitResponse({
                problemId: studyData.problemId,
                answerText: answer.trim(),
                responseTimeSec: Math.max(0, elapsedSeconds),
                curriculumItemId: studyData.curriculumItemId,
                readingType: studyData.readingType,
            });

            await markTodayStudySubmitted({
                itemId: studyData.itemId,
            });

            saveLatestResponseContext({
                responseId: response.id,
                problemId: response.problemId,
                curriculumItemId: studyData.curriculumItemId,
            });

            navigate("/today/result");
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSkip = async () => {
        if (!studyData?.itemId || isSubmitting || isSkipping) {
            return;
        }

        setIsSkipping(true);
        setError("");

        try {
            await skipTodayStudyItem(studyData.itemId);

            const nextStudyData = await getTodayStudySession();

            setStudyData(nextStudyData);
            setAnswer("");
            setElapsedSeconds(0);
            timerRef.current = Date.now();
        } catch (skipError) {
            setError(skipError.message);
        } finally {
            setIsSkipping(false);
        }
    };

    const handleAskAI = () => {
        setChatInput("이 지문에서 주제를 찾는 방법이 뭔가요?");
    };

    const handleSendQuestion = async () => {
        const trimmedQuestion = chatInput.trim();

        if (!trimmedQuestion || !studyData || isAskingTutor) {
            return;
        }

        const userMessage = {
            id: `user-${Date.now()}`,
            role: "user",
            text: trimmedQuestion,
        };

        setChatMessages((prev) => [...prev, userMessage]);
        setChatInput("");
        setTutorError("");
        setIsAskingTutor(true);

        try {
            const result = await askAiTutor({
                question: trimmedQuestion,
                problemId: studyData.problemId,
                passageText: studyData.passageText,
            });

            setChatMessages((prev) => [
                ...prev,
                {
                    id: `ai-${Date.now()}`,
                    role: "ai",
                    text: result?.answer || "응답을 생성하지 못했습니다.",
                    references: Array.isArray(result?.references)
                        ? result.references
                        : [],
                },
            ]);
        } catch (askError) {
            setTutorError(askError.message);
        } finally {
            setIsAskingTutor(false);
        }
    };

    if (error && !studyData) {
        return <div className="learner-study-page">{error}</div>;
    }

    if (!studyData) {
        return (
            <div className="learner-study-page">
                <Card className="study-empty-card">
                    <h2>오늘 예정된 학습이 없습니다.</h2>
                    <p>커리큘럼 항목이 모두 완료되었거나 아직 배정되지 않았습니다.</p>
                    <Button
                        variant="primary"
                        size="large"
                        onClick={() => navigate("/dashboard")}
                    >
                        대시보드로 이동
                    </Button>
                </Card>
            </div>
        );
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
                            {"★".repeat(studyData.difficulty || 0)}
                            {"☆".repeat(5 - (studyData.difficulty || 0))}
                        </div>
                    </div>
                </div>

                <div className="study-header-right">
                    <div className="study-timer">
                        <Clock size={18} strokeWidth={2.2} />
                        <span>{formatElapsedTime(elapsedSeconds)}</span>
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
                            <span className="study-question-icon">?</span>
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
                                placeholder="지문의 내용을 바탕으로 답변을 작성해 주세요."
                                variant="box"
                                className="study-answer-input"
                            />

                            <span className="study-answer-count">
                                {answerLength} / {answerMaxLength}
                            </span>
                        </div>

                        {error ? <p className="study-submit-error">{error}</p> : null}

                        <Button
                            variant="dark"
                            size="large"
                            fullWidth
                            className="study-submit-button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || isSkipping}
                        >
                            {isSubmitting ? "제출 중..." : "정답 제출하기"}
                        </Button>

                        <Button
                            variant="outline"
                            size="large"
                            fullWidth
                            className="study-skip-button"
                            onClick={handleSkip}
                            disabled={isSubmitting || isSkipping}
                        >
                            {isSkipping ? "건너뛰는 중..." : "오늘 항목 건너뛰기"}
                        </Button>

                        <Button
                            variant="outline"
                            size="large"
                            fullWidth
                            className="study-ai-help-button"
                            onClick={handleAskAI}
                        >
                            <HelpCircle size={18} strokeWidth={2.2} />
                            AI에게 질문하기
                        </Button>
                    </Card>

                    <Card className="study-ai-card">
                        <div className="study-ai-title-row">
                            <div>
                                <Sparkles size={20} strokeWidth={2.2} />
                                <span>AI 튜터</span>
                            </div>

                            <span className="study-ai-status-dot"></span>
                        </div>

                        <div className="study-chat-thread">
                            {chatMessages.map((message) =>
                                message.role === "user" ? (
                                    <div key={message.id} className="study-chat-user">
                                        {message.text}
                                    </div>
                                ) : (
                                    <div key={message.id} className="study-chat-ai">
                                        <p>{message.text}</p>

                                        {message.references?.length ? (
                                            <div className="study-chat-references">
                                                {message.references.map((reference) => (
                                                    <span key={reference}>
                                                        {reference}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                    </div>
                                )
                            )}

                            {isAskingTutor ? (
                                <div className="study-chat-ai loading">
                                    <p>AI 튜터가 답변을 준비하는 중입니다.</p>
                                </div>
                            ) : null}
                        </div>

                        {tutorError ? (
                            <p className="study-submit-error">{tutorError}</p>
                        ) : null}

                        <div className="study-chat-input-row">
                            <Input
                                name="chatInput"
                                value={chatInput}
                                onChange={(event) =>
                                    setChatInput(event.target.value)
                                }
                                placeholder="AI 튜터에게 질문을 입력하세요."
                                variant="box"
                                className="study-chat-input"
                            />

                            <button
                                type="button"
                                className="study-chat-send-button"
                                onClick={handleSendQuestion}
                                disabled={isAskingTutor}
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
