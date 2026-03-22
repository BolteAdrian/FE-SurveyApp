import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../../api/client";

export default function InvitationsPage() {
  const { id } = useParams();
  const [survey, setSurvey] = useState<any>(null);
  const [emailLists, setEmailLists] = useState<any[]>([]);
  const [selectedListId, setSelectedListId] = useState("");
  const [previewData, setPreviewData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const [surveyRes, listsRes] = await Promise.all([
      api.get(`/api/admin/surveys/${id}`),
      api.get("/api/admin/lists"),
    ]);
    setSurvey(surveyRes.data);
    setEmailLists(listsRes.data);
  };

  const handlePreview = async () => {
    if (!selectedListId) return;
    setLoading(true);
    // Endpoint-ul calculează câte emailuri noi vs duplicate sunt
    const res = await api.get(`/api/admin/surveys/${id}/invitations/preview?listId=${selectedListId}`);
    setPreviewData(res.data);
    setLoading(false);
  };

  const sendInvitations = async () => {
    if (!confirm(`Trimiți ${previewData.newEmailsCount} invitații noi?`)) return;
    await api.post(`/api/admin/surveys/${id}/invitations/send`, { listId: selectedListId });
    setPreviewData(null);
    fetchData(); // Refresh listă invitații trimise
  };

  if (!survey) return <div className="p-10 font-mono text-gray-500">Se încarcă...</div>;

  const filteredInvitations = survey.invitations?.filter((i: any) =>
    i.contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-[#e8e6e1]">
      
      {/* HEADER BROWSER STYLE */}
      <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-[#111114] p-3 border-b border-gray-800 flex items-center gap-2">
          <div className="flex gap-1.5 ml-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] font-mono text-gray-600 ml-4 italic">
            app.survey.com/admin/surveys/{id}/invitations
          </span>
        </div>

        <div className="p-8 space-y-10">
          <div>
            <h2 className="text-3xl font-serif">Invitații — {survey.title}</h2>
            <div className="flex items-center gap-3 mt-3">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-mono border border-emerald-500/20 lowercase">
                {survey.status}
              </span>
              <span className="text-[11px] font-mono text-gray-600 tracking-widest">
                SLUG: {survey.slug}
              </span>
            </div>
          </div>

          {/* PANEL TRIMITE INVITATII */}
          <div className="bg-[#1A1A22]/50 border border-gray-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">Trimite Invitații</h2>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase">Selectează listă de contacte</label>
                <select 
                  className="w-full bg-[#111114] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-600 transition-all"
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                >
                  <option value="">Alege o listă...</option>
                  {emailLists.map(list => (
                    <option key={list.id} value={list.id}>{list.name} ({list._count.emailContacts} contacte)</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handlePreview}
                disabled={!selectedListId || loading}
                className="bg-[#e9c46a] text-[#111114] px-6 py-3 rounded-xl font-mono text-xs font-bold hover:brightness-110 transition-all disabled:opacity-30"
              >
                {loading ? "Se calculează..." : "Preview trimitere →"}
              </button>
            </div>

            {previewData && (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
                  <span className="text-yellow-500">⚠️</span>
                  <p className="text-xs font-mono text-yellow-600/90 leading-relaxed">
                    Preview: <span className="text-yellow-500 font-bold">{previewData.newEmailsCount} emailuri noi</span> vor fi trimise. 
                    {previewData.duplicatesCount} contacte au primit deja invitația (skip).
                  </p>
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={sendInvitations}
                    className="bg-[#e9c46a] text-[#111114] px-8 py-3 rounded-xl font-mono text-xs font-bold flex items-center gap-2"
                  >
                    ✉️ Trimite {previewData.newEmailsCount} invitații
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABEL INVITATII TRIMISE */}
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.2em]">
                Invitații trimise ({filteredInvitations.length})
              </h2>
              <div className="relative w-64">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 text-xs">🔍</span>
                <input 
                  className="w-full bg-[#111114] border border-gray-800 rounded-lg py-2 pl-9 pr-4 text-xs outline-none focus:border-gray-600"
                  placeholder="Caută după email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-[#111114] border border-gray-800 rounded-2xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800/50 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4 text-center">Email Open</th>
                    <th className="px-6 py-4 text-center">Survey Open</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Data</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/30">
                  {filteredInvitations.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors group text-xs font-mono">
                      <td className="px-6 py-4 text-gray-300">{inv.contact.email}</td>
                      <td className="px-6 py-4 text-center">
                        {inv.emailOpenedAt ? (
                          <span className="text-emerald-500">✅ <span className="ml-1 text-[10px] opacity-70">{new Date(inv.emailOpenedAt).toLocaleDateString()}</span></span>
                        ) : "--"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {inv.surveyOpenedAt ? (
                          <span className="text-emerald-500">✅ <span className="ml-1 text-[10px] opacity-70">{new Date(inv.surveyOpenedAt).toLocaleDateString()}</span></span>
                        ) : "--"}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={inv.submittedAt ? "submitted" : inv.bouncedAt ? "bounced" : inv.emailOpenedAt ? "email opened" : "sent"} />
                      </td>
                      <td className="px-6 py-4 text-right text-gray-600">
                        {inv.sentAt? new Date(inv.sentAt).toLocaleDateString() : "--"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInvitations.length === 0 && (
                <div className="py-20 text-center text-gray-700 text-sm font-mono">
                  Nicio invitație găsită.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    submitted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    bounced: "bg-red-500/10 text-red-500 border-red-500/20",
    "email opened": "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    sent: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] border uppercase tracking-tighter ${styles[status] || styles.sent}`}>
      {status}
    </span>
  );
}