import { useEffect, useState } from "react";
import { publicApi } from "../api/publicApi";
import type { SurveyResponse, IAnswer } from "../types/survey";
import { validateAnswers } from "../utils/validateAnswers";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useSurvey(slug: string, token: string) {
  const [data, setData] = useState<SurveyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<IAnswer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (!token) {
      setError("INVALID_LINK");
      setLoading(false);
      return;
    }

    publicApi
      .getSurvey(slug, token)
      .then((res) => {
        if ("message" in res) {
          setError(res.message);
        } else {
          setData(res);
        }
      })
      .catch(() => setError("INVALID_LINK"))
      .finally(() => setLoading(false));
  }, [slug, token]);

  const submit = async () => {
    const questions = data?.invitation?.survey?.questions;

    if (!questions) {
      console.log(
        "DEBUG: Nu am găsit întrebări în data.invitation.survey.questions",
      );
      return;
    }

    const validationErrors = validateAnswers(questions, answers, t);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorId = Object.keys(validationErrors)[0];
      document
        .getElementById(firstErrorId)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await publicApi.submitResponse(slug, token, answers);
      navigate("/submitted");
    } catch (err: any) {
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
