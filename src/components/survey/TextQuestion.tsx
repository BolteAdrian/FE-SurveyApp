export default function TextQuestion({
  question,
  answers,
  setAnswers,
}: any) {
  const existing = answers.find((a: any) => a.question_id === question.id);

  const handleChange = (value: string) => {
    const updated = answers.filter((a: any) => a.question_id !== question.id);

    updated.push({
      question_id: question.id,
      text_value: value,
    });

    setAnswers(updated);
  };

  return (
    <div>
      <h3>{question.title}</h3>

      <textarea
        maxLength={question.max_length}
        value={existing?.text_value || ''}
        onChange={(e) => handleChange(e.target.value)}
      />

      <div>
        {(existing?.text_value?.length || 0)} / {question.max_length}
      </div>
    </div>
  );
}