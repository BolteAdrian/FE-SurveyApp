import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { QuestionResultCard } from "../../../components/survey/results/QuestionResultCard";
import { FunnelHeader } from "../../../components/survey/results/FunnelHeader";
import { CommentsView } from "../../../components/survey/results/CommentsView";
import { QuestionType, type IComment, type IQuestion, type IQuestionWithStats, type ISurveyStats } from "../../../types/survey";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();

  const [data, setData] = useState<{ summary: ISurveyStats; questions: IQuestionWithStats[] } | null>(
    null,
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<"questions" | "comments">(
    "questions",
  );
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 1. Fetch Summary (Funnel) + Questions (Stats)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [summary, statsData] = await Promise.all([
          adminApi.getSurveySummary(id),
          adminApi.getSurveyQuestionStats(id),
        ]);

        setData({
          summary: summary,
          questions: statsData.questions,
        });

        const firstTextQ = statsData.questions.find(
          (q: IQuestion) => q.type === QuestionType.TEXT,
        );
        if (firstTextQ) setSelectedQuestionId(firstTextQ.id);
      } catch (err) {
        console.error("Error fetching initial results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id]);

  useEffect(() => {
    if (activeTab === "comments" && id) {
      const fetchComments = async () => {
        setCommentsLoading(true);
        try {
          const res = await adminApi.getSurveyComments(id, {
            question_id: selectedQuestionId,
            q: searchQuery,
          });
          setComments(res);
        } catch (err) {
          console.error("Error fetching comments:", err);
        } finally {
          setCommentsLoading(false);
        }
      };

      fetchComments();
    }
  }, [activeTab, selectedQuestionId, searchQuery, id]);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#111114] flex items-center justify-center font-mono text-gray-500 uppercase tracking-widest animate-pulse">
        {t("RESULTS.LOADING")}
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto space-y-6 text-[#e8e6e1]">
      <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-8 space-y-10">
          {/* HEADER & FUNNEL */}
          <FunnelHeader summary={data.summary} surveyId={id!} />

          {/* TABS */}
          <div className="flex gap-8 border-b border-gray-800">
            {(["questions", "comments"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-xs font-mono uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab
                    ? "text-[#e9c46a]"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t(`RESULTS.TABS.${tab.toUpperCase()}`)}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#e9c46a]" />
                )}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="min-h-[400px]">
            {activeTab === "questions" ? (
              <div className="grid gap-6">
                {data.questions.map((q: any, i: number) => (
                  <QuestionResultCard
                    key={q.id}
                    question={q}
                    index={i}
                    totalSurveyResponses={data.summary.submitted}
                    onGoToComments={() => {
                      setSelectedQuestionId(q.id);
                      setActiveTab("comments");
                    }}
                  />
                ))}
              </div>
            ) : (
              <CommentsView
                comments={comments}
                loading={commentsLoading}
                questions={data.questions.filter((q) => q.type === QuestionType.TEXT)}
                selectedId={selectedQuestionId}
                onSelect={setSelectedQuestionId}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
