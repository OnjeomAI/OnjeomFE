import { aiPost } from "./aiClient";

export async function generateWeaknessReport(payload) {
    return aiPost("/api/writing/weakness-report", payload);
}

export async function adjustCurriculum(payload) {
    return aiPost("/api/writing/curriculum/adjust", payload);
}

export async function compareAnswers(payload) {
    return aiPost("/api/writing/compare", payload);
}

export async function evaluateWriting(payload) {
    return aiPost("/api/writing/evaluate", payload);
}

export async function estimateIrt(payload) {
    return aiPost("/api/writing/irt/estimate", payload);
}

export async function createCurriculumPlan(payload) {
    return aiPost("/api/writing/curriculum-plan", payload);
}

export const compareWriting = compareAnswers;
export const createWeaknessReport = generateWeaknessReport;
