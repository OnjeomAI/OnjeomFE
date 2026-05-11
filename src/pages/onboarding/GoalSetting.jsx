import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../components/common/Button";
import {
    getMockUserByType,
    updateMockSettings,
} from "../../data/mockData";

const goalOptions = [
    {
        value: 5,
        level: "레벨 01",
        title: "5문제",
        description: "가볍게",
        recommended: false,
    },
    {
        value: 10,
        level: "레벨 02",
        title: "10문제",
        description: "적당히",
        recommended: true,
    },
    {
        value: 20,
        level: "레벨 03",
        title: "20문제",
        description: "집중적으로",
        recommended: false,
    },
];

function GoalSetting() {
    const navigate = useNavigate();

    const learner = getMockUserByType("learner");

    const [selectedGoal, setSelectedGoal] = useState(
        learner.dailyGoal || 10
    );

    const handleGoalSelect = (goalValue) => {
        setSelectedGoal(goalValue);

        updateMockSettings("learner", {
            dailyGoal: goalValue,
        });
    };

    const handleNext = () => {
        updateMockSettings("learner", {
            dailyGoal: selectedGoal,
        });

        navigate("/dashboard");
    };

    return (
        <div className="goal-setting-page">
            <header className="goal-setting-header">
                <div className="goal-setting-logo">
                    <span>온점</span>
                    <span className="goal-setting-logo-dot"></span>
                </div>
            </header>

            <main className="goal-setting-main">
                <section className="goal-setting-title-section">
                    <p className="goal-setting-step">
                        단계 1 : 목표 설정
                    </p>

                    <div className="goal-setting-progress">
                        <div className="goal-setting-progress-fill"></div>
                    </div>

                    <h1>
                        하루에 몇 문제를
                        <br />
                        풀고 싶으신가요?
                    </h1>
                </section>

                <section className="goal-option-list">
                    {goalOptions.map((option) => {
                        const isSelected = selectedGoal === option.value;

                        return (
                            <button
                                key={option.value}
                                type="button"
                                className={
                                    isSelected
                                        ? "goal-option-card selected"
                                        : "goal-option-card"
                                }
                                onClick={() => handleGoalSelect(option.value)}
                                aria-pressed={isSelected}
                            >
                                {option.recommended && (
                                    <span className="goal-recommend-badge">
                                        추천 목표
                                    </span>
                                )}

                                <div className="goal-option-text">
                                    <span className="goal-option-level">
                                        {option.level}
                                    </span>

                                    <div className="goal-option-main-text">
                                        <strong>{option.title}</strong>
                                        <span>
                                            &#40;{option.description}&#41;
                                        </span>
                                    </div>
                                </div>

                                <span className="goal-option-check">
                                    {isSelected && "✓"}
                                </span>
                            </button>
                        );
                    })}
                </section>

                <section className="goal-setting-visual">
                    <div className="goal-book book-left"></div>
                    <div className="goal-book book-center"></div>
                    <div className="goal-book book-right"></div>
                    <div className="goal-cup"></div>
                    <div className="goal-shadow"></div>
                </section>

                <Button
                    variant="primary"
                    size="large"
                    className="goal-setting-next-button"
                    onClick={handleNext}
                >
                    다음 단계로
                    <span>›</span>
                </Button>

                <p className="goal-setting-save-text">
                    학습 진행 상황은 온점 디지털 보관소에 자동으로 저장됩니다
                </p>
            </main>
        </div>
    );
}

export default GoalSetting;