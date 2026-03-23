import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Mail, Search, AlertTriangle, CheckCircle2, Send } from "lucide-react";
import type { ISurvey } from "../../../types/survey";
import type { IEmailList } from "../../../types/emailList";
import { useAuth } from "../../../contexts/AuthContext";
import type { IInvitation } from "../../../types/invitation";

export default function InvitationsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [survey, setSurvey] = useState<ISurvey | null>(null);
  const [emailLists, setEmailLists] = useState<IEmailList[]>([]);
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [selectedListId, setSelectedListId] = useState<string>("");
  const [previewData, setPreviewData] = useState<{
    newEmails: number;
    skipped: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [surveyData, listsData, invData] = await Promise.all([
        adminApi.getSurvey(id),
        adminApi.getEmailLists(user?.id as string),
        adminApi.getInvitations(id),
      ]);

      setSurvey(surveyData);
      setEmailLists(listsData);
      setInvitations(invData);
    } catch (err) {
      toast.error(t("SURVEY.FETCH_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = async () => {
    if (!selectedListId || !id) return;
    try {
      setLoading(true);
      const data = await adminApi.getInvitationsPreview(id, selectedListId);
      setPreviewData(data);
    } catch (err) {
      toast.error(t("SURVEY.PREVIEW_ERROR"));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!id || !selectedListId || !previewData) return;

    try {
      setSending(true);
      await adminApi.sendInvitations(id, selectedListId);
      toast.success(t("SURVEY.SENT_SUCCESS", { count: previewData.newEmails }));
      setPreviewData(null);
      setSelectedListId("");
      fetchData();
    } catch (err) {
      toast.error(t("SURVEY.SEND_ERROR"));
    } finally {
      setSending(false);
    }
  };

  if (!survey && loading)
    return (
      <div className="p-10 font-mono text-gray-500 animate-pulse">
        {t("SURVEY.LOADING")}
      </div>
    );
  if (!survey)
    return <div className="p-10 text-red-400">{t("SURVEY.NOT_FOUND")}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-8 text-[#e8e6e1]">
      {/* HEADER INFO */}
      <div className="bg-[#1e1e24] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-10 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-white">
                {survey.title}
              </h1>
              <div className="flex items-center gap-3 mt-4">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${
                    survey.status === "PUBLISHED"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-gray-500/10 text-gray-50 border-gray-500/20"
                  }`}
                >
                  {t(`SURVEY.STATUS.${survey.status}`)}
                </span>
                <span className="text-[11px] font-mono text-gray-500">
                  /{survey.slug}
                </span>
              </div>
            </div>
          </div>

          {/* PANEL SEND INVITATIONS */}
          <div className="bg-[#1A1A22]/50 border border-gray-800 rounded-2xl p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#e9c46a]/20"></div>
            <div className="flex items-center gap-2">
              <Send size={14} className="text-[#e9c46a]" />
              <h2 className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.2em]">
                {t("SURVEY.NEW_INVITATION")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="md:col-span-3 space-y-2">
                <label className="text-[10px] font-mono text-gray-500 uppercase ml-1">
                  {t("SURVEY.SELECT_LIST")}
                </label>
                <select
                  className="w-full bg-[#111114] border border-gray-800 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#e9c46a]/50 transition-all appearance-none"
                  value={selectedListId}
                  onChange={(e) => {
                    setSelectedListId(e.target.value);
                    setPreviewData(null);
                  }}
                >
                  <option value="">{t("SURVEY.CHOOSE_LIST")}</option>
                  {emailLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name} ({list._count?.emailContacts || 0}{" "}
                      {t("SURVEY.CONTACTS")})
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handlePreview}
                disabled={!selectedListId || loading}
                className="w-full bg-[#1e1e24] border border-gray-700 text-white px-6 py-3 rounded-xl font-mono text-xs hover:border-[#e9c46a] hover:text-[#e9c46a] transition-all disabled:opacity-30"
              >
                {loading ? t("SURVEY.PREVIEW_LOADING") : t("SURVEY.PREVIEW")}
              </button>
            </div>

            {previewData && (
              <div className="pt-4 border-t border-gray-800/50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="bg-[#e9c46a]/5 border border-[#e9c46a]/20 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={18} className="text-[#e9c46a]" />
                    <div className="text-xs font-mono">
                      <span className="text-[#e8e6e1] font-bold">
                        {previewData.newEmails} {t("SURVEY.NEW_INVITATIONS")}
                      </span>{" "}
                      {t("SURVEY.WILL_BE_SENT")}
                      <span className="text-gray-500 ml-2">
                        ({previewData.skipped} {t("SURVEY.ALREADY_SENT")})
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={sending || previewData.newEmails === 0}
                    className="bg-[#e9c46a] text-[#111114] px-6 py-2.5 rounded-lg font-mono text-xs font-black hover:scale-105 transition-all"
                  >
                    {sending ? t("SURVEY.SENDING") : t("SURVEY.CONFIRM_SEND")}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABEL INVITATII (DESIGN ACTUALIZAT) */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-500" />
                <h2 className="text-[11px] font-mono text-gray-400 uppercase tracking-[0.2em]">
                  {t("SURVEY.LOG_INVITATIONS")} ({invitations.length})
                </h2>
              </div>
              <div className="relative w-full sm:w-72">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                />
                <input
                  className="w-full bg-[#111114] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-gray-600 transition-all font-mono"
                  placeholder={t("SURVEY.SEARCH_EMAIL")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="bg-[#111114] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b border-gray-800/50 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                      <th className="px-6 py-5">{t("SURVEY.EMAIL")}</th>
                      <th className="px-6 py-5 text-center">
                        {t("SURVEY.EMAIL_OPEN")}
                      </th>
                      <th className="px-6 py-5 text-center">
                        {t("SURVEY.SURVEY_OPEN")}
                      </th>
                      <th className="px-6 py-5 text-center">
                        {t("SURVEY.STATUS_HEADER")}
                      </th>
                      <th className="px-6 py-5 text-right">
                        {t("SURVEY.DATE")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/30">
                    {invitations
                      .filter((i) =>
                        i.contact?.email
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                      )
                      .map((inv) => (
                        <tr
                          key={inv.id}
                          className="hover:bg-white/[0.01] transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">
                              {inv.contact?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {inv.emailOpenedAt ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-500">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-mono">
                                  {new Date(
                                    inv.emailOpenedAt,
                                  ).toLocaleDateString("ro-RO", {
                                    day: "2-digit",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-800">— —</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {inv.surveyOpenedAt ? (
                              <div className="flex items-center justify-center gap-2 text-emerald-500">
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-mono">
                                  {new Date(
                                    inv.surveyOpenedAt,
                                  ).toLocaleDateString("ro-RO", {
                                    day: "2-digit",
                                    month: "short",
                                  })}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-800">— —</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <StatusBadge
                              status={
                                inv.submittedAt
                                  ? "submitted"
                                  : inv.bouncedAt
                                    ? "bounced"
                                    : inv.emailOpenedAt
                                      ? "email_opened"
                                      : "sent"
                              }
                            />
                          </td>
                          <td className="px-6 py-4 text-right text-[10px] font-mono text-gray-500">
                            {new Date(inv.sentAt).toLocaleDateString("ro-RO", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              {invitations.length === 0 && !loading && (
                <div className="py-20 text-center text-gray-700 text-sm font-mono italic">
                  {t("SURVEY.NO_INVITATIONS")}
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
  const { t } = useTranslation();
  const styles: any = {
    submitted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    bounced: "bg-red-500/10 text-red-500 border-red-500/20",
    email_opened: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    sent: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded text-[9px] border font-bold uppercase tracking-wider ${styles[status] || styles.sent}`}
    >
      {t(`SURVEY.INVITATION_STATUS.${status.toUpperCase()}`).replace("_", " ")}
    </span>
  );
}
