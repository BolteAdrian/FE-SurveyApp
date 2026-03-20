import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurveyPage from "./pages/public/SurveyPage";
import LandingPage from "./pages/public/LandingPage";
import AdminLayout from "./layouts/AdminLayout";
import SurveysPage from "./pages/admin/SurveysPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import ResultsPage from "./pages/admin/ResultsPage";
import SurveyEditor from "./pages/admin/SurveyEditor";
import AlreadySubmitted from "./pages/public/AlreadySubmitted";
import SurveyClosed from "./pages/public/SurveyClosed";
import LoginPage from "./pages/admin/LoginPage";
import RegisterPage from "./pages/admin/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/s/:slug" element={<SurveyPage />} />
          <Route path="/closed" element={<SurveyClosed />} />
          <Route path="/submitted" element={<AlreadySubmitted />} />
        </Route>

        {/* ADMIN */}
        <Route path="/login-admin" element={<LoginPage />} />
        <Route path="/register-admin" element={<RegisterPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<SurveysPage />} />
          <Route path="create" element={<SurveyEditor />} />
          <Route path=":id/results" element={<ResultsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
