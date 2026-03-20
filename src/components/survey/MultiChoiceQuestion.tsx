export default function MultiChoiceQuestion({
  question,
  answers,
  setAnswers,
}: any) {
  const selected = answers.find((a: any) => a.question_id === question.id);

  const toggleOption = (optionId: string) => {
    let selectedOptions = selected?.option_ids || [];

    if (selectedOptions.includes(optionId)) {
      selectedOptions = selectedOptions.filter((id: string) => id !== optionId);
    } else {
      if (selectedOptions.length >= question.max_selections) return;
      selectedOptions.push(optionId);
    }

    const updated = answers.filter((a: any) => a.question_id !== question.id);
    updated.push({
      question_id: question.id,
      option_ids: selectedOptions,
    });

    setAnswers(updated);
  };

  const isMaxReached =
    (selected?.option_ids || []).length >= question.max_selections;

  return (
    <div>
      <h3>{question.title}</h3>

      {question.options.map((opt: any) => {
        const isSelected = selected?.option_ids?.includes(opt.id);

        return (
          <div
            key={opt.id}
            style={{
              opacity: !isSelected && isMaxReached ? 0.4 : 1,
            }}
          >
            <input
              type="checkbox"
              checked={isSelected}
              disabled={!isSelected && isMaxReached}
              onChange={() => toggleOption(opt.id)}
            />
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}