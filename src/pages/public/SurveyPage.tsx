import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSurvey } from "../../hooks/useSurvey";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import QuestionRenderer from "../../components/survey/questions/QuestionRenderer";

export default function SurveyPage() {
  // Localization hook
  const { t } = useTranslation();

  // URL Parameters and Navigation
  const { slug = "" } = useParams();
  const [search] = useSearchParams();
  const token = search.get("t") || "";
  const navigate = useNavigate();

  // Custom hook for survey logic
  const { data, error, loading, answers, setAnswers, submit, errors } =
    useSurvey(slug, token);

  /**
   * Handle global survey errors like closed status or
   * already submitted invitations
   */
  useEffect(() => {
    if (error === "SURVEY_CLOSED") navigate("/closed");
    if (error === "ALREADY_SUBMITTED") navigate("/already-submitted");
    if (error === "INVALID_LINK") navigate("/");
  }, [error, navigate]);

  // Loading State
  if (loading)
    return (
      <div className="min-h-screen bg-[#111114] text-gray-500 font-mono p-10 text-center uppercase tracking-widest animate-pulse flex items-center justify-center">
        {t("SURVEY.LOADING")}
      </div>
    );

  const surveyData = data?.invitation?.survey;

  // Fallback if data is missing or invalid
  if (!surveyData)
    return (
      <div className="min-h-screen bg-[#111114] text-red-400 font-mono p-10 text-center flex items-center justify-center">
        {t("SURVEY.NOT_FOUND")}
      </div>
    );

  return (
    <div className="relative min-h-screen bg-[#111114] text-[#e8e6e1] selection:bg-[#e9c46a]/30">
      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <LanguageSwitcher />
      </div>

      <div className="max-w-xl mx-auto p-6 pt-20 space-y-12">
        {/* Header Section */}
        <header className="space-y-6 text-center">
          <h2 className="text-4xl md:text-5xl font-serif tracking-tight text-white leading-tight">
            {surveyData.title}
          </h2>
          <p className="text-gray-500 font-mono text-sm leading-relaxed max-w-md mx-auto">
            {surveyData.description || t("SURVEY.DEFAULT_DESCRIPTION")}
          </p>
        </header>

        {/* Questions List */}
        <div className="space-y-10">
          {surveyData.questions?.map((q: any) => (
            <div key={q.id} className="space-y-4">
              <div
                className={`bg-[#1A1A22] border rounded-3xl p-8 md:p-10 shadow-2xl transition-all duration-300 ${
                  errors[q.id]
                    ? "border-red-500/50 shadow-red-500/5"
                    : "border-gray-800/40"
                }`}
              >
                <QuestionRenderer
                  question={q}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              </div>

              {errors[q.id] && (
                <div className="flex items-center gap-3 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in slide-in-from-top-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                    {errors[q.id]}
                  </span>
                </div>
              )}
            </div>
          ))}

          {(!surveyData.questions || surveyData.questions.length === 0) && (
            <p className="text-center text-gray-600 font-mono italic">
              {t("SURVEY.NO_QUESTIONS")}
            </p>
          )}
        </div>

        {/* Submission Action */}
        <div className="pt-8">
          <button
            className="w-full bg-[#e9c46a] text-[#111114] py-5 rounded-2xl font-mono font-black text-xs uppercase tracking-[0.2em]
                       hover:brightness-110 hover:scale-[1.02] transition-all active:scale-[0.98] shadow-2xl shadow-[#e9c46a]/10"
            onClick={submit}
          >
            {t("SURVEY.SUBMIT_BUTTON")} →
          </button>
        </div>
      </div>
    </div>
  );
}
