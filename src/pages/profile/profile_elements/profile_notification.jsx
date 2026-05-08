import Card from "../../../components/common/Card";

const notificationItems = [
    {
        key: "reviewReminder",
        title: "복습 알림",
        description: "간격 반복 학습 주기에 맞춘 알림",
    },
    {
        key: "goalEncouragement",
        title: "목표 달성 독려",
        description: "아카이브 기록 유지를 위한 학습 알림",
    },
    {
        key: "weaknessReport",
        title: "취약점 분석 보고서",
        description: "격주 단위 언어 학습 보완점 리포트",
    },
    {
        key: "achievementMessage",
        title: "성취 및 성장 메시지",
        description: "마일스톤 달성 및 성과 보상 알림",
    },
];

function ProfileNotification({ user, onUpdateSettings }) {
    const notificationSettings = user.notificationSettings ?? {};

    const handleToggle = (key) => {
        const updatedNotificationSettings = {
            ...notificationSettings,
            [key]: !notificationSettings[key],
        };

        if (onUpdateSettings) {
            onUpdateSettings({
                notificationSettings: updatedNotificationSettings,
            });
        }
    };

    return (
        <Card className="profile-notification-card">
            <h3 className="profile-notification-title">
                알림 유형 설정
            </h3>

            <div className="profile-notification-list">
                {notificationItems.map((item) => {
                    const isActive = Boolean(notificationSettings[item.key]);

                    return (
                        <div
                            className="profile-notification-item"
                            key={item.key}
                        >
                            <div>
                                <strong>{item.title}</strong>
                                <p>{item.description}</p>
                            </div>

                            <button
                                type="button"
                                className={`profile-toggle-button ${
                                    isActive ? "active" : ""
                                }`}
                                onClick={() => handleToggle(item.key)}
                                aria-label={`${item.title} 설정 변경`}
                            >
                                <span></span>
                            </button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

export default ProfileNotification;