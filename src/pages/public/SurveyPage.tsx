import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../hooks/useSurvey";
import QuestionRenderer from "../../components/survey/QuestionRenderer";

export default function SurveyPage() {
  const { slug = "" } = useParams();
  const [search] = useSearchParams();
  const token = search.get("t") || "";
  const navigate = useNavigate();
  const { data, error, loading, answers, setAnswers, submit } = useSurvey(
    slug,
    token,
  );

  useEffect(() => {
    if (error === "SURVEY_CLOSED") navigate("/closed");
    if (error === "ALREADY_SUBMITTED") navigate("/submitted");
  }, [error, navigate]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#111114] text-gray-500 font-mono p-10 text-center">
        Se încarcă...
      </div>
    );
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#111114] text-[#e8e6e1] selection:bg-[#e9c46a]/30">
      <div className="max-w-xl mx-auto p-6 pt-12 space-y-12">
        {/* Header */}
        <header className="space-y-4 text-center">
          <h2 className="text-4xl font-serif tracking-tight">{data.survey.title}</h2>
          <p className="text-gray-500 font-mono text-sm leading-relaxed">
            {data.survey.description || "Te rugăm să ne dai feedback-ul tău sincer."}
          </p>
        </header>

        {/* Questions */}
        <div className="space-y-8">
          {data.survey.questions.map((q) => (
            <div key={q.id} className="bg-[#1A1A22] border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
              <QuestionRenderer
                question={q}
                answers={answers}
                setAnswers={setAnswers}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          className="w-full bg-[#e9c46a] text-[#111114] py-4 rounded-xl font-mono font-bold text-sm 
                     hover:brightness-110 transition-all active:scale-[0.98] shadow-lg shadow-[#e9c46a]/10"
          onClick={submit}
        >
          Trimite răspunsurile →
        </button>

        <footer className="pb-12 text-center">
          <p className="text-[10px] font-mono text-gray-700 uppercase tracking-[0.3em]">
            Powered by SurveyApp
          </p>
        </footer>
      </div>
    </div>
  );
}