import { useState } from "react";
import {
  QuestionType,
  type IOption,
  type IQuestion,
} from "../../../types/survey";
import { useSurveyContext } from "../../../contexts/SurveyContext";
import { adminApi } from "../../../api/adminApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

type QuestionEditorProps = {
  surveyId?: string;
  question?: IQuestion;
  onClose: () => void;
};

export default function QuestionEditor({
  surveyId,
  question,
  onClose,
}: QuestionEditorProps) {
  const { t } = useTranslation();
  const { questions, setQuestions } = useSurveyContext();
  const navigate = useNavigate();
  const [type, setType] = useState<keyof typeof QuestionType>(
    question?.type as keyof typeof QuestionType,
  );
  const [title, setTitle] = useState(question?.title || "");
  const [required, setRequired] = useState<boolean>(
    question?.required || false,
  );
  const [options, setOptions] = useState<string[]>(
    question?.options?.map((o: IOption) => o.label) || ["", ""],
  );
  const [maxSelections, setMaxSelections] = useState(
    question?.maxSelections || 1,
  );
  const [maxLength, setMaxLength] = useState(question?.maxLength || 1000);
  const isSaveDisabled =
    !title.trim() ||
    (type === QuestionType.CHOICE && options.some((o) => !o.trim()));

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error(t("SURVEY.ENTER_QUESTION_TEXT"));
      return;
    }

    const payload: any = {
      type,
      title,
      required,
      order: question?.order ?? questions.length,
      maxSelections,
      maxLength,
      options:
        type === QuestionType.CHOICE
          ? options.map((o, i) => ({ label: o, order: i }))
          : undefined,
    };

    try {
      const isRealQuestion =
        question?.id && !question.id.toString().includes("temp");

      if (surveyId && isRealQuestion) {

        const saved = await adminApi.updateQuestion(
          surveyId,
          question.id as string,
          payload,
        );
        setQuestions((prev) =>
          prev.map((q) => (q.id === question.id ? saved : q)),
        );
        toast.success(t("SURVEY.QUESTION_UPDATED"));
        navigate("/admin");
      } else if (surveyId && !question?.id) {
        const saved = await adminApi.createQuestion(surveyId, payload);
        setQuestions((prev) => [...prev, saved]);
        toast.success(t("SURVEY.QUESTION_CREATED"));
      } else {
        if (question?.id) {
          setQuestions((prev) =>
            prev.map((q) =>
              q.id === question.id ? { ...payload, id: q.id } : q,
            ),
          );
        } else {
          const tempQuestion: IQuestion = {
            ...payload,
            id: `temp-${Date.now()}`,// temporary id
          };
          setQuestions((prev) => [...prev, tempQuestion]);
        }
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(t("SURVEY.QUESTION_SAVE_ERROR"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="w-full max-w-2xl bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl m-4">
        {/* HEADER */}
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-600 ml-4 uppercase tracking-widest">
            {t("SURVEY.MODAL")} —{" "}
            {question ? t("SURVEY.EDIT_QUESTION") : t("SURVEY.NEW_QUESTION")}
          </span>
        </div>

        <div className="p-10 space-y-8">
          <h2 className="text-3xl font-serif text-[#e8e6e1]">
            {question ? t("SURVEY.EDIT_QUESTION") : t("SURVEY.NEW_QUESTION")}
          </h2>

          {/* TYPE */}
          <div className="flex gap-3">
            <button
              onClick={() => setType("CHOICE")}
              className={`px-4 py-2 rounded-lg border text-xs font-mono ${type === "CHOICE" ? "bg-[#e9c46a] text-black" : "bg-[#1A1A22] border-gray-800 text-gray-500"}`}
            >
              ▣ {t("SURVEY.MULTI_CHOICE")}
            </button>
            <button
              onClick={() => setType("TEXT")}
              className={`px-4 py-2 rounded-lg border text-xs font-mono ${type === "TEXT" ? "bg-[#e9c46a] text-black" : "bg-[#1A1A22] border-gray-800 text-gray-500"}`}
            >
              ≡ {t("SURVEY.FREE_TEXT")}
            </button>
          </div>

          {/* TITLE */}
          <input
            className="w-full bg-[#1A1A22] border border-gray-800 p-4 rounded-xl text-white"
            placeholder={t("SURVEY.QUESTION_TEXT_PLACEHOLDER")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* REQUIRED */}
          <label className="flex gap-2 text-sm text-gray-400">
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
            {t("SURVEY.REQUIRED")}
          </label>

          {/* OPTIONS */}
          {type === "CHOICE" && (
            <div className="space-y-3">
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="flex-1 bg-[#1A1A22] border border-gray-800 p-3 rounded-xl"
                    value={opt}
                    onChange={(e) => {
                      const updated = [...options];
                      updated[i] = e.target.value;
                      setOptions(updated);
                    }}
                  />
                  <button
                    onClick={() =>
                      setOptions(options.filter((_, idx) => idx !== i))
                    }
                  >
                    🗑
                  </button>
                </div>
              ))}
              <button
                onClick={() => setOptions((prev) => [...prev, ""])}
                className="text-xs text-gray-500"
              >
                + {t("SURVEY.ADD_OPTION")}
              </button>
            </div>
          )}

          {/* LIMITS */}
          {type === "CHOICE" ? (
            <input
              type="number"
              value={maxSelections}
              onChange={(e) => setMaxSelections(Number(e.target.value))}
              className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl"
              placeholder={t("SURVEY.MAX_SELECTIONS_INPUT")}
            />
          ) : (
            <input
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl"
              placeholder={t("SURVEY.MAX_LENGTH_INPUT")}
            />
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6">
            <button onClick={onClose} className="text-gray-500">
              {t("SURVEY.CANCEL")}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaveDisabled}
              className={`px-6 py-2 rounded-xl font-bold transition-all
      ${
        isSaveDisabled
          ? "bg-yellow-300 text-gray-800 cursor-not-allowed"
          : "bg-[#e9c46a] text-black hover:bg-[#dfb755]"
      }
    `}
            >
              {t("SURVEY.SAVE")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
