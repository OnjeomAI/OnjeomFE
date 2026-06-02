import {
    completeCurriculumItem,
    getCurriculumProgress,
    getMyCurriculum,
    isMissingCurriculumError,
    skipCurriculumItem,
    startCurriculumItem,
} from "./curriculumService";
import { getProblemDetail } from "./problemService";

function mapReadingTypeLabel(readingType) {
    const labels = {
        FACTUAL: "사실 이해",
        INFERENTIAL: "추론 이해",
        CRITICAL: "비판 이해",
        CREATIVE: "창의 이해",
    };

    return labels[readingType] || readingType || "학습";
}

function getActiveTodayItem(curriculum) {
    const todayItems = curriculum?.todayItems || [];

    return (
        todayItems.find((item) => item.status === "IN_PROGRESS") ||
        todayItems.find((item) => item.status === "PENDING") ||
        null
    );
}

function toPassageParagraphs(problemDetail) {
    if (problemDetail?.passageText) {
        return String(problemDetail.passageText)
            .split("\n")
            .map((paragraph, index) => ({
                id: `problem-${problemDetail.id}-paragraph-${index + 1}`,
                text: paragraph.trim(),
                type: "normal",
                highlightText: "",
            }))
            .filter((paragraph) => paragraph.text);
    }

    return [];
}

function toPassageText(problemDetail) {
    if (problemDetail?.passageText) {
        return String(problemDetail.passageText);
    }

    return "";
}

function buildStudyViewModel({
    curriculum,
    progress,
    currentItem,
    problemDetail,
}) {
    return {
        curriculumId: curriculum.curriculumId,
        curriculumStatus: curriculum.status,
        currentStage: curriculum.currentStage,
        totalItems: curriculum.totalItems,
        completedItems: curriculum.completedItems,
        progressPercent: progress?.progressPercent ?? 0,
        sessionLabel:
            currentItem.status === "IN_PROGRESS"
                ? "진행 중인 오늘의 학습"
                : "오늘의 학습 시작",
        sessionId: `curriculum-${curriculum.curriculumId}`,
        status: currentItem.status,
        itemId: currentItem.itemId,
        questionId: problemDetail?.id ?? currentItem.problemId,
        problemId: currentItem.problemId,
        curriculumItemId: currentItem.itemId,
        title: `Stage ${currentItem.stage} · ${currentItem.orderIndex}번 학습`,
        readingType: currentItem.readingType,
        category: mapReadingTypeLabel(currentItem.readingType),
        difficulty: currentItem.difficulty,
        passageTitle: `문제 ${currentItem.problemId}`,
        passageParagraphs: toPassageParagraphs(problemDetail),
        passageText: toPassageText(problemDetail),
        question: problemDetail?.questionText || currentItem.questionText,
        modelAnswer: problemDetail?.modelAnswer || "",
        scheduledAt: currentItem.scheduledAt,
    };
}

function buildReviewStudyViewModel(problemDetail) {
    return {
        curriculumId: null,
        curriculumStatus: "REVIEW",
        currentStage: null,
        totalItems: 1,
        completedItems: 0,
        progressPercent: 0,
        sessionLabel: "복습 노트 다시 풀기",
        sessionId: `review-${problemDetail.id}`,
        status: "REVIEW",
        itemId: null,
        questionId: problemDetail.id,
        problemId: problemDetail.id,
        curriculumItemId: null,
        title: `문제 ${problemDetail.id} 복습`,
        readingType: problemDetail.readingType,
        category: mapReadingTypeLabel(problemDetail.readingType),
        difficulty: Number(problemDetail.difficulty) || 0,
        passageTitle: `문제 ${problemDetail.id}`,
        passageParagraphs: toPassageParagraphs(problemDetail),
        passageText: toPassageText(problemDetail),
        question: problemDetail.questionText,
        modelAnswer: problemDetail.modelAnswer || "",
        scheduledAt: null,
        reviewMode: true,
    };
}

export async function getReviewStudySession(problemId) {
    if (!problemId) {
        return null;
    }

    const problemDetail = await getProblemDetail(problemId);

    if (!problemDetail) {
        return null;
    }

    return buildReviewStudyViewModel(problemDetail);
}

export async function getTodayStudySession() {
    let curriculum;
    let progress = null;

    try {
        curriculum = await getMyCurriculum();
    } catch (error) {
        if (isMissingCurriculumError(error)) {
            return null;
        }

        throw error;
    }

    try {
        progress = await getCurriculumProgress();
    } catch (error) {
        if (!isMissingCurriculumError(error)) {
            throw error;
        }
    }

    const currentItem = getActiveTodayItem(curriculum);

    if (!currentItem) {
        return null;
    }

    const problemDetail = await getProblemDetail(currentItem.problemId);

    return buildStudyViewModel({
        curriculum,
        progress,
        currentItem,
        problemDetail,
    });
}

export async function getTodayStudyStatus() {
    let curriculum;
    let progress = null;

    try {
        curriculum = await getMyCurriculum();
    } catch (error) {
        if (isMissingCurriculumError(error)) {
            return "NO_CURRICULUM";
        }

        throw error;
    }

    try {
        progress = await getCurriculumProgress();
    } catch (error) {
        if (!isMissingCurriculumError(error)) {
            throw error;
        }
    }

    const currentItem = getActiveTodayItem(curriculum);

    if (!currentItem) {
        const totalItems = progress?.totalItems ?? curriculum.totalItems ?? 0;
        const completedItems =
            progress?.completedItems ?? curriculum.completedItems ?? 0;
        const skippedItems = progress?.skippedItems ?? 0;
        const finishedItems = completedItems + skippedItems;

        if (totalItems > 0 && finishedItems >= totalItems) {
            return "CURRICULUM_COMPLETED";
        }

        return "TODAY_COMPLETED";
    }

    return currentItem.status;
}

export async function getTodayStudyPath() {
    return "/today";
}

export async function startTodayStudy(itemId) {
    if (!itemId) {
        return null;
    }

    await startCurriculumItem(itemId);

    return true;
}

export async function markTodayStudySubmitted({ itemId }) {
    if (!itemId) {
        return null;
    }

    await completeCurriculumItem(itemId);

    return true;
}

export async function skipTodayStudyItem(itemId) {
    if (!itemId) {
        return null;
    }

    await skipCurriculumItem(itemId);

    return true;
}
