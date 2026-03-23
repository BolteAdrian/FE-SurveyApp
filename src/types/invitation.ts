import type { IEmailContact } from "./emailList";
import type { ISurvey } from "./survey";

export interface IInvitation {
  id: string;
  survey: ISurvey;
  contactId: string;
  contact: IEmailContact; 
  tokenHash: string;
  sentAt: Date;
  emailOpenedAt?: Date | null;
  surveyOpenedAt?: Date | null;
  submittedAt: Date | null;
  bouncedAt: Date | null;
  response?: IResponse | null;
}

export interface IResponse {
  id: string;
  surveyId: string;
  invitationId: string;
  submittedAt?: Date;
}

