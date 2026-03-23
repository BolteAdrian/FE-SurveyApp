import { QuestionType, type QuestionsProps } from "../../../types/survey";
import MultiChoiceQuestion from "./MultiChoiceQuestion";
import TextQuestion from "./TextQuestion";

export default function QuestionRenderer({ question, ...props }: QuestionsProps) {
  switch (question.type) {
    case QuestionType.CHOICE:
      return <MultiChoiceQuestion question={question} {...props} />;

    case QuestionType.TEXT:
      return <TextQuestion question={question} {...props} />;

    default:
      return null;
  }
}