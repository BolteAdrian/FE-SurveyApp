import type { IQuestion, IAnswer } from "../types/survey";

export function validateAnswers(
  questions: IQuestion[],
  answers: IAnswer[]
) {
  const errors: Record<string, string> = {};

  for (const q of questions) {
    const answer = answers.find((a) => a.questionId === q.id);

    if (q.type === 'MULTI_CHOICE') {
      const selected = answer?.optionId;

      if (!selected.length) {
        errors[q.id] = 'Please select at least one option';
      }

      if (
        q.max_selections &&
        selected.length > q.max_selections
      ) {
        errors[q.id] = `Max ${q.max_selections} selections`;
      }
    }

    if (q.type === 'TEXT') {
      const text = answer?.textValue || '';

      if (!text.trim()) {
        errors[q.id] = 'Required field';
      }

      if (q.max_length && text.length > q.max_length) {
        errors[q.id] = `Max ${q.max_length} chars`;
      }
    }
  }

  return errors;
}