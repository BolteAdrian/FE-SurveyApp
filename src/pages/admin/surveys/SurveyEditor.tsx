import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams } from "react-router-dom";
import { useSurveyContext } from "../../../contexts/SurveyContext";
import { useSurveyEditor } from "../../../hooks/useSurveyEditor";
import {
  SurveyStatus,
  QuestionType,
  type IQuestion,
} from "../../../types/survey";
import { useEffect, useState } from "react";
import QuestionEditor from "./QuestionEditor";
import { useTranslation } from "react-i18next";
import { Trash2, GripVertical, Edit2, Save, Rocket } from "lucide-react"; // Am adăugat Save și Rocket
import { adminApi } from "../../../api/adminApi";
import { toast } from "react-toastify";
import { ConfirmModal } from "../../../components/ConfirmModal";

export default function SurveyEditor() {
  const { t } = useTranslation();
  const { id } = useParams();
  const surveyId = id;

  const { questions, setQuestions } = useSurveyContext();
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null,
  );
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [questionToDelete, setQuestionToDelete] = useState<{
    id: string;
    index: number;
  } | null>(null);

  const {
    title,
    setTitle,
    description,
    setDescription,
    slug,
    setSlug,
    status,
    saveSurvey,
    loading,
    deleteQuestion,
    handleTitleBlur,
  } = useSurveyEditor(surveyId);

  const isReadOnly = status !== SurveyStatus.DRAFT && !!surveyId;

  useEffect(() => {
    if (!surveyId) setQuestions([]);
  }, [surveyId, setQuestions]);

  const isSaveDisabled =
    isReadOnly ||
    !title.trim() ||
    questions.length === 0 ||
    questions.some((q) => !q.title.trim());

  const onDragEnd = async (result: any) => {
    if (!result.destination || isReadOnly) return;
    const items = Array.from(questions);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const updated = items.map((q, index) => ({ ...q, order: index }));
    setQuestions(updated);

    if (surveyId) {
      try {
        await Promise.all(
          updated.map((q) =>
            q.id
              ? adminApi.updateQuestion(surveyId, q.id, { order: q.order })
              : Promise.resolve(),
          ),
        );
        toast.success(t("SURVEY.ORDER_UPDATED"));
      } catch (err) {
        toast.error(t("SURVEY.ORDER_UPDATE_ERROR"));
      }
    }
  };

  const startAddQuestion = (type: keyof typeof QuestionType) => {
    if (isReadOnly) return;
    const newQuestion: IQuestion =
      type === QuestionType.CHOICE
        ? {
            type,
            title: "",
            order: questions.length,
            maxSelections: 1,
            required: false,
            options: [{ label: "" }, { label: "" }],
          }
        : { type, title: "", required: false, order: questions.length };
    setEditingQuestion(newQuestion);
  };

  const handleDeleteClick = (id: string, index: number) => {
    if (isReadOnly) return;
    setConfirmOpen(true);
    setQuestionToDelete({ id, index });
  };

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      deleteQuestion(questionToDelete.id, questionToDelete.index);
      setQuestionToDelete(null);
      setConfirmOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setQuestionToDelete(null);
    setConfirmOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#111114] text-[#e8e6e1] flex flex-col lg:flex-row gap-8 p-4 md:p-8">
      <ConfirmModal
        isOpen={confirmOpen}
        title={t("SURVEY.CONFIRM_DELETE_QUESTION")}
        message={t("SURVEY.ARE_YOU_SURE_DELETE")}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
      <div className="w-full lg:w-80 space-y-6">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-[9px]">
          {t("SURVEY.DETAILS")}
        </h2>
        <div className="space-y-4 bg-[#1e1e24]/50 p-4 rounded-xl lg:bg-transparent lg:p-0">
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-mono">
              {t("SURVEY.TITLE")} *
            </label>
            <input
              disabled={isReadOnly}
              className="w-full bg-[#1e1e24] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-500 transition-all disabled:opacity-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-mono">
              {t("SURVEY.DESCRIPTION")}
            </label>
            <textarea
              disabled={isReadOnly}
              className="w-full bg-[#1e1e24] border border-gray-800 p-3 rounded-lg outline-none focus:border-blue-500 min-h-[100px] disabled:opacity-50"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-mono">
              {t("SURVEY.SLUG")} *
            </label>
            <input
              disabled={isReadOnly}
              className="w-full bg-[#1e1e24] mb-2 border border-gray-800 p-3 rounded-lg text-green-500 font-mono text-sm disabled:opacity-50"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="block text-xs text-gray-500 font-mono">
              {t("SURVEY.AUTO_GENERATED_SLUG")}
            </p>
          </div>
        </div>

        {!isReadOnly && (
          <div className="space-y-4">
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest border-t border-gray-800 pt-6">
              {t("SURVEY.ACTIONS")}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              <button
                onClick={() => saveSurvey(SurveyStatus.DRAFT)}
                disabled={loading || isSaveDisabled}
                className="py-3 rounded-lg font-medium border border-gray-700 bg-[#1e1e24] text-white hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                <Save size={16} />
                {t("SURVEY.SAVE_DRAFT")}
              </button>
              <button
                onClick={() => saveSurvey(SurveyStatus.PUBLISHED)}
                disabled={loading || isSaveDisabled}
                className="py-3 rounded-lg font-bold bg-[#e9c46a] text-[#111114] hover:bg-[#dfb755] disabled:opacity-50 transition-all shadow-lg shadow-yellow-900/10 flex items-center justify-center gap-2"
              >
                <Rocket size={16} />
                {t("SURVEY.PUBLISH")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 max-w-4xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-500 font-mono text-sm uppercase tracking-tighter">
            {t("SURVEY.QUESTIONS")}{" "}
            <span className="text-gray-700">({questions.length})</span>
          </h2>

          {!isReadOnly && (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => startAddQuestion(QuestionType.CHOICE)}
                className="flex-1 sm:flex-none bg-[#1A1A22] px-4 py-2 rounded-lg border border-gray-800 text-xs font-mono hover:border-gray-600 transition-all"
              >
                + {t("SURVEY.MULTI_CHOICE")}
              </button>
              <button
                onClick={() => startAddQuestion(QuestionType.TEXT)}
                className="flex-1 sm:flex-none bg-[#1A1A22] px-4 py-2 rounded-lg border border-gray-800 text-xs font-mono hover:border-gray-600 transition-all"
              >
                + {t("SURVEY.FREE_TEXT")}
              </button>
            </div>
          )}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions" isDropDisabled={isReadOnly}>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {questions.map((q, index) => (
                  <Draggable
                    key={q.id || `temp-${index}`}
                    draggableId={q.id || `temp-${index}`}
                    index={index}
                    isDragDisabled={isReadOnly}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-[#1e1e24] border ${snapshot.isDragging ? "border-yellow-500/50 shadow-2xl scale-[1.02]" : "border-gray-800"} p-4 md:p-6 rounded-xl transition-all`}
                      >
                        <div className="flex gap-3 md:gap-4">
                          {!isReadOnly && (
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1 text-gray-700 hover:text-gray-400 p-1"
                            >
                              <GripVertical size={20} />
                            </div>
                          )}

                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                              <div className="flex items-baseline gap-2">
                                <span className="text-gray-600 font-mono text-sm">
                                  {index + 1}.
                                </span>
                                <p className="text-[#e8e6e1] font-medium break-words">
                                  {q.title || (
                                    <span className="italic text-gray-600">
                                      {t("SURVEY.NO_TITLE")}
                                    </span>
                                  )}
                                </p>
                              </div>

                              {!isReadOnly && (
                                <div className="hidden md:flex gap-2">
                                  <button
                                    onClick={() => setEditingQuestion(q)}
                                    className="p-2 bg-[#111114] border border-gray-800 text-gray-400 rounded-lg hover:text-[#e9c46a] transition-all"
                                  >
                                    <Edit2 size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteClick(q.id as string, index)
                                    }
                                    className="p-2 bg-[#111114] border border-gray-800 text-gray-500 rounded-lg hover:text-red-500 transition-all"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-3 items-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${q.type === QuestionType.CHOICE ? "bg-blue-900/20 text-blue-400 border-blue-800/50" : "bg-green-900/20 text-green-400 border-green-800/50"}`}
                              >
                                {q.type === QuestionType.CHOICE
                                  ? t("SURVEY.MULTI_CHOICE")
                                  : t("SURVEY.FREE_TEXT")}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${q.required ? "bg-yellow-500/10 text-[#e9c46a] border-yellow-500/30" : "bg-gray-800/50 text-gray-500 border-gray-700"}`}
                              >
                                {q.required
                                  ? t("SURVEY.REQUIRED")
                                  : t("SURVEY.OPTIONAL")}
                              </span>

                              {/* LIMITS PREVIEW */}
                              <span className="text-[10px] font-mono text-gray-600 lowercase">
                                {q.type === QuestionType.CHOICE
                                  ? `max ${q.maxSelections || 1} ${t("SURVEY.SELECTIONS")}`
                                  : `max ${q.maxLength || 1000} ${t("SURVEY.CHARACTERS")}`}
                              </span>
                            </div>

                            {/* OPTIONS PREVIEW */}
                            {q.type === QuestionType.CHOICE &&
                              q.options &&
                              q.options.length > 0 && (
                                <div className="pt-1 text-[11px] font-mono text-gray-500 flex flex-wrap gap-x-2">
                                  <span className="text-gray-600">
                                    {t("SURVEY.OPTIONS")}:
                                  </span>
                                  {q.options.map((opt, idx) => (
                                    <span key={idx}>
                                      {opt.label || `Option ${idx + 1}`}
                                      {idx < (q.options?.length || 0) - 1 && (
                                        <span className="ml-2 text-gray-800">
                                          •
                                        </span>
                                      )}
                                    </span>
                                  ))}
                                </div>
                              )}

                            {!isReadOnly && (
                              <div className="flex md:hidden gap-3 pt-2">
                                <button
                                  onClick={() => setEditingQuestion(q)}
                                  className="text-xs font-mono text-blue-400 flex items-center gap-1"
                                >
                                  <Edit2 size={12} /> {t("SURVEY.EDIT")}
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteClick(q.id as string, index)
                                  }
                                  className="text-xs font-mono text-red-500 flex items-center gap-1"
                                >
                                  <Trash2 size={12} /> {t("SURVEY.DELETE")}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!isReadOnly && (
          <button
            onClick={() => startAddQuestion(QuestionType.CHOICE)}
            className="w-full border border-dashed border-gray-800 p-6 mt-6 text-center text-gray-600 rounded-xl hover:border-blue-500/50 hover:text-blue-400 transition-all font-mono text-sm"
          >
            + {t("SURVEY.ADD_QUESTION")}
          </button>
        )}
      </div>

      {editingQuestion && !isReadOnly && (
        <QuestionEditor
          surveyId={surveyId}
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}
    </div>
  );
}
