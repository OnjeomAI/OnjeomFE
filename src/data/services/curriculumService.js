import {
    completeCurriculumItem as completeCurriculumItemApi,
    getCurriculumProgress as getCurriculumProgressApi,
    getMyCurriculum as getMyCurriculumApi,
    skipCurriculumItem as skipCurriculumItemApi,
    startCurriculumItem as startCurriculumItemApi,
} from "../../api/curriculumApi";

export function isMissingCurriculumError(error) {
    const message = String(error?.message || "").toLowerCase();

    return (
        message.includes("curriculum") ||
        message.includes("커리큘럼") ||
        message.includes("존재하지")
    );
}

export async function getMyCurriculum() {
    const result = await getMyCurriculumApi();

    return result.data;
}

export async function getCurriculumProgress() {
    const result = await getCurriculumProgressApi();

    return result.data;
}

export async function startCurriculumItem(itemId) {
    const result = await startCurriculumItemApi(itemId);

    return result.data;
}

export async function skipCurriculumItem(itemId) {
    const result = await skipCurriculumItemApi(itemId);

    return result.data;
}

export async function completeCurriculumItem(itemId) {
    const result = await completeCurriculumItemApi(itemId);

    return result.data;
}

