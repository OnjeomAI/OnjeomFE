function LearnerDashboard() {
    return (
        <div>
            <h1>학습자 대시보드</h1>
            <p>스크롤 테스트용 페이지</p>

            {Array.from({ length: 20 }).map((_, index) => (
                <div
                    key={index}
                    style={{
                        height: "180px",
                        marginBottom: "24px",
                        backgroundColor: "#efede8",
                        border: "1px solid #dedbd3",
                        padding: "24px",
                        fontSize: "20px",
                    }}
                >
                    테스트 박스 {index + 1}
                </div>
            ))}
        </div>
    );
}

export default LearnerDashboard;