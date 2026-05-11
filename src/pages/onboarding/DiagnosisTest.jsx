import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../../components/common/Input";
import {
    getMockDiagnosisSession,
    getCurrentDiagnosisQuestion,
    updateMockDiagnosisAnswer,
    submitMockDiagnosisAnswer,
    completeMockDiagnosisSession,
} from "../../data/mockDiagnosis";

function formatRemainingTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;

    return `${minute}:${String(second).padStart(2, "0")}`;
}

function DiagnosisTest() {
    const navigate = useNavigate();
    const isFinishedRef = useRef(false);

    const [session, setSession] = useState(() => getMockDiagnosisSession());

    const [currentQuestion, setCurrentQuestion] = useState(() =>
        getCurrentDiagnosisQuestion()
    );

    const [answer, setAnswer] = useState(() => {
        const question = getCurrentDiagnosisQuestion();
        return question?.answer || "";
    });

    const [remainingTime, setRemainingTime] = useState(() => {
        const currentSession = getMockDiagnosisSession();
        return currentSession.remainingTime || 0;
    });

    useEffect(() => {
        if (remainingTime <= 0) {
            return;
        }

        const timerId = setInterval(() => {
            setRemainingTime((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timerId);
                    return 0;
                }

                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, []);

    useEffect(() => {
        if (remainingTime !== 0) {
            return;
        }

        if (!currentQuestion) {
            return;
        }

        if (isFinishedRef.current) {
            return;
        }

        isFinishedRef.current = true;

        updateMockDiagnosisAnswer(currentQuestion.id, answer);

        const completedSession = completeMockDiagnosisSession("TIMEOUT");
        setSession({ ...completedSession });

        navigate("/onboarding/result");
    }, [remainingTime, currentQuestion, answer, navigate]);

    if (!currentQuestion) {
        return (
            <div className="diagnosis-test-page">
                <div className="diagnosis-empty">
                    진단 테스트 문항을 불러올 수 없습니다.
                </div>
            </div>
        );
    }

    const questionNumber = currentQuestion.order;
    const totalQuestions = session.totalQuestions;
    const progressPercent = (questionNumber / totalQuestions) * 100;
    const minLength = currentQuestion.minLength || 100;
    const isAnswerValid = answer.trim().length >= minLength;

    const handleAnswerChange = (event) => {
        const nextAnswer = event.target.value;

        setAnswer(nextAnswer);
        updateMockDiagnosisAnswer(currentQuestion.id, nextAnswer);
    };

    const handleSubmit = () => {
        if (isFinishedRef.current) {
            return;
        }

        if (remainingTime <= 0) {
            return;
        }

        if (!isAnswerValid) {
            alert(`최소 ${minLength}자 이상 작성해주세요.`);
            return;
        }

        const nextSession = submitMockDiagnosisAnswer(
            currentQuestion.id,
            answer
        );

        setSession({ ...nextSession });

        if (nextSession.status === "COMPLETED") {
            isFinishedRef.current = true;
            navigate("/onboarding/result");
            return;
        }

        const nextQuestion = getCurrentDiagnosisQuestion();

        setCurrentQuestion(nextQuestion);
        setAnswer(nextQuestion?.answer || "");
    };

    const handleClose = () => {
        updateMockDiagnosisAnswer(currentQuestion.id, answer);
        alert("현재까지 입력한 답변이 임시 저장되었습니다.");
    };

    return (
        <div className="diagnosis-test-page">
            <header className="diagnosis-header">
                <div className="diagnosis-header-left">
                    <div className="diagnosis-logo-wrap">
                        <span className="diagnosis-logo-dot"></span>
                        <span className="diagnosis-logo-text">온점</span>
                    </div>

                    <div className="diagnosis-header-divider"></div>

                    <div className="diagnosis-progress-wrap">
                        <div className="diagnosis-progress-track">
                            <div
                                className="diagnosis-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>

                        <span className="diagnosis-progress-text">
                            문항 {questionNumber}/{totalQuestions}
                        </span>
                    </div>
                </div>

                <div className="diagnosis-header-right">
                    <div className="diagnosis-time-box">
                        <span className="diagnosis-time-icon">⏱</span>
                        <span>
                            남은 시간 {formatRemainingTime(remainingTime)}
                        </span>
                    </div>

                    <button
                        className="diagnosis-close-button"
                        type="button"
                        onClick={handleClose}
                    >
                        ×
                    </button>
                </div>
            </header>

            <main className="diagnosis-main">
                <section className="diagnosis-passage-section">
                    <div className="diagnosis-passage-inner">
                        <h1>{currentQuestion.title}</h1>

                        {currentQuestion.passageParagraphs.map(
                            (paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>
                                    {paragraph.map((segment, segmentIndex) => (
                                        <span
                                            key={`${paragraphIndex}-${segmentIndex}`}
                                            className={
                                                segment.highlighted
                                                    ? "highlight-text"
                                                    : ""
                                            }
                                        >
                                            {segment.text}
                                        </span>
                                    ))}
                                </p>
                            )
                        )}
                    </div>
                </section>

                <section className="diagnosis-question-section">
                    <div className="diagnosis-question-inner">
                        <div className="diagnosis-question-label">
                            질문 {String(questionNumber).padStart(2, "0")}
                        </div>

                        <h2>{currentQuestion.questionText}</h2>

                        <div className="diagnosis-answer-wrap">
                            <Input
                                multiline
                                name="diagnosisAnswer"
                                value={answer}
                                onChange={handleAnswerChange}
                                placeholder="지문을 읽고 답변을 작성해주세요"
                                variant="box"
                                className="diagnosis-answer"
                                disabled={remainingTime <= 0}
                            />

                            <span className="diagnosis-min-text">
                                최소 {minLength}자 이상 작성
                            </span>
                        </div>

                        <button
                            className="diagnosis-submit-button"
                            type="button"
                            onClick={handleSubmit}
                            disabled={remainingTime <= 0}
                        >
                            답변 제출 및 다음 단계로
                        </button>

                        <div className="diagnosis-info-box">
                            <span className="diagnosis-info-icon">ⓘ</span>
                            <p>
                                진단 테스트 중 이탈 시 현재까지 입력한 내용이
                                저장됩니다. 다시 돌아오시면 이어서 진행하실 수
                                있습니다.
                            </p>
                        </div>

                        <div className="diagnosis-footer">
                            <span>온점 AI 진단 단계</span>
                            <span>버전 1.0.4</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DiagnosisTest;