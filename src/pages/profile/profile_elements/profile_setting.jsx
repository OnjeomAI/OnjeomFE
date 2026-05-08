import { useState } from "react";
import Card from "../../../components/common/Card";

function getInitialFontSize(user) {
    if (typeof user.fontSize === "number") {
        return user.fontSize;
    }
    return 100;
}

function ProfileSetting({ type = "learner", user, onUpdateSettings }) {
    const [dailyGoal, setDailyGoal] = useState(user.dailyGoal ?? 10);
    const [fontSize, setFontSize] = useState(getInitialFontSize(user));

    const handleGoalChange = (goal) => {
        setDailyGoal(goal);

        if (onUpdateSettings) {
            onUpdateSettings({
                dailyGoal: goal,
                fontSize,
            });
        }
    };

    const handleFontSizeChange = (event) => {
        const newFontSize = Number(event.target.value);

        setFontSize(newFontSize);

        const updatedSettings = {
            fontSize: newFontSize,
        };

        if (type === "learner") {
            updatedSettings.dailyGoal = dailyGoal;
        }

        if (onUpdateSettings) {
            onUpdateSettings(updatedSettings);
        }
    };

    return (
        <div
            className={
                type === "admin"
                    ? "profile-setting-row admin-setting-row"
                    : "profile-setting-row"
            }
        >
            {type === "learner" && (
                <Card className="profile-goal-card">
                    <h3 className="profile-setting-card-title">
                        일일 학습 목표
                    </h3>

                    <p className="profile-setting-card-description">
                        하루에 마스터할 구절 수
                    </p>

                    <div className="profile-goal-buttons">
                        {[5, 10, 20].map((goal) => (
                            <button
                                key={goal}
                                type="button"
                                className={dailyGoal === goal ? "active" : ""}
                                onClick={() => handleGoalChange(goal)}
                            >
                                {goal}개
                            </button>
                        ))}
                    </div>
                </Card>
            )}

            <Card className="profile-display-card">
                <h3 className="profile-setting-card-title">
                    화면 표시 설정
                </h3>

                <p className="profile-setting-card-description">
                    텍스트 글자 크기
                </p>

                <div className="profile-font-slider-area">
                    <div className="profile-font-label-row">
                        <span>작게</span>
                        <span className="profile-font-size-value">
                            {fontSize}%
                        </span>
                        <span>크게</span>
                    </div>

                    <input
                        className="profile-font-slider"
                        type="range"
                        min="80"
                        max="120"
                        step="1"
                        value={fontSize}
                        onChange={handleFontSizeChange}
                    />
                </div>
            </Card>
        </div>
    );
}

export default ProfileSetting;