import type { IAnswer, QuestionsProps } from "../../types/survey";

export default function TextQuestion({
  question,
  answers,
  setAnswers,
}: QuestionsProps) {
  const textAnswer = answers.find(
    (a) => a.questionId === question.id && "textValue" in a,
  ) as { questionId: string; textValue: string } | undefined;

  const value = textAnswer?.textValue || "";

  const handleChange = (newValue: string) => {
    const otherAnswers = answers.filter((a) => a.questionId !== question.id);

    if (newValue) {
      const newAnswer: IAnswer = {
        questionId: question.id!,
        textValue: newValue,
      };
      setAnswers([...otherAnswers, newAnswer]);
    } else {
      setAnswers(otherAnswers);
    }
  };

  return (
    <div>
      <h3 className="font-semibold">{question.title}</h3>

      <textarea
        maxLength={question.maxLength}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full p-2 border rounded-md mt-2"
      />

      {question.maxLength && (
        <div className="text-sm text-right text-gray-500">
          {value.length} / {question.maxLength}
        </div>
      )}
    </div>
  );
}