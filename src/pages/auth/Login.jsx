import Button from "../../components/common/Button";

function Login() {
    return (
        <div style={{ padding: "40px" }}>
            <h1>로그인 페이지(테스트)</h1>
            <Button>로그인</Button>
            <br/><br/>
            <Button variant="outline">회원가입</Button>
            <br/><br/>
            <Button variant="dark" fullWidth>
                시작하기
            </Button>
        </div>
    );
}

export default Login;