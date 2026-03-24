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
import { Check, Trash2 } from "lucide-react";

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
            id: `temp-${Date.now()}`, // temporary id
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
          <span className="text-[10px] font-mono text-gray-600 ml-4 uppercase tracking-widest">
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
          <div className="space-y-1.5">
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider">
              {t("SURVEY.QUESTION_TEXT_PLACEHOLDER")} *
            </label>
            <input
              className="w-full bg-[#1A1A22] border border-gray-800 p-4 rounded-xl text-white outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* REQUIRED CHECKBOX */}
          <div className="flex items-center gap-3 py-2">
            <label className="relative flex items-center cursor-pointer group">
              <input
                type="checkbox"
                className="sr-only"
                checked={required}
                onChange={(e) => setRequired(e.target.checked)}
              />
              <div
                className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${
                  required
                    ? "bg-[#55d6a0] border-[#55d6a0]"
                    : "bg-[#1A1A22] border-gray-700 group-hover:border-gray-500"
                }`}
              >
                {required && (
                  <Check size={14} className="text-[#111114] stroke-[3px]" />
                )}
              </div>
              <span className="ml-3 text-sm font-medium text-gray-400 group-hover:text-gray-300 transition-colors">
                {t("SURVEY.REQUIRED")}
              </span>
            </label>
          </div>

          {/* OPTIONS SECTION */}
          {type === QuestionType.CHOICE && (
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                  {t("SURVEY.OPTIONS")} ({t("SURVEY.MIN_TWO")})
                </label>

                <div className="space-y-3">
                  {options.map((opt, i) => (
                    <div key={i} className="flex gap-2 group">
                      <input
                        className="flex-1 bg-[#1A1A22] border border-gray-800 p-3 rounded-xl"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...options];
                          updated[i] = e.target.value;
                          setOptions(updated);
                        }}
                        placeholder={`${t("SURVEY.OPTION")} ${i + 1}`}
                      />
                      <button
                        onClick={() =>
                          setOptions(options.filter((_, idx) => idx !== i))
                        }
                        className="p-3 bg-[#1A1A22] border border-gray-800 text-gray-500 rounded-xl hover:text-red-500 hover:border-red-500/50 transition-all"
                        title={t("SURVEY.DELETE_OPTION")}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ADD OPTION BUTTON */}
              <button
                type="button"
                onClick={() => setOptions((prev) => [...prev, ""])}
                className="mt-2 px-4 py-2 bg-[#1A1A22] border border-gray-800 rounded-lg text-[11px] font-mono text-gray-400 hover:text-white hover:border-gray-600 transition-all flex items-center justify-center w-fit"
              >
                + {t("SURVEY.ADD_OPTION")}
              </button>
            </div>
          )}

          {/* LIMITS (Max Selections / Max Length) */}
          <div className="space-y-1.5">
            <label className="block text-xs text-gray-500 font-mono uppercase tracking-wider">
              {type === QuestionType.CHOICE
                ? t("SURVEY.MAX_SELECTIONS_INPUT")
                : t("SURVEY.MAX_LENGTH_INPUT")}
            </label>
            {type === QuestionType.CHOICE ? (
              <input
                type="number"
                value={maxSelections}
                onChange={(e) => setMaxSelections(Number(e.target.value))}
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
              />
            ) : (
              <input
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(Number(e.target.value))}
                className="w-full bg-[#1A1A22] border border-gray-800 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
              />
            )}
          </div>

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
