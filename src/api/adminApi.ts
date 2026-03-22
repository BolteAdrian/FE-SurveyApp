import type { ISurvey, ISurveyWithCount, IUser } from "../types/survey";
import type { LoginCredentials, RegisterData } from "../types/auth";
import { api } from "./client";

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
};
