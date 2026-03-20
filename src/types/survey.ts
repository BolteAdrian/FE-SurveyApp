export type SurveyStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export type QuestionType = 'MULTI_CHOICE' | 'TEXT';

export interface Survey {
  id: string;
  title: string;
  slug: string;
  status: SurveyStatus;
  questions: Question[];
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;

  // multi choice
  options?: Option[];
  max_selections?: number;

  // text
  max_length?: number;
}

export interface Option {
  id: string;
  label: string;
}

export interface Invitation {
  id: string;
  email: string;
  submittedAt: string | null;
}

export interface SurveyResponse {
  survey: Survey;
  invitation: Invitation;
}

/**
 * Answers
 */
export type Answer =
  | {
      question_id: string;
      option_ids: string[];
    }
  | {
      question_id: string;
      text_value: string;
    };