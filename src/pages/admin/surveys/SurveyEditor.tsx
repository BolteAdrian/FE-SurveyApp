
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useParams, useNavigate } from "react-router-dom";
import { useSurveyContext } from "../../../contexts/SurveyContext";
import { useSurveyEditor } from "../../../hooks/useSurveyEditor";
import { SurveyStatus, QuestionType } from "../../../types/survey";

export default function SurveyEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { questions, setQuestions } = useSurveyContext();
  const {
    title,
    setTitle,
    description,
    setDescription,
    slug,
    setSlug,
    saveSurvey,
    loading,
    deleteQuestion,
  } = useSurveyEditor(id);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
  };

  return (
    <div className="min-h-screen bg-[#111114] text-[#e8e6e1] flex gap-8 p-8">
      {/* LEFT PANEL */}
      <div className="w-80 space-y-6">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Detalii sondaj
        </h2>
        <div className="space-y-4">
          <input
            className="w-full bg-[#1e1e24] border border-gray-800 p-3 rounded-lg outline-none focus:border-gray-600 transition-all"
            placeholder="Titlu"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="w-full bg-[#1e1e24] border border-gray-800 p-3 rounded-lg outline-none focus:border-gray-600 min-h-[100px]"
            placeholder="Descriere"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div>
            <input
              className="w-full bg-[#1e1e24] border border-gray-800 p-3 rounded-lg text-green-500 font-mono text-sm"
              placeholder="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-[10px] text-gray-600 mt-1 ml-1 italic">
              Auto-generat din titlu
            </p>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button
            onClick={() => saveSurvey(SurveyStatus.DRAFT)}
            disabled={loading}
            className="w-full bg-[#1e1e24] border border-gray-700 py-3 rounded-lg hover:bg-gray-800 transition-all font-medium"
          >
            💾 Salvează draft
          </button>
          <button
            onClick={() => saveSurvey(SurveyStatus.PUBLISHED)}
            disabled={loading}
            className="w-full bg-[#e9c46a] text-[#111114] py-3 rounded-lg font-bold hover:bg-[#dfb755] transition-all shadow-lg shadow-yellow-900/10"
          >
            🚀 Publică sondaj
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="flex-1 max-w-4xl">
        <div className="flex justify-between items-center mb-2.5">
          <h2 className="text-gray-500 font-mono text-sm uppercase tracking-tighter">
            Întrebări{" "}
            <span className="text-gray-700">({questions.length})</span>
          </h2>

          <div className="flex gap-3">
            <button
              onClick={() =>
                navigate(`/admin/surveys/${id}/question/new?type=CHOICE`)
              }
              className="bg-[#1A1A22] px-4 py-1.5 rounded-lg border border-gray-800 text-xs font-mono hover:border-gray-600 transition-all"
            >
              + Multi-choice
            </button>
            <button
              onClick={() =>
                navigate(`/admin/surveys/${id}/question/new?type=TEXT`)
              }
              className="bg-[#1A1A22] px-4 py-1.5 rounded-lg border border-gray-800 text-xs font-mono hover:border-gray-600 transition-all"
            >
              + Text liber
            </button>
          </div>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
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
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`bg-[#1e1e24] border ${snapshot.isDragging ? "border-yellow-500/50 shadow-2xl" : "border-gray-800"} p-6 rounded-xl flex justify-between items-start group transition-all `}
                      >
                        <div className="flex gap-4">
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="mt-1 text-gray-700 hover:text-gray-400 cursor-grab active:cursor-grabbing"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                            >
                              <path d="M5 4h2V2H5v2zm4 0h2V2H9v2zm-4 5h2V7H5v2zm4 0h2V7H9v2zm-4 5h2v-2H5v2zm4 0h2v-2H9v2z" />
                            </svg>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-baseline gap-2 text-lg font-mono tracking-tight">
                              <span className="text-gray-600">
                                {index + 1}.
                              </span>
                              <p className="text-[#e8e6e1]">{q.title}</p>
                            </div>

                            <div className="flex gap-3 items-center">
                              <span
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                  q.type === QuestionType.CHOICE
                                    ? "bg-blue-900/20 text-blue-400 border-blue-800/50"
                                    : "bg-green-900/20 text-green-400 border-green-800/50"
                                }`}
                              >
                                {q.type === QuestionType.CHOICE
                                  ? "multi-choice"
                                  : "text liber"}
                              </span>

                              <span
                                className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest border ${
                                  q.required
                                    ? "bg-yellow-500/10 text-[#e9c46a] border-yellow-500/30"
                                    : "bg-gray-800/50 text-gray-500 border-gray-700"
                                }`}
                              >
                                {q.required ? "required" : "opțional"}
                              </span>

                              <span className="text-[10px] text-gray-600 font-mono">
                                {q.type === QuestionType.CHOICE
                                  ? `max ${q.maxSelections || 1} selecții`
                                  : `max ${q.maxLength || 1000} caractere`}
                              </span>
                            </div>

                            {q.type === QuestionType.CHOICE && (
                              <div className="text-xs text-gray-500 font-mono pt-2">
                                <span className="text-gray-600">Opțiuni:</span>{" "}
                                {q.options?.map((o) => o.label).join(" · ")}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/surveys/${id}/question/${q.id}`)
                            }
                            className="bg-[#111114] border border-gray-800 text-gray-400 px-4 py-1.5 rounded-lg text-xs font-mono hover:text-[#e9c46a] hover:border-[#e9c46a]/50 transition-all flex items-center gap-2"
                          >
                            <span>∞</span> Edit
                          </button>
                          <button
                            onClick={() => deleteQuestion(index)}
                            className="bg-[#111114] border border-gray-800 text-gray-500 px-2 py-1.5 rounded-lg hover:text-red-500 hover:border-red-500/50 transition-all"
                          >
                            <svg
                              width="16"
                              height="16"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
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

        <button
          onClick={() =>
            navigate(`/admin/surveys/${id}/question/new?type=CHOICE`)
          }
          className="w-full border border-dashed border-gray-800 p-8 mt-6 text-center text-gray-600 rounded-xl hover:border-gray-600 hover:text-gray-400 transition-all font-mono text-sm"
        >
          + Adaugă întrebare
        </button>
      </div>
    </div>
  );
}
