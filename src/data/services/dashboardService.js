import {
    getRadar,
    getRecentResponses,
    getStats,
    getToday,
    getWeakPoints,
} from "../../api/dashboardApi";
import { isMissingCurriculumError } from "./curriculumService";
import { toDashboardViewModel } from "../selectors/dashboardSelectors";

export async function getLearnerDashboard() {
    const results = await Promise.allSettled([
        getRadar(),
        getStats(),
        getToday(),
        getRecentResponses(0, 10),
        getWeakPoints(),
    ]);

    const firstBlockingError = results.find(
        (result) =>
            result.status === "rejected" &&
            !isMissingCurriculumError(result.reason)
    );

    if (firstBlockingError) {
        throw firstBlockingError.reason;
    }

    const [radar, stats, today, recentResponses, weakPoints] = results.map(
        (result) => (result.status === "fulfilled" ? result.value : { data: null })
    );

    return toDashboardViewModel({
        radar: radar.data,
        stats: stats.data,
        today: today.data,
        recentResponses: recentResponses.data,
        weakPoints: weakPoints.data,
    });
}

