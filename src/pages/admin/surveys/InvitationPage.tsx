import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Search, AlertTriangle, CheckCircle2, Mail } from "lucide-react";
import type { ISurvey } from "../../../types/survey";
import type { IEmailList } from "../../../types/emailList";
import { useAuth } from "../../../contexts/AuthContext";
import type { IInvitation } from "../../../types/invitation";
import { StatusBadge } from "../../../components/survey/invitations/StatusBadge";

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
      toast.error(t("INVITATIONS.ERRORS.FETCH"));
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
      toast.error(t("INVITATIONS.ERRORS.PREVIEW"));
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!id || !selectedListId || !previewData) return;
    try {
      setSending(true);
      await adminApi.sendInvitations(id, selectedListId);
      toast.success(
        t("INVITATIONS.SUCCESS_SEND", { count: previewData.newEmails }),
      );
      setPreviewData(null);
      setSelectedListId("");
      fetchData();
    } catch (err) {
      toast.error(t("INVITATIONS.ERRORS.SEND"));
    } finally {
      setSending(false);
    }
  };

  if (!survey && loading)
    return (
      <div className="p-10 font-mono text-gray-500 animate-pulse">
        {t("INVITATIONS.COMMON.LOADING")}
      </div>
    );
  if (!survey)
    return (
      <div className="p-10 text-red-400">
        {t("INVITATIONS.ERRORS.NOT_FOUND")}
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-10 space-y-10 text-[#e8e6e1]">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-3xl md:text-5xl font-serif text-white tracking-tight">
          {t("INVITATIONS.TITLE")} — {survey.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4">
          <span className="px-3 py-1 bg-[#1db954]/10 text-[#55d6a0] border border-[#55d6a0]/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
            ● {t(`INVITATIONS.STATUS.${survey.status}`)}
          </span>
          <span className="text-xs font-mono text-gray-500 tracking-tighter">
            {t("INVITATIONS.SLUG")}: {survey.slug}
          </span>
        </div>
      </div>

      {/* SEND PANEL */}
      <div className="bg-[#16161a] border border-gray-800/40 rounded-xl p-6 md:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
            {t("INVITATIONS.SEND_SECTION.TITLE")}
          </h2>
          <p className="text-xs text-gray-600 font-mono">
            {t("INVITATIONS.SEND_SECTION.SUBTITLE")}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <select
            className="flex-1 bg-[#0f0f12] border border-gray-800 rounded-lg px-4 py-3 text-sm text-gray-300 outline-none focus:border-gray-700 transition-all appearance-none"
            value={selectedListId}
            onChange={(e) => {
              setSelectedListId(e.target.value);
              setPreviewData(null);
            }}
          >
            <option value="">
              {t("INVITATIONS.SEND_SECTION.CHOOSE_LIST")}
            </option>
            {emailLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list._count?.emailContacts || 0}{" "}
                {t("INVITATIONS.COMMON.CONTACTS")})
              </option>
            ))}
          </select>
          <button
            onClick={handlePreview}
            disabled={!selectedListId || loading}
            className="px-6 py-3 bg-[#f3d382]/10 border border-[#f3d382]/20 text-[#f3d382] rounded-lg font-mono text-xs font-bold hover:bg-[#f3d382]/20 transition-all disabled:opacity-30"
          >
            {t("INVITATIONS.SEND_SECTION.PREVIEW_BTN")} →
          </button>
        </div>

        {previewData && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-[#f3d382]/5 border border-[#f3d382]/20 p-4 rounded-lg flex items-start sm:items-center gap-4">
              <AlertTriangle size={18} className="text-[#f3d382] shrink-0" />
              <p className="text-xs font-mono text-[#f3d382]">
                <span className="font-bold">
                  {t("INVITATIONS.COMMON.PREVIEW")}:
                </span>{" "}
                {t("INVITATIONS.PREVIEW_MSG", {
                  new: previewData.newEmails,
                  skipped: previewData.skipped,
                })}
              </p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSend}
                disabled={sending || previewData.newEmails === 0}
                className="w-full sm:w-auto bg-[#f3d382] text-[#111114] px-6 py-3 rounded-lg font-mono text-xs font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
              >
                <Mail size={14} />
                {sending
                  ? t("INVITATIONS.COMMON.SENDING")
                  : t("INVITATIONS.SEND_SECTION.CONFIRM_BTN", {
                      count: previewData.newEmails,
                    })}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TABLE SECTION with Overflow for Tablet/Mobile */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <h2 className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.2em]">
            {t("INVITATIONS.LOG_SECTION.TITLE")} ({invitations.length})
          </h2>
          <div className="relative w-full md:w-80">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
            />
            <input
              className="w-full bg-[#0f0f12] border border-gray-800 rounded-lg py-2.5 pl-10 pr-4 text-xs text-gray-400 outline-none focus:border-gray-700 transition-all font-mono"
              placeholder={t("INVITATIONS.LOG_SECTION.SEARCH_PLACEHOLDER")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-[#111114] border border-gray-800/50 rounded-lg overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-800">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800/50 text-[9px] font-mono text-gray-600 uppercase tracking-widest bg-[#16161a]">
                  <th className="px-6 py-4 font-medium">
                    {t("INVITATIONS.TABLE.EMAIL")}
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    {t("INVITATIONS.TABLE.EMAIL_OPEN")}
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    {t("INVITATIONS.TABLE.SURVEY_OPEN")}
                  </th>
                  <th className="px-6 py-4 font-medium text-center">
                    {t("INVITATIONS.TABLE.STATUS")}
                  </th>
                  <th className="px-6 py-4 font-medium text-right">
                    {t("INVITATIONS.TABLE.DATE")}
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
                        <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">
                          {inv.contact?.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {inv.emailOpenedAt ? (
                          <div className="flex items-center justify-center gap-2 text-[#55d6a0]">
                            <CheckCircle2 size={13} />
                            <span className="text-[10px] font-mono">
                              {new Date(inv.emailOpenedAt).toLocaleDateString(
                                "ro-RO",
                                { day: "2-digit", month: "short" },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-800 font-mono text-xs">
                            — —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {inv.surveyOpenedAt ? (
                          <div className="flex items-center justify-center gap-2 text-[#55d6a0]">
                            <CheckCircle2 size={13} />
                            <span className="text-[10px] font-mono">
                              {new Date(inv.surveyOpenedAt).toLocaleDateString(
                                "ro-RO",
                                { day: "2-digit", month: "short" },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-800 font-mono text-xs">
                            — —
                          </span>
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
            <div className="py-20 text-center text-gray-700 text-sm font-mono italic opacity-50">
              {t("INVITATIONS.LOG_SECTION.EMPTY")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
