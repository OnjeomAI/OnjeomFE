import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import {
    getUserByType,
    updateProfile,
    updateSettings,
} from "../../data/services/learnerService";

import { applyAppFontSize } from "../../utils/fontSize";

import ProfileUser from "./profile_elements/profile_user.jsx";
import ProfileSecurity from "./profile_elements/profile_security.jsx";
import ProfileSettings from "./profile_elements/profile_setting.jsx";
import ProfileNotification from "./profile_elements/profile_notification.jsx";

function Profile({ type = "learner" }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let ignore = false;

        async function loadUser() {
            const nextUser = await getUserByType(type);

            if (ignore) {
                return;
            }

            setUser(nextUser);
        }

        loadUser();

        return () => {
            ignore = true;
        };
    }, [type]);

    const handleUpdateProfile = async (updatedProfile) => {
        const updatedUser = await updateProfile(type, updatedProfile);

        setUser(updatedUser);

        console.log("업데이트된 프로필 Mock 데이터:", updatedUser);
        alert("프로필 정보가 임시로 업데이트되었습니다.");
    };

    const handleUpdateSettings = async (updatedSettings) => {
        const updatedUser = await updateSettings(type, updatedSettings);

        setUser(updatedUser);

        if (updatedUser.fontSize) {
            applyAppFontSize(updatedUser.fontSize);
        }

        console.log("업데이트된 설정 정보:", updatedUser);
    };

    if (!user) {
        return <div className="profile-page"></div>;
    }

    return (
        <div className="profile-page">
            <PageHeader
                title="내 프로필 및 환경설정"
                type={type}
                userName={user.displayName}
                userLevel={user.levelLabel}
            />

            <div className="profile-layout">
                <section className="profile-left-section">
                    <p className="profile-section-title">신원 및 인증 정보</p>

                    <ProfileUser
                        user={user}
                        onUpdateProfile={handleUpdateProfile}
                    />

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

                    {type === "learner" && (
                        <ProfileNotification
                            user={user}
                            onUpdateSettings={handleUpdateSettings}
                        />
                    )}
                </section>
            </div>
        </div>
    );
}

export default Profile;
