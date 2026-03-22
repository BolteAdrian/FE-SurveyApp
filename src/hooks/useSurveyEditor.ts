import { useEffect, useState } from "react";
import { QuestionType, SurveyStatus } from "../types/survey";
import { adminApi } from "../api/adminApi";
import { generateSlug } from "../utils/helpers";
import { useSurveyContext } from "../contexts/SurveyContext";

export function useSurveyEditor(surveyId?: string) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const { questions, setQuestions } = useSurveyContext();
  const [loading, setLoading] = useState<boolean>(false);

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
            setQuestions(survey.questions || []);
          }
        } catch (err) {
          console.error(err);
          alert("Eroare ❌");
        } finally {
          setLoading(false);
        }
      };
      getSurvey();
    }
  }, [surveyId, setQuestions]);

  useEffect(() => {
    if (!slug) {
      setSlug(generateSlug(title));
    }
  }, [title, slug]);

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  // 🔥 FORMAT FOR API
  const buildPayload = () => {
    return {
      title,
      slug,
      description,
      questions: questions.map((q, index) => ({
        title: q.title,
        surveyId: surveyId || "",
        type: q.type,
        required: q.required || false,
        order: index,
        maxSelections: q.maxSelections,
        maxLength: q.maxLength,
        options:
          q.type === QuestionType.CHOICE
            ? q.options?.map((opt, i) => ({
                label: opt.label,
                order: i,
              }))
            : undefined,
      })),
    };
  };

  // 🚀 SAVE
  const saveSurvey = async (
    status: (typeof SurveyStatus)[keyof typeof SurveyStatus],
  ) => {
    try {
      setLoading(true);

      const payload = {
        ...buildPayload(),
        status
      };

      if (surveyId) {
        await adminApi.updateSurvey(surveyId, payload);
      } else {
        await adminApi.createSurvey(payload);
      }

      alert(
        status === SurveyStatus.DRAFT
          ? "Draft salvat 💾"
          : "Survey publicat 🚀",
      );
    } catch (err) {
      console.error(err);
      alert("Eroare ❌");
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}
