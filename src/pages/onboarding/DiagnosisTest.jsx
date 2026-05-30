import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCircle, Clock3, X } from "lucide-react";

import Input from "../../components/common/Input";
import {
    startDiagnosisSession,
    submitDiagnosisAnswer,
} from "../../data/services/diagnosisService";
import { markDiagnosisCompleted } from "../../data/services/learnerService";

function formatElapsedTime(seconds) {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;

    return `${minute}:${String(second).padStart(2, "0")}`;
}

function DiagnosisTest() {
    const navigate = useNavigate();
    const timerRef = useRef(0);
    const hasStartedRef = useRef(false);

    const [questionIndex, setQuestionIndex] = useState(1);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [answer, setAnswer] = useState("");
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (hasStartedRef.current) {
            return undefined;
        }

        hasStartedRef.current = true;

        let ignore = false;

        async function loadDiagnosis() {
            setIsLoading(true);
            setError("");

            try {
                const session = await startDiagnosisSession();

                if (ignore) {
                    return;
                }

                setQuestionIndex(session.questionIndex);
                setCurrentQuestion(session.question);
                setAnswer("");
                setElapsedSeconds(0);
                timerRef.current = Date.now();
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

        loadDiagnosis();

        return () => {
            ignore = true;
        };
    }, []);

    useEffect(() => {
        if (!currentQuestion) {
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
    }, [currentQuestion]);

    const minLength = useMemo(() => {
        return currentQuestion?.questionText?.length > 80 ? 50 : 20;
    }, [currentQuestion]);

    const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
    };

    const handleSubmit = async () => {
        if (!currentQuestion || isSubmitting) {
            return;
        }

        if (answer.trim().length < minLength) {
            alert(`최소 ${minLength}자 이상 작성해 주세요.`);
            return;
        }

        setIsSubmitting(true);
        setError("");

        try {
            const result = await submitDiagnosisAnswer({
                problemId: currentQuestion.problemId,
                answerText: answer.trim(),
                responseTimeSec: Math.max(1, elapsedSeconds),
            });

            if (result.completed) {
                await markDiagnosisCompleted();
                navigate("/onboarding/result", { replace: true });
                return;
            }

            setQuestionIndex(result.questionIndex);
            setCurrentQuestion(result.question);
            setAnswer("");
            setElapsedSeconds(0);
            timerRef.current = Date.now();
        } catch (submitError) {
            setError(submitError.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        navigate(-1);
    };

    if (isLoading) {
        return (
            <div className="diagnosis-test-page">
                <div className="diagnosis-empty">진단 문제를 불러오는 중입니다.</div>
            </div>
        );
    }

    if (error && !currentQuestion) {
        return (
            <div className="diagnosis-test-page">
                <div className="diagnosis-empty">{error}</div>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className="diagnosis-test-page">
                <div className="diagnosis-empty">진단 문제를 찾을 수 없습니다.</div>
            </div>
        );
    }

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
                            <div className="diagnosis-progress-fill indeterminate"></div>
                        </div>

                        <span className="diagnosis-progress-text">
                            현재 문항 {questionIndex}
                        </span>
                    </div>
                </div>

                <div className="diagnosis-header-right">
                    <div className="diagnosis-time-box">
                        <Clock3 size={16} className="diagnosis-time-icon" />
                        <span>응답 시간 {formatElapsedTime(elapsedSeconds)}</span>
                    </div>

                    <button
                        className="diagnosis-close-button"
                        type="button"
                        onClick={handleClose}
                        aria-label="닫기"
                    >
                        <X size={28} />
                    </button>
                </div>
            </header>

            <main className="diagnosis-main">
                <section className="diagnosis-passage-section">
                    <div className="diagnosis-passage-inner">
                        <h1>{currentQuestion.title}</h1>

                        {currentQuestion.passageParagraphs.map(
                            (paragraph, paragraphIndex) => (
                                <p key={paragraphIndex}>{paragraph}</p>
                            )
                        )}
                    </div>
                </section>

                <section className="diagnosis-question-section">
                    <div className="diagnosis-question-inner">
                        <div className="diagnosis-question-label">
                            질문 {String(questionIndex).padStart(2, "0")}
                        </div>

                        <h2>{currentQuestion.questionText}</h2>

                        <div className="diagnosis-answer-wrap">
                            <Input
                                multiline
                                name="diagnosisAnswer"
                                value={answer}
                                onChange={handleAnswerChange}
                                placeholder="지문을 바탕으로 자신의 생각을 구체적으로 작성해 주세요."
                                variant="box"
                                className="diagnosis-answer"
                                disabled={isSubmitting}
                            />

                            <span className="diagnosis-min-text">
                                최소 {minLength}자 이상 작성
                            </span>
                        </div>

                        <button
                            className="diagnosis-submit-button"
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "제출 중..." : "답변 제출"}
                        </button>

                        {error ? (
                            <div className="diagnosis-inline-error">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        ) : null}

                        <div className="diagnosis-info-box">
                            <AlertCircle size={16} className="diagnosis-info-icon" />
                            <p>
                                제출 시 다음 문항으로 이동합니다. 문항별 소요 시간은
                                서버에 함께 전달됩니다.
                            </p>
                        </div>

                        <div className="diagnosis-footer">
                            <span>온점 AI 진단</span>
                            <span>Diagnostic Flow</span>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default DiagnosisTest;
