import type { IInvitation } from "./invitation";

export const SurveyStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  CLOSED: "CLOSED",
} as const;

export const QuestionType = {
  CHOICE: "CHOICE",
  TEXT: "TEXT",
} as const;

export interface ISurvey {
  id?: string;
  title: string;
  description: string;
  ownerId?: string;
  slug: string;
  status: (typeof SurveyStatus)[keyof typeof SurveyStatus];
  questions: IQuestion[];
  createdAt: Date;
  publishedAt: Date | null;
  closedAt: Date | null;
}

export interface ISurveyWithCount extends ISurvey {
  _count: {
    questions: number;
  };
}

export interface IQuestion {
  id?: string;
  title: string;
  type: (typeof QuestionType)[keyof typeof QuestionType];
  surveyId?: string;
  required: boolean;
  order: number;
  // multi choice
  options?: IOption[];
  maxSelections?: number;

  // text
  maxLength?: number;
}

export interface IOption {
  id?: string;
  label: string;
}

export interface SurveyResponse {
  survey: ISurvey;
  invitation: IInvitation;
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

export interface ISurveyStats {
  invited: number;
  sent: number;
  emailOpened: number;
  surveyOpened: number;
  submitted: number;
  bounced: number;
  title: string;
}

export interface IComment {
  id: string;
  responseId: string;
  questionId: string;
  textValue: string | null;
  optionId?: string | null;
  question: IQuestion;
}

export interface IQuestionWithStats extends IQuestion {
  stats: {
    optionId: string;
    label: string;
    count: number;
    percent: number;
  }[];
  totalAnswers: number;
}
