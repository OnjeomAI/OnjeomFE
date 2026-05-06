import {useNavigate} from "react-router-dom";
import Button from "../../components/common/Button.jsx";

function Landing() {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate("/login");
    };

    return (
        <div style={{ padding: "40px" }}>
            <h1>랜딩 페이지</h1>
            <Button onClick={handleStartClick}>
                시작하기
            </Button>
            <br/><br/>
        </div>
    );
}

export default Landing;