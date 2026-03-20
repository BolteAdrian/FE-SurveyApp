import { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import type { ISurvey } from "../../types/survey";

export default function SurveysPage() {
  const [surveys, setSurveys] = useState<ISurvey[]>([]);

  useEffect(() => {
    adminApi.getSurveys().then(setSurveys);
  }, []);

  return (
    <div>
      <h1>Surveys</h1>

      {surveys.map((s) => (
        <div key={s.id}>{s.title}</div>
      ))}
    </div>
  );
}