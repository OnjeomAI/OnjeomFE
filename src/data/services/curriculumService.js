import {
    completeCurriculumItem as completeCurriculumItemApi,
    getCurriculumProgress as getCurriculumProgressApi,
    getMyCurriculum as getMyCurriculumApi,
    skipCurriculumItem as skipCurriculumItemApi,
    startCurriculumItem as startCurriculumItemApi,
} from "../../api/curriculumApi";

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

