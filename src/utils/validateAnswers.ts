import { type IQuestion, type IAnswer, QuestionType } from "../types/survey";

export function validateAnswers(
  questions: IQuestion[],
  answers: IAnswer[]
) {
  const errors: Record<string, string> = {};

  for (const q of questions) {
    if (!q.id) continue;

    const answer = answers.find((a) => a.questionId === q.id);

    if (q.type === QuestionType.CHOICE) {
      const selected = answer && 'optionId' in answer ? answer.optionId : '';

      if (!selected?.length) {
        errors[q.id] = 'Please select at least one option';
      }

      if (
        q.maxSelections && 
        selected.length > q.maxSelections
      ) {
        errors[q.id] = `Max ${q.maxSelections} selections`;
      }
    }

    if (q.type === QuestionType.TEXT) {
      const text = answer && 'textValue' in answer ? answer.textValue : '';

      if (!text.trim()) {
        errors[q.id] = 'Required field';
      }

      if (q.maxLength && text.length > q.maxLength) {
        errors[q.id] = `Max ${q.maxLength} chars`;
      }
    }
  }

  return errors;
}