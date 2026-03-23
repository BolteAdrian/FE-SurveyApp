import { useTranslation } from "react-i18next";

export function QuestionResultCard({ question, index, onGoToComments }: any) {
  const { t } = useTranslation();
  const isChoice = !!question.stats;

  return (
    <div className="bg-[#1A1A22]/40 border border-gray-800/60 rounded-2xl p-6 md:p-8 space-y-6 hover:bg-[#1A1A22]/60 transition-all">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <h3 className="text-xl font-serif leading-tight max-w-2xl">
          <span className="text-[#e9c46a]/40 mr-3 font-mono text-sm">
            {String(index + 1).padStart(2, "0")}
          </span>
          {question.title}
        </h3>
        <span className="px-3 py-1 bg-[#111114] border border-gray-800 rounded-full text-[9px] font-mono text-blue-400 uppercase tracking-[0.2em] whitespace-nowrap">
          {isChoice
            ? t("RESULTS.CARD.TYPE_CHOICE")
            : t("RESULTS.CARD.TYPE_TEXT")}
        </span>
      </div>

      {isChoice ? (
        <div className="space-y-5">
          <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-xl text-[10px] font-mono text-yellow-600/60 leading-relaxed italic">
            Δ {t("RESULTS.CARD.MULTI_CHOICE_HINT")}
          </div>
          {question.stats.map((s: any) => (
            <div key={s.optionId} className="space-y-2">
              <div className="flex justify-between text-[11px] font-mono">
                <span className="text-gray-400">{s.label}</span>
                <span className="text-[#e9c46a] font-bold">
                  {s.percent}%{" "}
                  <span className="text-gray-600 font-normal">({s.count})</span>
                </span>
              </div>
              <div className="h-1.5 w-full bg-[#111114] rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-1000"
                  style={{ width: `${s.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pt-2">
          <button
            onClick={onGoToComments}
            className="group flex items-center gap-2 text-[10px] font-mono text-[#e9c46a] hover:text-[#f2d482] uppercase tracking-[0.2em] transition-all"
          >
            {t("RESULTS.CARD.VIEW_COMMENTS")}
            <span className="group-hover:translate-x-1 transition-transform">
              →
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
