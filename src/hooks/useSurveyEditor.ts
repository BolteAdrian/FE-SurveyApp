import { useEffect, useState } from "react";
import { QuestionType, SurveyStatus } from "../types/survey";
import { adminApi } from "../api/adminApi";
import { generateSlug } from "../utils/helpers";
import { useSurveyContext } from "../contexts/SurveyContext";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook for managing survey creation and editing.
 * Handles fetching, updating, deleting questions, and saving surveys.
 */
export function useSurveyEditor(surveyId?: string) {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [status, setStatus] = useState<
    (typeof SurveyStatus)[keyof typeof SurveyStatus]
  >(SurveyStatus.DRAFT);
  const { questions, setQuestions } = useSurveyContext();
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  /**
   * Fetch survey data when a surveyId is provided.
   * Populates title, description, slug, and questions from API.
   */
  useEffect(() => {
    if (surveyId) {
      const getSurvey = async () => {
        try {
          setLoading(true);
          const survey = await adminApi.getSurvey(surveyId);
          if (survey) {
            setTitle(survey.title);
            setDescription(survey.description || "");
            setSlug(survey.slug);
            setStatus(survey.status);
            setQuestions(survey.questions || []);
          }
        } catch (err) {
          console.error(err);
          toast.error(t("SURVEY.LOAD_ERROR"));
        } finally {
          setLoading(false);
        }
      };
      getSurvey();
    }
  }, [surveyId, setQuestions, t]);

  const handleTitleBlur = () => {
    if (!slug) {
      setSlug(generateSlug(title));
    }
  };

  /**
   * Deletes a question from the survey.
   * @param questionId - The API ID of the question to delete (optional).
   * @param index - Index in the local questions array to remove.
   */
  const deleteQuestion = async (questionId?: string, index?: number) => {
    try {
      if (!surveyId) return;

      if (questionId) await adminApi.deleteQuestion(surveyId, questionId);

      setQuestions((prev) => prev.filter((_, i) => i !== index));
      toast.success(t("SURVEY.DELETE_SUCCESS"));
    } catch (err) {
      console.error(err);
      toast.error(t("SURVEY.DELETE_ERROR"));
    }
  };

  /**
   * Saves the survey as draft or publishes it.
   * Handles creating a new survey or updating an existing one.
   * @param status - Desired survey status (DRAFT or PUBLISHED)
   */
  const saveSurvey = async (
    statusSurvey: (typeof SurveyStatus)[keyof typeof SurveyStatus],
  ) => {
    try {
      setLoading(true);

      const payload = {
        title,
        slug,
        ownerId: user?.id,
        description,
        status: statusSurvey,
      };

      if (surveyId) {
        // Update existing survey
        await adminApi.updateSurvey(surveyId, payload);
        toast.success(
          status === SurveyStatus.DRAFT
            ? t("SURVEY.DRAFT_SAVED")
            : t("SURVEY.PUBLISHED_SUCCESS"),
        );
      } else {
        // Create new survey with questions
        await adminApi.createSurvey({
          ...payload,
          questions: questions.map((q, index) => ({
            title: q.title,
            type: q.type,
            required: q.required || false,
            order: index,
            maxSelections: q.maxSelections,
            maxLength: q.maxLength,
            options:
              q.type === QuestionType.CHOICE
                ? q.options?.map((opt, i) => ({ label: opt.label, order: i }))
                : undefined,
          })),
        });
        toast.success(
          status === SurveyStatus.DRAFT
            ? t("SURVEY.DRAFT_SAVED")
            : t("SURVEY.PUBLISHED_SUCCESS"),
        );
      }
      navigate("/admin");
    } catch (err) {
      console.error(err);
      toast.error(t("SURVEY.SAVE_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  return {
    status,
    title,
    setTitle,
    description,
    setDescription,
    slug,
    setSlug,
    setQuestions,
    deleteQuestion,
    saveSurvey,
    loading,
    handleTitleBlur,
  };
}
