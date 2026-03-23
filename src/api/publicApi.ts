import type { SurveyResponse, IAnswer } from "../types/survey";
import { api } from "./client";

/**
 * API services for public-facing survey interactions.
 * These routes typically use slugs and tokens instead of internal IDs for security.
 */
export const publicApi = {
  /**
   * Fetch a survey's structure and metadata for a participant.
   * @param slug - The unique human-readable identifier for the survey.
   * @param token - The unique access token for the participant.
   */
  async getSurvey(slug: string, token: string) {
    const res = await api.get<SurveyResponse | { message: string }>(
      `/s/${slug}?t=${token}`,
    );
    return res.data;
  },

  /**
   * Submit a participant's answers for a specific survey.
   * @param slug - The unique identifier for the survey.
   * @param token - The participant's access token to validate the response.
   * @param answers - An array of answer objects containing question IDs and values.
   */
  async submitResponse(slug: string, token: string, answers: IAnswer[]) {
    const res = await api.post(
      `/api/public/surveys/${slug}/responses?t=${token}`,
      { answers },
    );
    return res.data;
  },
};
