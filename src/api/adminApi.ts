import type { ISurvey, ISurveyWithCount } from "../types/survey";
import type { LoginCredentials, RegisterData } from "../types/auth";
import { api } from "./client";
import type { IUser } from "../types/user";

export const adminApi = {
  /**
   * Authenticate a user and return a token and user data
   */
  login: async (credentials: LoginCredentials) => {
    const res = await api.post<{ data: { token: string; user: IUser } }>(
      "/api/auth/login",
      credentials,
    );
    return res.data.data;
  },

  /**
   * Register a new admin or user account
   */
  register: async (data: RegisterData) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  /**
   * Fetch a list of all surveys, optionally filtered by status
   */
  getSurveys: async (status?: string) => {
    const res = await api.get<ISurveyWithCount[]>("/api/surveys", {
      params: status && { status },
    });
    return res.data;
  },

  /**
   * Fetch details for a specific survey by its ID
   */
  getSurvey: async (id: string) => {
    const res = await api.get<ISurvey>(`/api/surveys/${id}`);
    return res.data;
  },

  /**
   * Update existing survey details
   */
  updateSurvey: async (id: string, data: Partial<ISurvey>) => {
    const res = await api.put<ISurvey>(`/api/surveys/${id}`, data);
    return res.data;
  },

  /**
   * Create a new survey draft
   */
  createSurvey: async (data: Partial<ISurvey>) => {
    const res = await api.post<ISurvey>("/api/surveys", data);
    return res.data;
  },

  /**
   * Change survey status to 'published' to make it live
   */
  publishSurvey: async (id: string) => {
    const res = await api.post(`/api/surveys/${id}/publish`);
    return res.data;
  },

  /**
   * Close a survey to stop accepting new responses
   */
  closeSurvey: async (id: string) => {
    const res = await api.post(`/api/surveys/${id}/close`);
    return res.data;
  },

  /**
   * Permanently delete a survey
   */
  deleteSurvey: async (id: string) => {
    const res = await api.delete(`/api/surveys/${id}`);
    return res.data;
  },

  /**
   * Add a new question to a specific survey
   */
  createQuestion: async (surveyId: string, payload: any) => {
    const res = await api.post(`/api/surveys/${surveyId}/questions`, payload);
    return res.data;
  },

  /**
   * Update a specific question within a survey
   */
  updateQuestion: async (
    surveyId: string,
    questionId: string,
    payload: any,
  ) => {
    const res = await api.put(
      `/api/surveys/${surveyId}/questions/${questionId}`,
      payload,
    );
    return res.data;
  },

  /**
   * Remove a question from a survey
   */
  deleteQuestion: async (surveyId: string, questionId: string) => {
    const res = await api.delete(
      `/api/surveys/${surveyId}/questions/${questionId}`,
    );
    return res.data;
  },

  /**
   * Fetch all email lists for a specific owner
   */
  getEmailLists: async (ownerId: string) => {
    const res = await api.get("/api/email-lists", {
      params: { ownerId },
    });
    return res.data;
  },

  /**
   * Create a new empty email list
   */
  createEmailList: async (data: { name: string; ownerId: string }) => {
    const res = await api.post("/api/email-lists", data);
    return res.data;
  },

  /**
   * Delete an email list and all its associated contacts
   */
  deleteEmailList: async (id: string) => {
    const res = await api.delete(`/api/email-lists/${id}`);
    return res.data;
  },

  /**
   * Import an array of contacts into a specific list
   */
  importContacts: async (listId: string, payload: { contacts: any[] }) => {
    const res = await api.post(`/api/email-lists/${listId}/import`, payload);
    return res.data;
  },

  /**
   * Fetch details for a single email list including its contacts
   */
  getEmailListDetails: async (listId: string) => {
    const res = await api.get(`/api/email-lists/${listId}`);
    return res.data;
  },

  /**
   * Add a single contact to a specific list
   */
  addContactToList: async (
    listId: string,
    data: { email: string; name?: string },
  ) => {
    const res = await api.post(`/api/email-lists/${listId}/contacts`, data);
    return res.data;
  },

  /**
   * Delete a specific contact from a list
   */
  deleteContactFromList: async (listId: string, contactId: string) => {
    const res = await api.delete(
      `/api/email-lists/${listId}/contacts/${contactId}`,
    );
    return res.data;
  },

  /**
   * Get a paginated list of invitations for a survey, with optional search
   */
  getInvitations: async (surveyId: string, page = 1, q = "") => {
    const res = await api.get(`/api/surveys/${surveyId}/invitations`, {
      params: { page, q },
    });
    return res.data;
  },

  /**
   * Preview invitations for a specific email list before sending
   */
  getInvitationsPreview: async (surveyId: string, listId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/invitations/preview`, {
      params: { list_id: listId },
    });
    return res.data;
  },

  /**
   * Send survey invitations to all contacts in a specific list
   */
  sendInvitations: async (surveyId: string, listId: string) => {
    const res = await api.post(`/api/surveys/${surveyId}/invitations/send`, {
      listId,
    });
    return res.data;
  },

  /**
   * Get an overview/summary of survey results (e.g., total responses)
   */
  getSurveySummary: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/summary`);
    return res.data;
  },

  /**
   * Get statistical data for each question in the survey
   */
  getSurveyQuestionStats: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/questions`);
    return res.data;
  },

  /**
   * Fetch open-ended comments/responses for a survey with filtering and pagination
   */
  getSurveyComments: async (
    surveyId: string,
    params: { page?: number; q?: string; question_id?: string },
  ) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/comments`, {
      params,
    });
    return res.data;
  },

  /**
   * Export survey results as a CSV file (returns a Blob)
   */
  exportSurveyCsv: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/export.csv`, {
      responseType: "blob",
    });
    return res.data;
  },
};
