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
    if (error === "SURVEY_CLOSED") {
      navigate("/closed");
    }
    if (error === "ALREADY_SUBMITTED") {
      navigate("/submitted");
    }
  }, [error, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error === "MISSING") return <div>Invalid invitation link</div>;
  if (error === "INVALID") return <div>Invalid invitation link</div>;
  if (error === "SURVEY_CLOSED") return null;
  if (error === "ALREADY_SUBMITTED") return null;

  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{data.survey.title}</h1>
      <div className="space-y-6">
        {data.survey.questions.map((q) => (
          <div key={q.id} className="p-4 bg-white rounded-xl shadow">
            <QuestionRenderer
              question={q}
              answers={answers}
              setAnswers={setAnswers}
            />
          </div>
        ))}
      </div>
      <button
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg"
        onClick={submit}
      >
        Submit
      </button>
    </div>
  );
}
