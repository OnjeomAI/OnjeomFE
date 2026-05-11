let mockDiagnosisSession = {
    sessionId: "diagnosis-session-001",
    status: "IN_PROGRESS",
    completedReason: null,
    currentQuestionId: "question-01",
    totalQuestions: 3,
    remainingTime: 60,

    questions: [
        {
            id: "question-01",
            order: 1,
            title: "디지털 아카이브와 기억의 가소성",
            passageParagraphs: [
                [
                    {
                        text: "기록은 단순히 과거를 보존하는 행위가 아니라, 현재의 관점에서 과거를 재구성하는 역동적인 과정이다. ",
                        highlighted: false,
                    },
                    {
                        text: "현대의 디지털 아카이브는 무한한 확장성을 지닌다.",
                        highlighted: true,
                    },
                    {
                        text: " 하지만 이러한 무한함은 역설적으로 망각의 효율성을 저해한다.",
                        highlighted: false,
                    },
                ],
                [
                    {
                        text: "디지털 기술은 인류의 기억을 외주화했다. 우리는 더 이상 세부적인 사실을 기억하려 애쓰지 않는다. 대신 그 정보가 위치한 경로를 기억한다.",
                        highlighted: false,
                    },
                ],
            ],
            questionText:
                "본문에서 언급된 디지털 아카이브의 특징과 그것이 인간의 기억 방식에 미치는 영향을 서술하시오.",
            minLength: 100,
            answer: "",
            submitted: false,
        },
        {
            id: "question-02",
            order: 2,
            title: "알고리즘 추천과 정보 편향",
            passageParagraphs: [
                [
                    {
                        text: "알고리즘 추천 시스템은 사용자의 취향과 행동을 분석하여 개인에게 적합한 정보를 제공한다.",
                        highlighted: false,
                    },
                ],
                [
                    {
                        text: "하지만 사용자가 이미 선호하는 정보만 반복적으로 접하게 되면 ",
                        highlighted: false,
                    },
                    {
                        text: "정보 편향이 강화될 수 있다.",
                        highlighted: true,
                    },
                ],
            ],
            questionText:
                "알고리즘 추천 시스템이 편리함을 제공하면서도 정보 편향을 강화할 수 있는 이유를 설명하시오.",
            minLength: 100,
            answer: "",
            submitted: false,
        },
        {
            id: "question-03",
            order: 3,
            title: "인공지능과 학습자의 자기주도성",
            passageParagraphs: [
                [
                    {
                        text: "인공지능 기반 학습 시스템은 학습자의 수준과 취약점을 분석하여 맞춤형 학습 경로를 제공한다.",
                        highlighted: false,
                    },
                ],
                [
                    {
                        text: "그러나 학습자가 시스템의 추천에만 의존한다면 ",
                        highlighted: false,
                    },
                    {
                        text: "자기주도적 판단 능력이 약화될 수 있다.",
                        highlighted: true,
                    },
                ],
            ],
            questionText:
                "인공지능 기반 학습 시스템이 학습자에게 주는 장점과 함께 주의해야 할 점을 서술하시오.",
            minLength: 100,
            answer: "",
            submitted: false,
        },
    ],
};

export function getMockDiagnosisSession() {
    return mockDiagnosisSession;
}

export function getCurrentDiagnosisQuestion() {
    return mockDiagnosisSession.questions.find(
        (question) => question.id === mockDiagnosisSession.currentQuestionId
    );
}

export function updateMockDiagnosisAnswer(questionId, answer) {
    mockDiagnosisSession.questions = mockDiagnosisSession.questions.map((question) =>
        question.id === questionId
            ? {
                ...question,
                answer,
            }
            : question
    );

    return getCurrentDiagnosisQuestion();
}

export function submitMockDiagnosisAnswer(questionId, answer) {
    mockDiagnosisSession.questions = mockDiagnosisSession.questions.map((question) =>
        question.id === questionId
            ? {
                ...question,
                answer,
                submitted: true,
            }
            : question
    );

    const currentIndex = mockDiagnosisSession.questions.findIndex(
        (question) => question.id === mockDiagnosisSession.currentQuestionId
    );

    const isLastQuestion =
        currentIndex === mockDiagnosisSession.questions.length - 1;

    if (isLastQuestion) {
        mockDiagnosisSession.status = "COMPLETED";
        mockDiagnosisSession.completedReason = "NORMAL";
        return mockDiagnosisSession;
    }

    const nextQuestion = mockDiagnosisSession.questions[currentIndex + 1];
    mockDiagnosisSession.currentQuestionId = nextQuestion.id;

    return mockDiagnosisSession;
}

export function completeMockDiagnosisSession(reason = "NORMAL") {
    mockDiagnosisSession.status = "COMPLETED";
    mockDiagnosisSession.completedReason = reason;
    mockDiagnosisSession.remainingTime = 0;

    return mockDiagnosisSession;
}