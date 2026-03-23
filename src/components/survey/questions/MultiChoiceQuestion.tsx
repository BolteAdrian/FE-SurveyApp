import type { IOption, QuestionsProps } from "../../../types/survey";

export default function MultiChoiceQuestion({
  question,
  answers,
  setAnswers,
}: QuestionsProps) {
  // These are the answers for this specific question
  const questionAnswers = answers.filter(
    (a) => "optionId" in a && a.questionId === question.id,
  ) as { questionId: string; optionId: string }[];

  const selectedOptionIds = new Set(questionAnswers.map((a) => a.optionId));

  const toggleOption = (optionId: string) => {
    const max = question.maxSelections || 1;
    const isSelected = selectedOptionIds.has(optionId);

    if (isSelected) {
      const newAnswers = answers.filter(
        (a) =>
          !(
            a.questionId === question.id &&
            "optionId" in a &&
            a.optionId === optionId
          ),
      );
      setAnswers(newAnswers);
      return;
    }

    // It's not selected. We are adding a selection.
    if (max === 1) {
      // remove all previous answers for this question and add the new one
      const otherAnswers = answers.filter((a) => a.questionId !== question.id);
      const newAnswer = { questionId: question.id!, optionId };
      setAnswers([...otherAnswers, newAnswer]);
    } else {
      // max > 1
      if (selectedOptionIds.size < max) {
        const newAnswer = { questionId: question.id!, optionId };
        setAnswers([...answers, newAnswer]);
      }
    }
  };

  const max = question.maxSelections || 1;
  const isMaxReached = selectedOptionIds.size >= max;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-mono font-bold leading-tight">
          {question.order + 1}. {question.title}{" "}
          {question.required && <span className="text-red-500">*</span>}
        </h3>
        {max > 1 && (
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            Selectează maxim {max} opțiuni
          </p>
        )}
      </div>

      <div className="space-y-3">
        {question.options?.map((opt: IOption) => {
          const isSelected = selectedOptionIds.has(opt.id as string);
          const disabled = !isSelected && isMaxReached;

          return (
            <button
              key={opt.id}
              disabled={disabled}
              onClick={() => toggleOption(opt.id as string)}
              className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 group
                ${
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/5 text-emerald-50"
                    : "border-gray-800 bg-[#111114] text-gray-400 hover:border-gray-600"
                }
                ${disabled ? "opacity-30 cursor-not-allowed" : "cursor-pointer"}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
                  ${isSelected ? "bg-emerald-500 border-emerald-500" : "border-gray-700 bg-transparent group-hover:border-gray-500"}`}
                >
                  {isSelected && (
                    <span className="text-[#111114] text-[10px]">✔</span>
                  )}
                </div>
                <span className="text-sm font-mono">{opt.label}</span>
              </div>

              {!isSelected && isMaxReached && (
                <span className="text-[9px] font-mono text-[#e9c46a] tracking-tighter">
                  MAXIM ATINS
                </span>
              )}
            </button>
          );
        })}
      </div>

      {max > 1 && (
        <p className="text-[11px] font-mono text-[#e9c46a]">
          {selectedOptionIds.size}/{max} selecții utilizate
        </p>
      )}
    </div>
  );
}
