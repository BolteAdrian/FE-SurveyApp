import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { type ISurveyWithCount, SurveyStatus } from "../../../types/survey";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import { filterStyles, getStatusStyles } from "../../../utils/helpers";

export default function SurveysPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const navigate = useNavigate();

  const [allSurveys, setAllSurveys] = useState<ISurveyWithCount[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<ISurveyWithCount[]>(
    [],
  );

  // Modal states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "DELETE" | "PUBLISH" | "CLOSE" | null
  >(null);
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);

  // Fetch surveys
  const fetchAllSurveys = async () => {
    try {
      const data = await adminApi.getSurveys();
      setAllSurveys(data);
      setFilteredSurveys(
        activeFilter === "ALL"
          ? data
          : data.filter((s) => s.status === activeFilter),
      );
    } catch (err) {
      console.error(err);
      toast.error(t("SURVEY.FETCH_ERROR"));
    }
  };

  useEffect(() => {
    fetchAllSurveys();
  }, []);

  useEffect(() => {
    if (allSurveys.length <= 200) {
      setFilteredSurveys(
        activeFilter === "ALL"
          ? allSurveys
          : allSurveys.filter((s) => s.status === activeFilter),
      );
    } else {
      const fetchFiltered = async () => {
        try {
          const data =
            activeFilter === "ALL"
              ? await adminApi.getSurveys()
              : await adminApi.getSurveys(activeFilter);
          setFilteredSurveys(data);
        } catch (err) {
          console.error(err);
          toast.error(t("SURVEY.FETCH_ERROR"));
        }
      };
      fetchFiltered();
    }
  }, [activeFilter, allSurveys]);

  // Modal handlers
  const openModal = (
    e: React.MouseEvent,
    type: "DELETE" | "PUBLISH" | "CLOSE",
    surveyId: string,
  ) => {
    e.stopPropagation(); 
    setModalType(type);
    setSelectedSurvey(surveyId);
    setModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!selectedSurvey || !modalType) return;
    try {
      if (modalType === "DELETE") {
        await adminApi.deleteSurvey(selectedSurvey);
        toast.success(t("SURVEY.DELETED"));
      }
      if (modalType === "PUBLISH") {
        await adminApi.publishSurvey(selectedSurvey);
        toast.success(t("SURVEY.PUBLISHED"));
      }
      if (modalType === "CLOSE") {
        await adminApi.closeSurvey(selectedSurvey);
        toast.success(t("SURVEY.CLOSED"));
      }
      setModalOpen(false);
      setSelectedSurvey(null);
      setModalType(null);
      await fetchAllSurveys();
    } catch (err) {
      console.error(err);
      toast.error(t("SURVEY.ACTION_ERROR"));
    }
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setSelectedSurvey(null);
    setModalType(null);
  };

  const handleCardClick = (s: ISurveyWithCount) => {
      navigate(`/admin/surveys/${s.id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <ConfirmModal
        isOpen={modalOpen}
        message={
          modalType === "DELETE"
            ? t("SURVEY.CONFIRM_DELETE")
            : modalType === "PUBLISH"
              ? t("SURVEY.CONFIRM_PUBLISH")
              : modalType === "CLOSE"
                ? t("SURVEY.CONFIRM_CLOSE")
                : ""
        }
        onConfirm={handleModalConfirm}
        onCancel={handleModalCancel}
      />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
        <h2 className="text-2xl sm:text-3xl font-serif text-[#e8e6e1]">
          {t("SURVEY.MY_SURVEYS")}
        </h2>

        {/* FILTERS */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {[
            { label: t("SURVEY.ALL"), value: "ALL" },
            { label: t("SURVEY.DRAFT"), value: "DRAFT" },
            { label: t("SURVEY.PUBLISHED"), value: "PUBLISHED" },
            { label: t("SURVEY.CLOSED"), value: "CLOSED" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all outline-none ${
                activeFilter === f.value
                  ? filterStyles[f.value]
                  : "bg-[#1A1A22] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SURVEYS LIST */}
      <div className="space-y-4">
        {filteredSurveys.map((s) => {
          const totalInvited = s._count?.invitations || 0;
          const submittedCount = s.submittedCount || 0;
          const submitRate =
            totalInvited > 0
              ? Math.round((submittedCount / totalInvited) * 100)
              : 0;

          return (
            <div
              key={s.id}
              onClick={() => handleCardClick(s)} 
              className="bg-[#1e1e24] border border-gray-800 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-gray-700 transition-all group gap-6 cursor-pointer"
            >
              {/* LEFT SIDE */}
              <div className="space-y-3 flex-1">
                <h2 className="text-lg sm:text-xl font-semibold text-[#e8e6e1] group-hover:text-white leading-tight">
                  {s.title}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-600">{t("SURVEY.SLUG")}:</span>
                    <span className="text-green-500/80 truncate max-w-[120px] sm:max-w-none">
                      /{s.slug}
                    </span>
                  </div>
                  <span className="hidden sm:inline text-gray-800">•</span>
                  <span className="text-gray-500">
                    {s._count?.questions || 0} {t("SURVEY.QUESTIONS")}
                  </span>
                  <span className="hidden sm:inline text-gray-800">•</span>
                  <span className="text-gray-500">
                    {s.status === SurveyStatus.CLOSED
                      ? t("SURVEY.CLOSED_AT")
                      : t("SURVEY.CREATED")}{" "}
                    {new Date(
                      s.status === SurveyStatus.CLOSED && s.closedAt
                        ? s.closedAt
                        : s.createdAt,
                    ).toLocaleDateString("ro-RO", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

                {/* Status & Stats Row */}
                <div className="flex items-center gap-3">
                  <div
                    className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-bold lowercase tracking-tight ${getStatusStyles(s.status)}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${
                        s.status === SurveyStatus.PUBLISHED
                          ? "bg-green-400"
                          : s.status === SurveyStatus.CLOSED
                            ? "bg-red-400"
                            : "bg-gray-500"
                      }`}
                    />
                    {t(`SURVEY.STATUS.${s.status}`)}
                  </div>

                  {s.status !== SurveyStatus.DRAFT && (
                    <div className="flex items-center text-[11px] font-mono text-gray-500">
                      <span>
                        {totalInvited} {t("SURVEY.INVITED")}
                      </span>
                      <span className="mx-2 text-gray-800">·</span>
                      <span>{submitRate}% submit rate</span>
                    </div>
                  )}
                  {s.status === SurveyStatus.DRAFT && (
                    <span className="text-[11px] font-mono text-gray-600 italic">
                      {t("SURVEY.INVITATIONS_NOT_SENT_YET")}
                    </span>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE (Actions) */}
              <div className="flex flex-wrap md:flex-nowrap items-center gap-2 font-mono w-full md:w-auto">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(
                      s.status !== SurveyStatus.DRAFT
                        ? `/admin/surveys/${s.id}/results`
                        : `/admin/surveys/${s.id}`,
                    );
                  }}
                  className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-gray-700 text-gray-400 rounded-lg text-xs hover:text-white hover:border-gray-500 transition-all text-center"
                >
                  {s.status !== SurveyStatus.DRAFT
                    ? t("SURVEY.RESULTS")
                    : t("SURVEY.EDIT")}
                </button>

                {s.status === SurveyStatus.DRAFT && (
                  <>
                    <button
                      onClick={(e) => openModal(e, "PUBLISH", s.id as string)}
                      className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-green-500/40 text-green-400 rounded-lg text-xs hover:bg-green-500/10 transition-all font-bold text-center"
                    >
                      {t("SURVEY.PUBLISH")}
                    </button>
                    <button
                      onClick={(e) => openModal(e, "DELETE", s.id as string)}
                      className="flex-none px-4 py-2 bg-[#1A1A22] border border-red-500/40 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-all font-bold text-center"
                    >
                      {t("SURVEY.DELETE")}
                    </button>
                  </>
                )}

                {s.status === SurveyStatus.PUBLISHED && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/admin/surveys/${s.id}/invitations`);
                      }}
                      className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-blue-500/40 text-blue-400 rounded-lg text-xs hover:bg-blue-500/10 transition-all font-bold text-center flex items-center justify-center gap-2"
                    >
                      <Mail size={14} />
                      {t("SURVEY.MANAGE_INVITATIONS")}
                    </button>
                    <button
                      onClick={(e) => openModal(e, "CLOSE", s.id as string)}
                      className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-red-500/40 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-all font-bold text-center"
                    >
                      {t("SURVEY.CLOSE")}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}

        {filteredSurveys.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-800 rounded-xl text-gray-600 font-mono text-sm px-4">
            {t("SURVEY.NO_SURVEYS_FOUND", {
              filter: activeFilter.toLowerCase(),
            })}
          </div>
        )}
      </div>
    </div>
  );
}
