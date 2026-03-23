import type { ISurvey, ISurveyWithCount } from "../types/survey";
import type { LoginCredentials, RegisterData } from "../types/auth";
import { api } from "./client";
import type { IUser } from "../types/user";

export const adminApi = {
  login: async (credentials: LoginCredentials) => {
    const res = await api.post<{ data: { token: string; user: IUser } }>(
      "/api/auth/login",
      credentials,
    );
    return res.data.data;
  },

  register: async (data: RegisterData) => {
    const res = await api.post("/api/auth/register", data);
    return res.data;
  },

  getSurveys: async (status?: string) => {
    const res = await api.get<ISurveyWithCount[]>("/api/surveys", {
      params: status && { status },
    });
    return res.data;
  },

  getSurvey: async (id: string) => {
    const res = await api.get<ISurvey>(`/api/surveys/${id}`);
    return res.data;
  },

  updateSurvey: async (id: string, data: Partial<ISurvey>) => {
    const res = await api.put<ISurvey>(`/api/surveys/${id}`, data);
    return res.data;
  },

  createSurvey: async (data: Partial<ISurvey>) => {
    const res = await api.post<ISurvey>("/api/surveys", data);
    return res.data;
  },

  publishSurvey: async (id: string) => {
    const res = await api.post(`/api/surveys/${id}/publish`);
    return res.data;
  },

  closeSurvey: async (id: string) => {
    const res = await api.post(`/api/surveys/${id}/close`);
    return res.data;
  },

  deleteSurvey: async (id: string) => {
    const res = await api.delete(`/api/surveys/${id}`);
    return res.data;
  },

  createQuestion: async (surveyId: string, payload: any) => {
    const res = await api.post(`/api/surveys/${surveyId}/questions`, payload);
    return res.data;
  },

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
   * @param payload - { contacts: Array<{ email: string, name?: string }> }
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

  /*
   * Get Invitations
   */
  getInvitations: async (surveyId: string, page = 1, q = "") => {
    const res = await api.get(`/api/surveys/${surveyId}/invitations`, {
      params: { page, q },
    });
    return res.data;
  },

  /*
   * Get Invitations Preview
   */
  getInvitationsPreview: async (surveyId: string, listId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/invitations/preview`, {
      params: { list_id: listId },
    });
    return res.data;
  },

  /*
   * Send Invitations
   */
  sendInvitations: async (surveyId: string, listId: string) => {
    const res = await api.post(`/api/surveys/${surveyId}/invitations/send`, {
      listId,
    });
    return res.data;
  },
  /*
   * Survey Results
   */
  getSurveySummary: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/summary`);
    return res.data;
  },

  getSurveyQuestionStats: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/questions`);
    return res.data;
  },

  getSurveyComments: async (
    surveyId: string,
    params: { page?: number; q?: string; question_id?: string },
  ) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/comments`, {
      params,
    });
    return res.data;
  },
  exportSurveyCsv: async (surveyId: string) => {
    const res = await api.get(`/api/surveys/${surveyId}/results/export.csv`, {
      responseType: "blob", // Important pentru fișiere
    });
    return res.data;
  },
};
