import MultiChoiceQuestion from './MultiChoiceQuestion';
import TextQuestion from './TextQuestion';

export default function QuestionRenderer({ question, ...props }: any) {
  switch (question.type) {
    case 'MULTI_CHOICE':
      return <MultiChoiceQuestion question={question} {...props} />;

    case 'TEXT':
      return <TextQuestion question={question} {...props} />;

    default:
      return null;
  }
}