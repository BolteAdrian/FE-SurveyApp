import { useEffect, useState } from "react";
import { api } from "../../api/client";
import type { IOption, IQuestion } from "../../types/survey";

interface IResultOption extends IOption {
  _count: {
    answers: number;
  };
}

interface IResultQuestion extends IQuestion {
  options: IResultOption[];
  text_answers: {
    textValue: string;
  }[];
}

export default function ResultsPage() {
  const [data, setData] = useState<IResultQuestion[]>([]);

  useEffect(() => {
    api.get("/api/admin/results").then((res) => {
      setData(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Results</h1>

      {data.map((q) => (
        <div key={q.id}>
          <h3>{q.title}</h3>

          {q.type === "MULTI_CHOICE" &&
            q.options?.map((opt) => (
              <div key={opt.id}>
                {opt.label} - {opt._count.answers}
              </div>
            ))}

          {q.type === "TEXT" &&
            q.text_answers?.map((t, i) => <p key={i}>{t.textValue}</p>)}
        </div>
      ))}
    </div>
  );
}