import { useEffect, useState } from 'react';
import { publicApi } from '../api/publicApi';
import type { SurveyResponse, Answer } from '../types/survey';

export function useSurvey(slug: string, token: string) {
  const [data, setData] = useState<SurveyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setError('MISSING');
      setLoading(false);
      return;
    }

    publicApi
      .getSurvey(slug, token)
      .then((res) => {
        if ('message' in res) {
          setError(res.message);
        } else {
          setData(res);
        }
      })
      .catch(() => setError('INVALID'))
      .finally(() => setLoading(false));
  }, [slug, token]);

  const submit = async () => {
    if (!data) return;

    await publicApi.submitResponse(slug, token, answers);
  };

  return {
    data,
    error,
    answers,
    setAnswers,
    submit,
    loading,
  };
}