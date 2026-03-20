export type SurveyStatus = "DRAFT" | "PUBLISHED" | "CLOSED";

export type QuestionType = "MULTI_CHOICE" | "TEXT";

export interface ISurvey {
  id?: string;
  title: string;
  slug: string;
  status: SurveyStatus;
  questions: IQuestion[];
}

export interface IQuestion {
  id?: string;
  title: string;
  type: QuestionType;

  // multi choice
  options?: IOption[];
  maxSelections?: number;

  // text
  maxLength?: number;
}

export interface IOption {
  id: string;
  label: string;
}

export interface Invitation {
  id: string;
  email: string;
  submittedAt: string | null;
}

export interface SurveyResponse {
  survey: ISurvey;
  invitation: Invitation;
}

/**
 * Answers
 */
export type IAnswer =
  | {
      questionId: string;
      optionId: string;
    }
  | {
      questionId: string;
      textValue: string;
    };

export interface QuestionsProps {
  question: IQuestion;
  answers: IAnswer[];
  setAnswers: (answers: IAnswer[]) => void;
}