import {
    getProblem as getProblemApi,
    getProblems as getProblemsApi,
    getProblemsByReadingType as getProblemsByReadingTypeApi,
} from "../../api/problemApi";

function normalizeProblemList(data) {
    if (Array.isArray(data)) {
        return data;
    }

    if (Array.isArray(data?.content)) {
        return data.content;
    }

    if (Array.isArray(data?.problems)) {
        return data.problems;
    }

    return [];
}

export async function getProblems({ page = 0, size = 20, readingType } = {}) {
    const result =
        readingType && readingType !== "ALL"
            ? await getProblemsByReadingTypeApi(readingType)
            : await getProblemsApi(page, size);

    return normalizeProblemList(result.data);
}

export async function getProblemDetail(problemId) {
    const result = await getProblemApi(problemId);

    return result.data || null;
}

