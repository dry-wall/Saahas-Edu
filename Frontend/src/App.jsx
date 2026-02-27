import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AccessibilityProvider } from "./context/AccessibilityContext";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BraillePage from "./pages/BraillePage";
import SignLanguagePage from "./pages/SignLanguagePage";
import StudentDashboardPage from "./pages/StudentDashboardPage";
import MentalHealthPage from "./pages/MentalHealthPage";
import { AuthGuard } from "./components/auth/AuthGuard";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <AccessibilityProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />  {/* FIXED: was duplicate "/" */}
            <Route path="/home" element={<AuthGuard><HomePage /></AuthGuard>} />
            <Route path="/braille" element={<AuthGuard><BraillePage /></AuthGuard>} />
            <Route path="/sign-language" element={<AuthGuard><SignLanguagePage /></AuthGuard>} />
            <Route path="/dashboard" element={<AuthGuard><StudentDashboardPage /></AuthGuard>} />
            <Route path="/mental-health" element={<AuthGuard><MentalHealthPage /></AuthGuard>} />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </BrowserRouter>
      </AccessibilityProvider>
    </AuthProvider>
  );
}
