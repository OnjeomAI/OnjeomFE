import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import GoalOnboarding from "./pages/onboarding/GoalSetting.jsx";
import DiagnosisTest from "./pages/onboarding/DiagnosisTest";
import DiagnosisResult from "./pages/onboarding/DiagnosisResult";

import LearnerDashboard from "./pages/learner/LearnerDashboard";
import LearnerStudy from "./pages/learner/Today/LearnerStudy";
import LearnerResult from "./pages/learner/Today/LearnerResult";
import LearnerReview from "./pages/learner/LearnerReview";
import LearningAnalytics from "./pages/learner/LearningAnalytics";

import Profile from "./pages/profile/Profile";

import AdminQuestionManagement from "./pages/admin/AdminQuestionManagement";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminTagManagement from "./pages/admin/AdminTagManagement";
import AdminStats from "./pages/admin/AdminStats";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                <Route path="/onboarding/goal" element={<GoalOnboarding />} />
                <Route path="/onboarding/diagnosis" element={<DiagnosisTest />} />
                <Route path="/onboarding/result" element={<DiagnosisResult />} />

                <Route
                    path="/dashboard"
                    element={
                        <AppLayout type="learner">
                            <LearnerDashboard />
                        </AppLayout>
                    }
                />

                <Route
                    path="/today"
                    element={
                        <AppLayout type="learner">
                            <LearnerStudy />
                        </AppLayout>
                    }
                />

                <Route
                    path="/today/result"
                    element={
                        <AppLayout type="learner">
                            <LearnerResult />
                        </AppLayout>
                    }
                />

                <Route
                    path="/review"
                    element={
                        <AppLayout type="learner">
                            <LearnerReview />
                        </AppLayout>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <AppLayout type="learner">
                            <LearningAnalytics />
                        </AppLayout>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <AppLayout type="learner">
                            <Profile type="learner" />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin/question"
                    element={
                        <AppLayout type="admin">
                            <AdminQuestionManagement />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin/curriculum"
                    element={
                        <AppLayout type="admin">
                            <AdminCurriculum />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin/tags"
                    element={
                        <AppLayout type="admin">
                            <AdminTagManagement />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin/stats"
                    element={
                        <AppLayout type="admin">
                            <AdminStats />
                        </AppLayout>
                    }
                />

                <Route
                    path="/admin/profile"
                    element={
                        <AppLayout type="admin">
                            <Profile type="admin" />
                        </AppLayout>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;