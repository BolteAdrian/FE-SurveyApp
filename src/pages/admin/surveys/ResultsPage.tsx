import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/client";
import { QuestionType } from "../../../types/survey";

export default function ResultsPage() {
  const { id } = useParams();
  const [surveyData, setSurveyData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"questions" | "comments">("questions");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>("");

  useEffect(() => {
    api.get(`/api/admin/surveys/${id}/results`).then((res) => {
      setSurveyData(res.data);
      // Setăm implicit prima întrebare de tip text pentru tab-ul de comentarii
      const firstTextQ = res.data.questions.find((q: any) => q.type === QuestionType.TEXT);
      if (firstTextQ) setSelectedQuestionId(firstTextQ.id);
    });
  }, [id]);

  // Logică pentru tab-ul de comentarii
  const filteredComments = useMemo(() => {
    if (!surveyData || !selectedQuestionId) return [];
    const question = surveyData.questions.find((q: any) => q.id === selectedQuestionId);
    if (!question) return [];

    return question.answersText.filter((ans: any) =>
      ans.textValue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ans.response?.invitation?.contact?.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [surveyData, selectedQuestionId, searchQuery]);

  if (!surveyData) return <div className="p-10 font-mono text-gray-500">Se încarcă...</div>;

  // Calcule Funnel (la fel ca anterior)
  const stats = {
    invites: surveyData.invitations.length,
    sent: surveyData.invitations.filter((i: any) => i.sentAt).length,
    opened: surveyData.invitations.filter((i: any) => i.emailOpenedAt).length,
    surveyOpened: surveyData.invitations.filter((i: any) => i.surveyOpenedAt).length,
    submitted: surveyData.invitations.filter((i: any) => i.submittedAt).length
  };

  const getPercent = (v: number, total: number) => total > 0 ? Math.round((v / total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 text-[#e8e6e1]">
      {/* BROWSER STYLE CONTAINER */}
      <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5 ml-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <span className="text-[10px] font-mono text-gray-500 ml-4 italic">
              ...surveys/{id}/results{activeTab === 'comments' ? '?tab=comments' : ''}
            </span>
          </div>
          <button className="flex items-center gap-2 px-3 py-1 bg-[#1A1A22] border border-gray-800 rounded text-[10px] font-mono hover:text-[#e9c46a] transition-all">
            📥 Export CSV
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* HEADER & FUNNEL */}
          <div className="space-y-6">
            <h2 className="text-3xl font-serif">Rezultate — {surveyData.title}</h2>
            
            <div className="space-y-4">
              <div className="flex h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                <div className="bg-blue-400" style={{ width: `${getPercent(stats.sent, stats.invites)}%` }} />
                <div className="bg-emerald-400" style={{ width: `${getPercent(stats.opened, stats.invites)}%` }} />
                <div className="bg-yellow-400" style={{ width: `${getPercent(stats.surveyOpened, stats.invites)}%` }} />
                <div className="bg-red-400" style={{ width: `${getPercent(stats.submitted, stats.invites)}%` }} />
              </div>
              
              <div className="grid grid-cols-5 gap-2 text-center font-mono">
                {[
                  { label: "Invitați", val: stats.invites, p: null },
                  { label: "Trimiși", val: stats.sent, p: "100%", c: "text-blue-400" },
                  { label: "Email Open", val: stats.opened, p: `${getPercent(stats.opened, stats.sent)}%`, c: "text-emerald-400" },
                  { label: "Survey Open", val: stats.surveyOpened, p: `${getPercent(stats.surveyOpened, stats.opened)}%`, c: "text-yellow-400" },
                  { label: "Submituri", val: stats.submitted, p: `${getPercent(stats.submitted, stats.surveyOpened)}%`, c: "text-red-400" }
                ].map((s, i) => (
                  <div key={i}>
                    <div className="text-xl font-serif">{s.val}</div>
                    <div className="text-[9px] text-gray-600 uppercase tracking-tighter">{s.label}</div>
                    {s.p && <div className={`text-[10px] ${s.c}`}>{s.p}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABS NAVIGATION */}
          <div className="flex gap-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab("questions")}
              className={`pb-3 text-sm font-mono transition-all ${activeTab === "questions" ? "text-[#e9c46a] border-b-2 border-[#e9c46a]" : "text-gray-500 hover:text-gray-300"}`}
            >
              Întrebări
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`pb-3 text-sm font-mono transition-all ${activeTab === "comments" ? "text-[#e9c46a] border-b-2 border-[#e9c46a]" : "text-gray-500 hover:text-gray-300"}`}
            >
              Comentarii
            </button>
          </div>

          {/* CONTENT TABS */}
          {activeTab === "questions" ? (
            <div className="space-y-6">
              {surveyData.questions.map((q: any, i: number) => (
                <QuestionResultCard key={q.id} question={q} index={i} totalRes={stats.submitted} onGoToComments={() => {
                   setActiveTab("comments");
                   setSelectedQuestionId(q.id);
                }} />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* FILTERS BAR */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
                  <input
                    className="w-full bg-[#111114] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-gray-600 transition-all"
                    placeholder="Caută în comentarii sau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-[#111114] border border-gray-800 rounded-xl px-4 text-sm font-mono outline-none"
                  value={selectedQuestionId}
                  onChange={(e) => setSelectedQuestionId(e.target.value)}
                >
                  {surveyData.questions.filter((q: any) => q.type === QuestionType.TEXT).map((q: any) => (
                    <option key={q.id} value={q.id}>{q.title}</option>
                  ))}
                </select>
              </div>

              <div className="text-[10px] font-mono text-gray-600 uppercase">
                {filteredComments.length} RĂSPUNSURI
              </div>

              <div className="space-y-4">
                {filteredComments.map((ans: any) => (
                  <div key={ans.id} className="bg-[#111114] p-6 rounded-2xl border border-gray-800/50 space-y-3">
                    <p className="text-[#e8e6e1] italic leading-relaxed">"{ans.textValue}"</p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-gray-600 border-t border-gray-800/50 pt-3">
                      <span>{ans.response?.invitation?.contact?.email || "Anonim"}</span>
                      <span>•</span>
                      <span>{ans.response?.submittedAt ? new Date(ans.response.submittedAt).toLocaleDateString() : ""}</span>
                    </div>
                  </div>
                ))}
                
                {filteredComments.length === 0 && (
                  <div className="text-center py-20 font-mono text-gray-600 border border-dashed border-gray-800 rounded-2xl">
                    Niciun rezultat pentru căutarea curentă.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componentă extrasă pentru curățenie
function QuestionResultCard({ question, index, totalRes, onGoToComments }: any) {
  const isChoice = question.type === QuestionType.CHOICE;
  const answersCount = isChoice ? (question._count?.answersChoice || 0) : (question.answersText?.length || 0);

  return (
    <div className="bg-[#1A1A22]/50 border border-gray-800 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-serif">
          {index + 1}. {question.title}
        </h3>
        <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 bg-[#111114] border border-gray-800 rounded text-[10px] font-mono text-blue-400 uppercase tracking-widest">
                {isChoice ? "multi-choice" : "text-liber"}
            </span>
            <span className="text-[10px] font-mono text-gray-600">{answersCount} răspunsuri</span>
        </div>
      </div>

      {isChoice ? (
        <div className="space-y-4">
           <div className="bg-yellow-500/5 border border-yellow-500/10 p-3 rounded-lg text-[10px] font-mono text-yellow-600/70 leading-relaxed">
             Δ La multi-choice suma procentelor poate depăși 100%. Procentele sunt calculate din numărul de respondenți la această întrebare.
           </div>
          {question.options.map((opt: any) => {
            const count = opt._count?.answerChoices || 0;
            const pct = Math.round((count / (answersCount || 1)) * 100);
            return (
              <div key={opt.id} className="space-y-2">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-gray-400">{opt.label}</span>
                  <span className="text-gray-500">{pct}% ({count})</span>
                </div>
                <div className="h-1.5 w-full bg-[#111114] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {question.answersText.slice(0, 2).map((ans: any) => (
              <div key={ans.id} className="bg-[#111114] p-4 rounded-xl border border-gray-800/30 italic text-sm text-gray-500">
                "{ans.textValue}"
              </div>
            ))}
          </div>
          <button 
            onClick={onGoToComments}
            className="text-[10px] font-mono text-[#e9c46a] hover:underline uppercase tracking-widest"
          >
            Vezi toate comentariile →
          </button>
        </div>
      )}
    </div>
  );
}