import type { QuestionsProps, IAnswer } from "../../../types/survey";

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
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-mono font-bold leading-tight">
          {question.order + 1}. {question.title}{" "}
          {question.required && <span className="text-red-500">*</span>}
        </h3>
      </div>

      <div className="relative group">
        <textarea
          maxLength={question.maxLength}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Scrie comentariul tău..."
          className="w-full h-32 bg-[#111114] border border-gray-800 rounded-xl p-4 text-sm font-mono text-gray-300
                     focus:border-gray-600 outline-none transition-all resize-none placeholder:text-gray-700"
        />

        {question.maxLength && (
          <div className="absolute bottom-4 right-4 text-[10px] font-mono text-gray-700 tracking-widest">
            {value.length} / {question.maxLength}
          </div>
        )}
      </div>
    </div>
  );
}
