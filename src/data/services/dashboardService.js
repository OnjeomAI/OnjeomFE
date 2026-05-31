import {
    getRadar,
    getRecentResponses,
    getStats,
    getToday,
    getWeakPoints,
} from "../../api/dashboardApi";
import { toDashboardViewModel } from "../selectors/dashboardSelectors";

export async function getLearnerDashboard() {
    const [radar, stats, today, recentResponses, weakPoints] = await Promise.all([
        getRadar(),
        getStats(),
        getToday(),
        getRecentResponses(0, 10),
        getWeakPoints(),
    ]);

    return toDashboardViewModel({
        radar: radar.data,
        stats: stats.data,
        today: today.data,
        recentResponses: recentResponses.data,
        weakPoints: weakPoints.data,
    });
}

