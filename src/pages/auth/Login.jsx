import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

function Login() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate("/dashboard");
    };
    const handleSignUpClick = () => {
        navigate("/signup");
    };
    return (
        <div style={{ padding: "40px" }}>
            <h1>로그인 페이지(테스트)</h1>
            <Button onClick={handleLoginClick}>
                로그인
            </Button>
            <br/><br/>
            <Button variant="outline" onClick={handleSignUpClick}>
                회원가입
            </Button>
            <br/><br/>
        </div>
    );
}

export default Login;