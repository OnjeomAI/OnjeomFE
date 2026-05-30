import { getAccessToken } from "../../utils/authStorage";
import { toDashboardViewModel } from "../selectors/dashboardSelectors.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function getAuthHeaders() {
    const accessToken = getAccessToken();

    if (!accessToken) {
        return {};
    }

    return {
        Authorization: `Bearer ${accessToken}`,
    };
}

async function requestDashboard(path) {
    const response = await fetch(`${apiBaseUrl}${path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
        },
    });

    const contentType = response.headers.get("content-type") || "";
    const result = contentType.includes("application/json")
        ? await response.json()
        : null;

    if (!response.ok || !result?.success) {
        throw new Error(
            result?.message || "대시보드 정보를 불러오지 못했습니다."
        );
    }

    return result.data;
}

export async function getLearnerDashboard() {
    const [radar, stats, today, recentResponses, weakPoints] =
        await Promise.all([
            requestDashboard("/api/dashboard/radar"),
            requestDashboard("/api/dashboard/stats"),
            requestDashboard("/api/dashboard/today"),
            requestDashboard("/api/dashboard/recent-responses?page=0&size=10"),
            requestDashboard("/api/dashboard/weak-points"),
        ]);

    return toDashboardViewModel({
        radar,
        stats,
        today,
        recentResponses,
        weakPoints,
    });
}
