// 문항 원천 데이터를 진단 테스트와 오늘 학습 화면이 쓰는 형태로 변환합니다.
export function toDiagnosisQuestionViewModel(question, state = {}) {
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

export function toStudyQuestionViewModel(question) {
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
