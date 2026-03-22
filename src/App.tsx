import { BrowserRouter, Routes, Route } from "react-router-dom";
import SurveyPage from "./pages/public/SurveyPage";
import LandingPage from "./pages/public/LandingPage";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./layouts/PublicLayout";
import ResultsPage from "./pages/admin/surveys/ResultsPage";
import AlreadySubmitted from "./pages/public/AlreadySubmitted";
import SurveyClosed from "./pages/public/SurveyClosed";
import LoginPage from "./pages/admin/auth/LoginPage";
import RegisterPage from "./pages/admin/auth/RegisterPage";
import { AuthProvider } from "./contexts/AuthContext";
import QuestionEditor from "./pages/admin/surveys/QuestionEditor";
import SurveyEditor from "./pages/admin/surveys/SurveyEditor";
import SurveysPage from "./pages/admin/surveys/SurveysPage";
import ListsPage from "./pages/admin/lists/ListsPage";
import ListDetailsPage from "./pages/admin/lists/ListPage";
import InvitationPage from "./pages/admin/surveys/InvitationPage";

function App() {
  return (
    <AuthProvider>
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
            <Route path="surveys" element={<SurveysPage />} />
            <Route path="surveys/new" element={<SurveyEditor />} />
            <Route path="surveys/:id" element={<SurveyEditor />} />
            <Route
              path="surveys/:surveyId/question/new"
              element={<QuestionEditor />}
            />
            <Route
              path="surveys/:surveyId/question/:id"
              element={<QuestionEditor />}
            />
            <Route path="surveys/:id/results" element={<ResultsPage />} />
            <Route
              path="surveys/:id/invitations"
              element={<InvitationPage />}
            />
            <Route path="contacts" element={<ListsPage />} />
            <Route path="contacts/:id" element={<ListDetailsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
