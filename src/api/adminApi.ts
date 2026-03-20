import type { Survey } from '../types/survey';
import { api } from './client';

export const adminApi = {
  getSurveys: async () => {
    const res = await api.get<Survey[]>('/api/admin/surveys');
    return res.data;
  },

  createSurvey: async (data: { title: string }) => {
    const res = await api.post<Survey>('/api/admin/surveys', data);
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