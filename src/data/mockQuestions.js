const mockQuestions = [
    {
        id: "diagnosis-question-01",
        type: "essay",
        title: "디지털 아카이브와 기억의 가소성",
        category: "진단",
        difficulty: 3,
        minLength: 100,
        maxLength: 500,
        passage: {
            title: "디지털 아카이브와 기억의 가소성",
            paragraphs: [
                {
                    id: "diagnosis-01-p1",
                    variant: "normal",
                    segments: [
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
                },
                {
                    id: "diagnosis-01-p2",
                    variant: "normal",
                    segments: [
                        {
                            text: "디지털 기술은 인류의 기억을 외주화했다. 우리는 더 이상 세부적인 사실을 기억하려 애쓰지 않는다. 대신 그 정보가 위치한 경로를 기억한다.",
                            highlighted: false,
                        },
                    ],
                },
            ],
        },
        prompt:
            "본문에서 언급된 디지털 아카이브의 특징과 그것이 인간의 기억 방식에 미치는 영향을 서술하시오.",
    },
    {
        id: "diagnosis-question-02",
        type: "essay",
        title: "알고리즘 추천과 정보 편향",
        category: "진단",
        difficulty: 3,
        minLength: 100,
        maxLength: 500,
        passage: {
            title: "알고리즘 추천과 정보 편향",
            paragraphs: [
                {
                    id: "diagnosis-02-p1",
                    variant: "normal",
                    segments: [
                        {
                            text: "알고리즘 추천 시스템은 사용자의 취향과 행동을 분석하여 개인에게 적합한 정보를 제공한다.",
                            highlighted: false,
                        },
                    ],
                },
                {
                    id: "diagnosis-02-p2",
                    variant: "normal",
                    segments: [
                        {
                            text: "하지만 사용자가 이미 선호하는 정보만 반복적으로 접하게 되면 ",
                            highlighted: false,
                        },
                        {
                            text: "정보 편향이 강화될 수 있다.",
                            highlighted: true,
                        },
                    ],
                },
            ],
        },
        prompt:
            "알고리즘 추천 시스템이 편리함을 제공하면서도 정보 편향을 강화할 수 있는 이유를 설명하시오.",
    },
    {
        id: "diagnosis-question-03",
        type: "essay",
        title: "인공지능과 학습자의 자기주도성",
        category: "진단",
        difficulty: 3,
        minLength: 100,
        maxLength: 500,
        passage: {
            title: "인공지능과 학습자의 자기주도성",
            paragraphs: [
                {
                    id: "diagnosis-03-p1",
                    variant: "normal",
                    segments: [
                        {
                            text: "인공지능 기반 학습 시스템은 학습자의 수준과 취약점을 분석하여 맞춤형 학습 경로를 제공한다.",
                            highlighted: false,
                        },
                    ],
                },
                {
                    id: "diagnosis-03-p2",
                    variant: "normal",
                    segments: [
                        {
                            text: "그러나 학습자가 시스템의 추천에만 의존한다면 ",
                            highlighted: false,
                        },
                        {
                            text: "자기주도적 판단 능력이 약화될 수 있다.",
                            highlighted: true,
                        },
                    ],
                },
            ],
        },
        prompt:
            "인공지능 기반 학습 시스템이 학습자에게 주는 장점과 함께 주의해야 할 점을 서술하시오.",
    },
    {
        id: "study-question-03",
        type: "essay",
        title: "디지털 시대의 아카이브",
        category: "추론형",
        difficulty: 4,
        minLength: 0,
        maxLength: 500,
        passage: {
            title: "디지털 시대의 아카이브: 기억의 보존과 알고리즘의 선택",
            paragraphs: [
                {
                    id: "p1",
                    variant: "normal",
                    segments: [
                        {
                            text: "디지털 기술의 발전은 인류가 정보를 기록하고 저장하는 방식을 근본적으로 변화시켰다. 과거의 아카이브가 물리적 공간의 제약을 받는 종이 문서와 유물 위주였다면, 현대의 디지털 아카이브는 방대한 양의 데이터를 빛의 속도로 복제하고 공유한다. 그러나 이러한 '무한한 저장'의 가능성이 곧 '완벽한 기억'을 의미하지는 않는다.",
                            highlighted: false,
                        },
                    ],
                },
                {
                    id: "p2",
                    variant: "highlight",
                    segments: [
                        {
                            text: "오히려 정보의 과잉 속에서 무엇을 남기고 무엇을 삭제할 것인가를 결정하는 주체로서의 인공지능과 알고리즘의 역할이 부각되고 있다. 과거에는 전문 사서나 역사가가 가치 판단의 주체였다면, 이제는 이용자의 데이터 패턴을 분석하여 '중요도'를 할당하는 수치적 모델이 그 자리를 대신하고 있다.",
                            highlighted: false,
                        },
                    ],
                    highlightText: "주체로서의 인공지능과 알고리즘",
                },
                {
                    id: "p3",
                    variant: "notice",
                    segments: [
                        {
                            text: "이 지점에서 우리는 중요한 질문을 던져야 한다. 알고리즘이 선택한 기억은 객관적인가? 혹은 그것이 우리가 미래에 보게 될 역사를 편향적으로 재구성하고 있지는 않은가? 디지털 아카이브는 단순한 데이터 저장소가 아니라, 당대의 권력 구조와 기술적 한계가 투영된 유동적인 공간이다.",
                            highlighted: false,
                        },
                    ],
                },
                {
                    id: "p4",
                    variant: "normal",
                    segments: [
                        {
                            text: "결국 미래 세대에게 전달될 기록은 기술적 보존의 문제를 넘어, 우리가 현재 어떤 가치관을 가지고 데이터를 선별하느냐에 달려 있다. 인공지능이 도출하는 결과물은 결국 인간이 제공한 데이터의 편향을 학습한 결과이기 때문이다.",
                            highlighted: false,
                        },
                    ],
                },
            ],
        },
        prompt:
            "작가가 주장하는 '디지털 아카이브의 주체성 변화'가 미래 역사관에 미칠 수 있는 영향에 대해 지문의 핵심 키워드를 포함하여 서술하시오.",
    },
];

export function getMockQuestionById(questionId) {
    return mockQuestions.find((question) => question.id === questionId);
}

export function getMockQuestionsByIds(questionIds) {
    return questionIds
        .map((questionId) => getMockQuestionById(questionId))
        .filter(Boolean);
}

export function toDiagnosisQuestion(question, state = {}) {
    if (!question) {
        return null;
    }

    return {
        id: question.id,
        order: state.order,
        title: question.title,
        passageParagraphs: question.passage.paragraphs.map((paragraph) =>
            paragraph.segments.map((segment) => ({ ...segment }))
        ),
        questionText: question.prompt,
        minLength: question.minLength,
        answer: state.answer || "",
        submitted: Boolean(state.submitted),
    };
}

export function toStudyQuestion(question) {
    if (!question) {
        return null;
    }

    return {
        title: question.title,
        category: question.category,
        difficulty: question.difficulty,
        passageTitle: question.passage.title,
        passageParagraphs: question.passage.paragraphs.map((paragraph) => ({
            id: paragraph.id,
            text: paragraph.segments.map((segment) => segment.text).join(""),
            type: paragraph.variant,
            highlightText: paragraph.highlightText,
        })),
        question: question.prompt,
        minLength: question.minLength,
        maxLength: question.maxLength,
    };
}
