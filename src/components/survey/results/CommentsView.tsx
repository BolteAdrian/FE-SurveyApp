import { useTranslation } from "react-i18next";

interface CommentsViewProps {
  comments: any[];
  loading: boolean;
  questions: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export function CommentsView({
  comments,
  loading,
  questions,
  selectedId,
  onSelect,
  searchQuery,
  setSearchQuery,
}: CommentsViewProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            className="w-full bg-[#111114] border border-gray-800 rounded-xl py-4 px-6 text-sm outline-none focus:border-[#e9c46a]/30 transition-all font-mono text-white"
            placeholder={t("RESULTS.COMMENTS_SECTION.SEARCH_PLACEHOLDER")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="bg-[#111114] border border-gray-800 rounded-xl px-6 py-4 text-xs font-mono outline-none text-gray-400 focus:text-white appearance-none cursor-pointer"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">
            {t("RESULTS.COMMENTS_SECTION.SELECT_QUESTION")}
          </option>
          {questions.map((q) => (
            <option key={q.id} value={q.id}>
              {q.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="py-20 text-center font-mono text-gray-600 animate-pulse uppercase tracking-tighter">
          {t("RESULTS.LOADING_COMMENTS")}
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((ans) => (
            <div
              key={ans.id}
              className="bg-[#1A1A22] p-6 rounded-2xl border border-gray-800/40 hover:border-gray-700 transition-all group"
            >
              <p className="text-[#e8e6e1] italic leading-relaxed text-sm md:text-base">
                "{ans.textValue}"
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-gray-600 border-t border-gray-800/50 mt-4 pt-4">
                <span>
                  {ans.response?.invitation?.contact?.email ||
                    t("RESULTS.COMMENTS_SECTION.ANONYMOUS")}
                </span>
                <span>
                  {new Date(ans.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}

          {comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-600 border border-dashed border-gray-800 rounded-3xl">
              <p className="font-mono text-xs uppercase tracking-widest">
                {t("RESULTS.COMMENTS_SECTION.EMPTY")}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
