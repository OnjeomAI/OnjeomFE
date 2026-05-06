import { useState } from "react";
import Card from "../../../components/common/Card.jsx";
import Input from "../../../components/common/Input.jsx";

function ProfileUser({ user, onUpdateProfile }) {
    const [nickname, setNickname] = useState(user.nickname);
    const [email, setEmail] = useState(user.email);

    const handleSubmit = () => {
        onUpdateProfile({
            nickname,
            email,
        });
    };

    return (
        <Card className="profile-identity-card">
            <div className="profile-user-summary">
                <div className="profile-avatar">
                    <span>👤</span>
                </div>

                <div>
                    <h2>{nickname}</h2>
                    <p>{user.joinedAt}</p>
                </div>
            </div>

            <div className="profile-form">
                <Input
                    label="닉네임"
                    name="nickname"
                    value={nickname}
                    variant="underline"
                    onChange={(event) => setNickname(event.target.value)}
                />

                <Input
                    label="이메일 주소"
                    name="email"
                    type="email"
                    value={email}
                    variant="underline"
                    onChange={(event) => setEmail(event.target.value)}
                />

                <button
                    className="profile-update-button"
                    type="button"
                    onClick={handleSubmit}
                >
                    프로필 정보 업데이트
                </button>
            </div>
        </Card>
    );
}

export default ProfileUser;