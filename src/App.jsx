import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import GoalOnboarding from "./pages/onboarding/GoalOnboarding";
import DiagnosisTest from "./pages/onboarding/DiagnosisTest";
import DiagnosisResult from "./pages/onboarding/DiagnosisResult";

import MainDashboard from "./pages/dashboard/MainDashboard";
import LearningAnalytics from "./pages/dashboard/LearningAnalytics";

import Profile from "./pages/profile/Profile";
import AdminCMS from "./pages/admin/AdminCMS";

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

                <Route path="/dashboard" element={<MainDashboard />} />
                <Route path="/analytics" element={<LearningAnalytics />} />

                <Route path="/profile" element={<Profile />} />
                <Route path="/admin/cms" element={<AdminCMS />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;