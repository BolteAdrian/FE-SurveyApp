import { useState, useMemo } from "react";
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


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedId]);

  const totalPages = Math.ceil(comments.length / itemsPerPage);

  const currentComments = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return comments.slice(indexOfFirstItem, indexOfLastItem);
  }, [comments, currentPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* FILTRE: SEARCH & SELECT */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
            🔍
          </span>
          <input
            className="w-full bg-[#111114] border border-gray-800 rounded-xl py-3 px-10 text-sm outline-none focus:border-[#e9c46a]/30 transition-all font-mono text-white"
            placeholder={t("RESULTS.COMMENTS_SECTION.SEARCH_PLACEHOLDER")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="w-full md:w-64 bg-[#111114] border border-gray-800 rounded-xl px-6 py-3 text-xs font-mono outline-none text-[#e8e6e1] appearance-none cursor-pointer"
            value={selectedId}
            onChange={(e) => onSelect(e.target.value)}
          >
            <option value="">
              {t("RESULTS.COMMENTS_SECTION.SELECT_QUESTION")}
            </option>
            {questions.map((q) => (
              <option key={q.id} value={q.id}>
                {q.id ? `Q${q.order || ""}: ` : ""}
                {q.title}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
            ▼
          </span>
        </div>
      </div>

      {/* STATS: NUMAR RASPUNSURI */}
      {!loading && comments.length > 0 && (
        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest px-1">
          {comments.length} {t("RESULTS.COMMENTS_SECTION.RESPONSES_COUNT")} ·
          pagina {currentPage} din {totalPages || 1}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center font-mono text-gray-600 animate-pulse uppercase tracking-widest">
          {t("RESULTS.LOADING")}
        </div>
      ) : (
        <div className="space-y-4">
          {currentComments.map((ans) => (
            <div
              key={ans.id}
              className="bg-[#1A1A22]/60 p-6 rounded-xl border border-gray-800/40 hover:border-gray-700/60 transition-all group"
            >
              <p className="text-[#e8e6e1] italic leading-relaxed text-sm md:text-base mb-4">
                „{ans.textValue}”
              </p>
              <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 border-t border-gray-800/30 pt-4">
                <span className="hover:text-gray-400 transition-colors">
                  {ans.response?.invitation?.contact?.email ||
                    t("RESULTS.COMMENTS_SECTION.ANONYMOUS")}
                </span>
                <span className="text-gray-800">·</span>
                <span>
                  {new Date(ans.createdAt).toLocaleDateString("ro-RO", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* EMPTY STATE */}
          {comments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-gray-700 border border-dashed border-gray-800/50 rounded-3xl">
              <p className="font-mono text-xs uppercase tracking-[0.3em]">
                {t("RESULTS.COMMENTS_SECTION.EMPTY")}
              </p>
            </div>
          )}

          {/* PAGINARE CLIENT-SIDE */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 pt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 rounded-lg border border-gray-800 text-[10px] font-mono uppercase tracking-widest disabled:opacity-30 hover:bg-gray-800/40 transition-all"
              >
                ← Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-mono transition-all border ${
                    currentPage === i + 1
                      ? "bg-[#e9c46a] text-black border-[#e9c46a]"
                      : "border-gray-800 text-gray-500 hover:border-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 rounded-lg border border-gray-800 text-[10px] font-mono uppercase tracking-widest disabled:opacity-30 hover:bg-gray-800/40 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
