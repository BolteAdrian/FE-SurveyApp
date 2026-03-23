import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { SurveyResponse, IAnswer } from "../types/survey";
import { validateAnswers } from "../utils/validateAnswers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

/**
 * Custom hook to handle survey logic:
 * - fetch survey data
 * - manage answers state
 * - validate answers
 * - submit responses
 */
export function useSurvey(slug: string, token: string) {
  // Survey data from API
  const [data, setData] = useState<SurveyResponse | null>(null);

  // General error (invalid link, submit failure, etc.)
  const [error, setError] = useState<string | null>(null);

  // User answers
  const [answers, setAnswers] = useState<IAnswer[]>([]);

  // Loading state for fetch + submit
  const [loading, setLoading] = useState<boolean>(true);

  // Validation errors per question (key = questionId)
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { t } = useTranslation();

  /**
   * Fetch survey data on mount or when slug/token changes
   */
  useEffect(() => {
    if (!token) {
      setError("INVALID_LINK");
      setLoading(false);
      return;
    }

    publicApi
      .getSurvey(slug, token)
      .then((res) => {
        // API may return an error object instead of survey data
        if ("message" in res) {
          setError(res.message);
        } else {
          setData(res);
        }
      })
      .catch(() => setError("INVALID_LINK"))
      .finally(() => setLoading(false));
  }, [slug, token]);

  /**
   * Submit survey answers
   */
  const submit = async () => {
    const questions = data?.invitation?.survey?.questions;

    // Safety check: no questions found
    if (!questions) {
      console.log(
        "DEBUG: No questions found in data.invitation.survey.questions",
      );
      return;
    }

    /**
     * Validate answers before submitting
     */
    const validationErrors = validateAnswers(questions, answers, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // Scroll to first invalid question
      const firstErrorId = Object.keys(validationErrors)[0];
      document
        .getElementById(firstErrorId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });

      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Submit answers to API
      await publicApi.submitResponse(slug, token, answers);

      // Redirect to success page
      navigate("/submitted");
    } catch (err: any) {
      /**
       * Handle known API error cases
       */
      if (err.response?.status === 409 || err.message === "ALREADY_SUBMITTED") {
        navigate("/already-submitted");
      } else if (err.response?.status === 410) {
        navigate("/closed");
      } else {
        setError("SUBMIT_FAILED");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Expose hook state and actions
   */
  return {
    data,
    errors,
    error,
    answers,
    setAnswers,
    submit,
    loading,
  };
}
