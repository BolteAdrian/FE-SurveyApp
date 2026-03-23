import { useTranslation } from "react-i18next";
import type { IQuestionWithStats } from "../../../types/survey";

interface QuestionResultCardProps {
  question: IQuestionWithStats;
  index: number;
  onGoToComments: () => void;
}

export function QuestionResultCard({
  question,
  index,
  onGoToComments,
}: QuestionResultCardProps) {
  const { t } = useTranslation();
  const isChoice = question.stats && question.stats.length > 0;

  return (
    <div className="bg-[#16161a] border border-gray-800/40 rounded-2xl p-5 md:p-8 space-y-6">
      {/* HEADER CARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="space-y-2 w-full">
          <h3 className="text-lg md:text-xl font-serif text-[#e8e6e1] leading-snug">
            {index + 1}. {question.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-gray-600">
            <span className="text-blue-400/80 uppercase sm:hidden">
              {isChoice ? "multi-choice" : "text-liber"}
            </span>
            <span className="hidden sm:inline">
              {isChoice
                ? t("RESULTS.CARD.TYPE_CHOICE")
                : t("RESULTS.CARD.TYPE_TEXT")}
            </span>
            <span className="hidden sm:inline">•</span>
            <span>
              {isChoice
                ? t("RESULTS.CARD.MAX_SELECTIONS", {
                    count: question.maxSelections || 1,
                  })
                : t("RESULTS.CARD.MAX_CHARACTERS", {
                    count: question.maxLength || 1000,
                  })}
            </span>
            <span>•</span>
            <span className="text-gray-500">
              {t("RESULTS.CARD.RESPONSES_INFO", {
                count: question.totalAnswers || 0,
                total: 152,
              })}
            </span>
          </div>
        </div>

        {/* BADGE TIP */}
        <span className="hidden sm:block px-3 py-1 bg-[#1e1e24] border border-gray-800 rounded text-[10px] font-mono text-blue-400/80 uppercase tracking-wider whitespace-nowrap">
          {isChoice ? "multi-choice" : "text-liber"}
        </span>
      </div>

      {isChoice ? (
        <div className="space-y-6">
          {/* HINT BOX */}
          <div className="relative bg-[#f3d382]/5 border-l-2 border-[#f3d382]/40 p-3 md:p-4 rounded-r-lg text-[11px] md:text-[12px] font-mono text-gray-500 leading-relaxed">
            <span className="text-gray-400 mr-1">Δ</span>
            {t("RESULTS.CARD.MULTI_CHOICE_HINT", {
              count: question.totalAnswers,
            })}
          </div>

          {/* PROGRESS BARS */}
          <div className="space-y-5">
            {question.stats.map((s) => (
              <div key={s.optionId} className="space-y-2">
                <div className="flex justify-between items-end text-[11px] md:text-[12px] font-mono">
                  <span className="text-gray-400 flex-1 pr-4">{s.label}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-gray-300 font-bold">
                      {s.percent}%
                    </span>
                    <span className="text-gray-600 text-[10px]">
                      ({s.count})
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full bg-[#111114] rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-1000"
                    style={{
                      width: `${s.percent}%`,
                      backgroundColor: "#5ef0b4",
                      boxShadow: "0 0 10px rgba(94, 240, 180, 0.2)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-end pt-2">
          <button
            onClick={onGoToComments}
            className="w-full sm:w-auto flex justify-center items-center gap-2 px-5 py-3 bg-[#111114] border border-gray-800 rounded-lg text-[10px] font-mono text-gray-400 hover:text-white transition-all uppercase tracking-[0.2em]"
          >
            {t("RESULTS.CARD.VIEW_COMMENTS")}
            <span className="text-xs">→</span>
          </button>
        </div>
      )}
    </div>
  );
}
