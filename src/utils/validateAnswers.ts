import { type IQuestion, type IAnswer, QuestionType } from "../types/survey";

export function validateAnswers(
  questions: IQuestion[],
  answers: IAnswer[],
  t: (key: string, options?: any) => string,
) {
  const errors: Record<string, string> = {};

  for (const q of questions) {
    const questionAnswers = answers.filter((a) => a.questionId === q.id);

    if (q.type === QuestionType.CHOICE) {
      if (q.required && questionAnswers.length === 0) {
        errors[q.id as string] = t("VALIDATION.REQUIRED_CHOICE");
      }

      if (q.maxSelections && questionAnswers.length > q.maxSelections) {
        errors[q.id as string] = t("VALIDATION.MAX_SELECTIONS", {
          count: q.maxSelections,
        });
      }
    }

    if (q.type === QuestionType.TEXT) {
      const answer = questionAnswers[0];

      const textVal = answer && "textValue" in answer ? answer.textValue : "";

      if (q.required && (!textVal || textVal.trim() === "")) {
        errors[q.id as string] = t("VALIDATION.REQUIRED_FIELD");
      }

      if (q.maxLength && textVal.length > q.maxLength) {
        errors[q.id as string] = t("VALIDATION.MAX_LENGTH", {
          count: q.maxLength,
        });
      }
    }
  }

  return errors;
}
