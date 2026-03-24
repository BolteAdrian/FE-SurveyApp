import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import PublicLayout from "../layouts/PublicLayout";
import LoginPage from "../pages/admin/auth/LoginPage";
import RegisterPage from "../pages/admin/auth/RegisterPage";
import ListDetailsPage from "../pages/admin/lists/ListPage";
import ListsPage from "../pages/admin/lists/ListsPage";
import InvitationPage from "../pages/admin/surveys/InvitationPage";
import ResultsPage from "../pages/admin/surveys/ResultsPage";
import SurveyEditor from "../pages/admin/surveys/SurveyEditor";
import SurveysPage from "../pages/admin/surveys/SurveysPage";
import AlreadySubmitted from "../pages/public/AlreadySubmitted";
import SurveySuccess from "../pages/public/ConfirmedSubmitted";
import InvalidLink from "../pages/public/InvalidLink";
import SurveyClosed from "../pages/public/SurveyClosed";
import SurveyPage from "../pages/public/SurveyPage";

export const AppRoutes = () => (
  <Routes>
    {/* PUBLIC */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<InvalidLink />} />
      <Route path="/s/:slug" element={<SurveyPage />} />
      <Route path="/closed" element={<SurveyClosed />} />
      <Route path="/already-submitted" element={<AlreadySubmitted />} />
      <Route path="/submitted" element={<SurveySuccess />} />
    </Route>

    {/* ADMIN AUTH */}
    <Route path="/login-admin" element={<LoginPage />} />
    <Route path="/register-admin" element={<RegisterPage />} />

    {/* ADMIN PROTECTED */}
    <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<SurveysPage />} />
      <Route path="surveys" element={<SurveysPage />} />
      <Route path="surveys/new" element={<SurveyEditor />} />
      <Route path="surveys/:id" element={<SurveyEditor />} />
      <Route path="surveys/:id/results" element={<ResultsPage />} />
      <Route path="surveys/:id/invitations" element={<InvitationPage />} />
      <Route path="contacts" element={<ListsPage />} />
      <Route path="contacts/:id" element={<ListDetailsPage />} />
    </Route>
  </Routes>
);