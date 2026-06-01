import {
    completeCurriculumItem,
    getCurriculumProgress,
    getMyCurriculum,
    isMissingCurriculumError,
    skipCurriculumItem,
    startCurriculumItem,
} from "./curriculumService";
import { getToday } from "../../api/dashboardApi";
import { getLatestDiagnosisResult } from "./diagnosisService";
import { getProblems } from "./problemService";
import { getProblemDetail } from "./problemService";

const FALLBACK_STUDY_KEY = "onjeom-fallback-study-state";

function readFallbackStudyState() {
    const rawValue = localStorage.getItem(FALLBACK_STUDY_KEY);

    if (!rawValue) {
        return { offset: 0 };
    }

    try {
        return JSON.parse(rawValue);
    } catch {
        return { offset: 0 };
    }
}

function writeFallbackStudyState(state) {
    localStorage.setItem(FALLBACK_STUDY_KEY, JSON.stringify(state));
}

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

function isEmptyCurriculum(curriculum) {
    return curriculum && Number(curriculum.totalItems || 0) === 0;
}

async function getTodayGoalStatus() {
    try {
        const result = await getToday();
        const data = result.data || {};
        const dailyGoal = Number(data.dailyGoal || 0);
        const completedToday = Number(data.completedToday || 0);

        return {
            dailyGoal,
            completedToday,
            isGoalReached: dailyGoal > 0 && completedToday >= dailyGoal,
        };
    } catch {
        return null;
    }
}

function getWeakestReadingType(diagnosisResult) {
    if (!diagnosisResult) {
        return null;
    }

    const scores = [
        { readingType: "FACTUAL", score: diagnosisResult.factualScore },
        { readingType: "INFERENTIAL", score: diagnosisResult.inferentialScore },
        { readingType: "CRITICAL", score: diagnosisResult.criticalScore },
    ].filter((item) => Number.isFinite(Number(item.score)));

    if (!scores.length) {
        return null;
    }

    scores.sort((left, right) => Number(left.score) - Number(right.score));
    return scores[0].readingType;
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

function toKeywords(problemDetail) {
    if (!Array.isArray(problemDetail?.keywords)) {
        return [];
    }

    return problemDetail.keywords
        .filter((item) => item?.keyword)
        .map((item) => ({
            keyword: item.keyword,
            weight: item.weight ?? 1,
        }));
}

async function getFallbackProblem() {
    let readingType = null;

    try {
        readingType = getWeakestReadingType(await getLatestDiagnosisResult());
    } catch {
        readingType = null;
    }

    let problems = [];
    if (readingType) {
        problems = await getProblems({ readingType });
    }

    if (!problems.length) {
        problems = await getProblems({ page: 0, size: 20 });
    }

    if (!problems.length) {
        return null;
    }

    const state = readFallbackStudyState();
    const problem = problems[state.offset % problems.length];

    return getProblemDetail(problem.id ?? problem.problemId);
}

function buildFallbackStudyViewModel(problemDetail) {
    if (!problemDetail) {
        return null;
    }

    return {
        curriculumId: null,
        curriculumStatus: "FALLBACK",
        currentStage: Math.max(1, Math.min(4, problemDetail.difficulty || 1)),
        totalItems: 0,
        completedItems: 0,
        progressPercent: 0,
        sessionLabel: "진단 결과 기반 임시 학습",
        sessionId: `fallback-${problemDetail.id}`,
        status: "PENDING",
        itemId: null,
        questionId: problemDetail.id,
        problemId: problemDetail.id,
        curriculumItemId: null,
        title: `추천 학습 · 문제 ${problemDetail.id}`,
        category: mapReadingTypeLabel(problemDetail.readingType),
        difficulty: problemDetail.difficulty,
        passageTitle: `문제 ${problemDetail.id}`,
        passageParagraphs: toPassageParagraphs(problemDetail),
        passageText: toPassageText(problemDetail),
        question: problemDetail.questionText,
        modelAnswer: problemDetail.modelAnswer || "",
        keywords: toKeywords(problemDetail),
        scheduledAt: null,
        isFallback: true,
    };
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
        category: mapReadingTypeLabel(currentItem.readingType),
        difficulty: currentItem.difficulty,
        passageTitle: `문제 ${currentItem.problemId}`,
        passageParagraphs: toPassageParagraphs(problemDetail),
        passageText: toPassageText(problemDetail),
        question: problemDetail?.questionText || currentItem.questionText,
        modelAnswer: problemDetail?.modelAnswer || "",
        keywords: toKeywords(problemDetail),
        scheduledAt: currentItem.scheduledAt,
    };
}

export async function getTodayStudySession() {
    let curriculum;
    let progress = null;
    const todayGoalStatus = await getTodayGoalStatus();

    if (todayGoalStatus?.isGoalReached) {
        return null;
    }

    try {
        curriculum = await getMyCurriculum();
    } catch (error) {
        if (isMissingCurriculumError(error)) {
            return buildFallbackStudyViewModel(await getFallbackProblem());
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

    if (!currentItem && isEmptyCurriculum(curriculum)) {
        return buildFallbackStudyViewModel(await getFallbackProblem());
    }

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
    const todayGoalStatus = await getTodayGoalStatus();

    if (todayGoalStatus?.isGoalReached) {
        return "COMPLETED";
    }

    try {
        curriculum = await getMyCurriculum();
    } catch (error) {
        if (isMissingCurriculumError(error)) {
            return (await getFallbackProblem()) ? "NOT_STARTED" : "NO_CURRICULUM";
        }

        throw error;
    }

    if (isEmptyCurriculum(curriculum)) {
        return (await getFallbackProblem()) ? "NOT_STARTED" : "COMPLETED";
    }

    const currentItem = getActiveTodayItem(curriculum);

    if (!currentItem) {
        return "COMPLETED";
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
        const state = readFallbackStudyState();
        writeFallbackStudyState({ offset: (state.offset || 0) + 1 });
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
