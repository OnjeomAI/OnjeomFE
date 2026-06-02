import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ScrollToTop from "./components/common/ScrollToTop";
import Landing from "./pages/landing/Landing.jsx";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import AdminLogin from "./pages/auth/AdminLogin";
import EmailVerification from "./pages/auth/EmailVerification";
import PasswordReset from "./pages/auth/PasswordReset";
import PasswordResetRequest from "./pages/auth/PasswordResetRequest";
import SessionExpired from "./pages/auth/SessionExpired";
import GoalSetting from "./pages/onboarding/GoalSetting.jsx";
import DiagnosisTest from "./pages/onboarding/DiagnosisTest";
import DiagnosisResult from "./pages/onboarding/DiagnosisResult";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import LearnerStudy from "./pages/learner/today/LearnerStudy";
import LearnerResult from "./pages/learner/today/LearnerResult";
import LearnerReview from "./pages/learner/LearnerReview";
import LearningAnalytics from "./pages/learner/LearningAnalytics";
import AdminQuestionManagement from "./pages/admin/AdminQuestionManagement";
import AdminCurriculum from "./pages/admin/AdminCurriculum";
import AdminTagManagement from "./pages/admin/AdminTagManagement";
import AdminStats from "./pages/admin/AdminStats";
import Profile from "./pages/profile/Profile";
import { getAccessToken, getAuthUser } from "./utils/authStorage";

function RequireAuth({ role, enforceRole = true }) {
    const location = useLocation();
    const accessToken = getAccessToken();
    const user = getAuthUser();

    if (!accessToken) {
        return <Navigate to={role === "admin" ? "/admin" : "/login"} replace state={{ from: location }} />;
    }

    if (enforceRole && role && user?.role !== role) {
        return <Navigate to={user.role === "admin" ? "/admin/question" : "/dashboard"} replace />;
    }

    return <Outlet />;
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<Navigate to="/landing" replace />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/signup/verify" element={<EmailVerification />} />
                <Route path="/password/reset-request" element={<PasswordResetRequest />} />
                <Route path="/password/reset" element={<PasswordReset />} />
                <Route path="/session-expired" element={<SessionExpired />} />
                <Route path="/admin" element={<AdminLogin />} />

                <Route element={<RequireAuth role="learner" />}>
                    <Route path="/onboarding/goal" element={<GoalSetting />} />
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
                </Route>

                <Route element={<RequireAuth role="admin" />}>
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
