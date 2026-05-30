// 학습 분석 데이터를 조회하고 화면 모델로 반환하는 mock API 서비스입니다.
import { learningAnalytics } from "../mockDb/analytics.js";
import { toAnalyticsViewModel } from "../selectors/analyticsSelectors.js";

export async function getLearningAnalytics() {
    return toAnalyticsViewModel(learningAnalytics);
}
