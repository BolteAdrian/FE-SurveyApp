import type { SurveyResponse, Answer } from '../types/survey';
import { api } from './client';

export const publicApi = {
  async getSurvey(slug: string, token: string) {
    const res = await api.get<SurveyResponse | { message: string }>(
      `/s/${slug}?t=${token}`
    );
    return res.data;
  },

  async submitResponse(slug: string, token: string, answers: Answer[]) {
    const res = await api.post(
      `/api/public/surveys/${slug}/responses?t=${token}`,
      { answers }
    );
    return res.data;
  },
};