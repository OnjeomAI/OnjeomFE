import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import { getUserByType, updateProfile, updateSettings } from "../../data/services/learnerService";
import { getMyProfile, updateMyProfile } from "../../data/services/userService";
import { applyAppFontSize } from "../../utils/fontSize";
import ProfileUser from "./profile_elements/profile_user.jsx";
import ProfileSecurity from "./profile_elements/profile_security.jsx";
import ProfileSettings from "./profile_elements/profile_setting.jsx";
import ProfileNotification from "./profile_elements/profile_notification.jsx";

function Profile({ type = "learner" }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        let ignore = false;

        async function loadUser() {
            setIsLoading(true);
            setErrorMessage("");

            try {
                const nextUser =
                    type === "learner"
                        ? await getMyProfile(type)
                        : await getUserByType(type);

                if (!ignore) {
                    setUser(nextUser);
                }
            } catch (error) {
                if (!ignore) {
                    setErrorMessage(error.message || "프로필 정보를 불러오지 못했습니다.");
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        }

        loadUser();

        return () => {
            ignore = true;
        };
    }, [type]);

    const handleUpdateProfile = async (updatedProfile) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const updatedUser =
                type === "learner"
                    ? await updateMyProfile(type, {
                          nickname: updatedProfile.nickname ?? user.nickname,
                          dailyGoal: user.dailyGoal,
                          alarmEnabled: user.alarmEnabled,
                      })
                    : await updateProfile(type, updatedProfile);

            setUser(updatedUser);
            setSuccessMessage("프로필 정보를 저장했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "프로필 저장에 실패했습니다.");
        }
    };

    const handleUpdateSettings = async (updatedSettings) => {
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const updatedUser =
                type === "learner"
                    ? await updateMyProfile(type, {
                          nickname: user.nickname,
                          dailyGoal: updatedSettings.dailyGoal ?? user.dailyGoal ?? 10,
                          alarmEnabled:
                              updatedSettings.alarmEnabled ??
                              (updatedSettings.notificationSettings
                                  ? Object.values(updatedSettings.notificationSettings).some(Boolean)
                                  : user.alarmEnabled),
                      })
                    : await updateSettings(type, updatedSettings);

            const nextUser = {
                ...updatedUser,
                fontSize: updatedSettings.fontSize ?? updatedUser.fontSize,
            };

            setUser(nextUser);

            if (nextUser.fontSize) {
                applyAppFontSize(nextUser.fontSize);
            }

            setSuccessMessage("설정을 저장했습니다.");
        } catch (error) {
            setErrorMessage(error.message || "설정 저장에 실패했습니다.");
        }
    };

    if (isLoading) {
        return <div className="profile-page">프로필 정보를 불러오는 중입니다.</div>;
    }

    if (errorMessage && !user) {
        return <div className="profile-page">{errorMessage}</div>;
    }

    if (!user) {
        return <div className="profile-page">프로필 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="profile-page">
            <PageHeader
                title="내 프로필 및 환경설정"
                type={type}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            {successMessage ? <p className="auth-success-message">{successMessage}</p> : null}
            {errorMessage ? <p className="auth-login-error">{errorMessage}</p> : null}

            <div className="profile-layout">
                <section className="profile-left-section">
                    <p className="profile-section-title">회원 및 인증 정보</p>
                    <ProfileUser user={user} onUpdateProfile={handleUpdateProfile} />
                    <ProfileSecurity type={type} />
                </section>

                <section className="profile-right-section">
                    <p className="profile-section-title">
                        {type === "admin" ? "관리자 설정" : "학습 설정"}
                    </p>
                    <ProfileSettings
                        type={type}
                        user={user}
                        onUpdateSettings={handleUpdateSettings}
                    />
                    {type === "learner" ? (
                        <ProfileNotification user={user} onUpdateSettings={handleUpdateSettings} />
                    ) : null}
                </section>
            </div>
        </div>
    );
}

export default Profile;
