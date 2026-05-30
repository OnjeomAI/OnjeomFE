// 학습자 대시보드 데이터를 조회하고 화면 모델로 반환하는 mock API 서비스입니다.
import {
    abilitySnapshots,
    dashboardSummary,
    recentStudyRecords,
    weaknessSnapshots,
} from "../mockDb/analytics.js";
import { toDashboardViewModel } from "../selectors/dashboardSelectors.js";

export async function getLearnerDashboard() {
    return toDashboardViewModel({
        summary: dashboardSummary,
        abilityStats: abilitySnapshots,
        weaknessItems: weaknessSnapshots,
        recentRecords: recentStudyRecords,
    });
}
