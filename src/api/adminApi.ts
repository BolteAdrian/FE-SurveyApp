import type { ISurvey } from '../types/survey';
import type { LoginCredentials, RegisterData } from '../types/auth';
import { api } from './client';

export const adminApi = {
  login: async (credentials: LoginCredentials) => {
    const res = await api.post<{ token: string }>('/api/admin/login', credentials);
    return res.data;
  },

  register: async (data: RegisterData) => {
    const res = await api.post('/api/admin/register', data);
    return res.data;
  },

  getSurveys: async () => {
    const res = await api.get<ISurvey[]>('/api/admin/surveys');
    return res.data;
  },

  createSurvey: async (data: { title: string }) => {
    const res = await api.post<ISurvey>('/api/admin/surveys', data);
    return res.data;
  },

  publishSurvey: async (id: string) => {
    const res = await api.post(`/api/admin/surveys/${id}/publish`);
    return res.data;
  },

  closeSurvey: async (id: string) => {
    const res = await api.post(`/api/admin/surveys/${id}/close`);
    return res.data;
  },
};