import { useParams, useSearchParams } from "react-router-dom";
import { useSurvey } from "../../hooks/useSurvey";
import QuestionRenderer from "../../components/survey/QuestionRenderer";

export default function SurveyPage() {
  const { slug = "" } = useParams();
  const [search] = useSearchParams();
  const token = search.get("t") || "";

  const { data, error, loading, answers, setAnswers, submit } = useSurvey(
    slug,
    token,
  );

  if (loading) return <div>Loading...</div>;

  if (error === "MISSING") return <div>Invalid invitation link</div>;
  if (error === "INVALID") return <div>Invalid invitation link</div>;
  if (error === "SURVEY_CLOSED") return <div>Survey closed</div>;
  if (error === "ALREADY_SUBMITTED") return <div>You already submitted</div>;

  if (!data) return null;

  return (
    <div>
      <h1>{data.survey.title}</h1>

      {data.survey.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          answers={answers}
          setAnswers={setAnswers}
        />
      ))}

      <button onClick={submit}>Submit</button>
    </div>
  );
}
