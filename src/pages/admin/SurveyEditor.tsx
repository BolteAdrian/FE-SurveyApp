import { useState } from "react";
import type { IQuestion } from "../../types/survey";

export default function SurveyEditor() {
  const [title, setTitle] = useState<string>("");
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  const addTextQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: "TEXT",
        title: "",
        maxSelections: 1000,
      },
    ]);
  };

  const addMultiChoice = () => {
    setQuestions([
      ...questions,
      {
        type: "MULTI_CHOICE",
        title: "",
        maxSelections: 2,
        options: [],
      },
    ]);
  };

  return (
    <div>
      <h1>Create ISurvey</h1>

      <input
        placeholder="ISurvey title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div>
        <button onClick={addTextQuestion}>+ Text</button>
        <button onClick={addMultiChoice}>+ Multi Choice</button>
      </div>

      {questions.map((q, index) => (
        <div key={q.id}>
          <input
            placeholder="IQuestion title"
            value={q.title}
            onChange={(e) => {
              const updated = [...questions];
              updated[index].title = e.target.value;
              setQuestions(updated);
            }}
          />

          <div>Type: {q.type}</div>
        </div>
      ))}
    </div>
  );
}
