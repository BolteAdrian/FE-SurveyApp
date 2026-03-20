import type { QuestionsProps, IOption } from "../../types/survey";

export default function MultiChoiceQuestion({
  question,
  answers,
  setAnswers,
}: QuestionsProps) {
  // These are the answers for this specific question
  const questionAnswers = answers.filter(
    (a) => "optionId" in a && a.questionId === question.id,
  ) as ({ questionId: string; optionId: string })[];

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
    <div>
      <h3 className="font-semibold">{question.title}</h3>
      {max > 1 && (
        <p className="text-sm text-gray-500">
          Select up to {max} options
        </p>
      )}

      <div className="mt-2 space-y-1">
        {question.options?.map((opt: IOption) => {
          const isSelected = selectedOptionIds.has(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => toggleOption(opt.id)}
              className="p-2 rounded-lg flex items-center"
              style={{
                opacity: !isSelected && isMaxReached ? 0.6 : 1,
                cursor:
                  !isSelected && isMaxReached ? "not-allowed" : "pointer",
              }}
            >
              <input
                type={max > 1 ? "checkbox" : "radio"}
                name={question.id}
                checked={isSelected}
                readOnly
                disabled={!isSelected && isMaxReached}
                className="mr-2"
              />
              <label>{opt.label}</label>
            </div>
          );
        })}
      </div>
    </div>
  );
}