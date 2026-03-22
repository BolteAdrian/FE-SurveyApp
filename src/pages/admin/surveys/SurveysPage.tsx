import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../../api/adminApi";
import { type ISurveyWithCount, SurveyStatus } from "../../../types/survey";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "../../../components/ConfirmModal";
import { toast } from "react-toastify";

export default function SurveysPage() {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("ALL");
  const navigate = useNavigate();

  const [allSurveys, setAllSurveys] = useState<ISurveyWithCount[]>([]);
  const [filteredSurveys, setFilteredSurveys] = useState<ISurveyWithCount[]>(
    [],
  );

  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
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

  // Styles
  const getStatusStyles = (status: string) => {
    switch (status) {
      case SurveyStatus.PUBLISHED:
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case SurveyStatus.DRAFT:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case SurveyStatus.CLOSED:
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const filterStyles: Record<string, string> = {
    PUBLISHED:
      "border-green-500/50 text-green-400 bg-green-500/5 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    DRAFT:
      "border-gray-500/50 text-gray-400 bg-gray-500/5 shadow-[0_0_15px_rgba(107,114,128,0.1)]",
    CLOSED:
      "border-red-500/50 text-red-400 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
    ALL: "border-blue-500/50 text-blue-400 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  };

  // Modal handlers
  const openModal = (
    type: "DELETE" | "PUBLISH" | "CLOSE",
    surveyId: string,
  ) => {
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

  // Render
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Confirm Modal */}
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
            t("SURVEY.ALL"),
            t("SURVEY.DRAFT"),
            t("SURVEY.PUBLISHED"),
            t("SURVEY.CLOSED"),
          ].map((f) => {
            const filterValue = f === t("SURVEY.ALL") ? "ALL" : f.toUpperCase();
            const isActive = activeFilter === filterValue;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(filterValue)}
                className={`px-4 py-2 rounded-lg text-xs font-mono border transition-all whitespace-nowrap outline-none ${
                  isActive
                    ? filterStyles[filterValue]
                    : "bg-[#1A1A22] border-gray-800 text-gray-500 hover:text-gray-300 hover:border-gray-700"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* SURVEYS LIST */}
      <div className="space-y-4">
        {filteredSurveys.map((s) => (
          <div
            key={s.id}
            className="bg-[#1e1e24] border border-gray-800 rounded-xl p-5 sm:p-6 flex flex-col md:flex-row md:justify-between md:items-center hover:border-gray-700 transition-all group gap-6"
          >
            {/* LEFT SIDE */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-lg sm:text-xl font-semibold text-[#e8e6e1] group-hover:text-white leading-tight">
                  {s.title}
                </h2>
                <div
                  className={`flex items-center gap-2 px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest ${getStatusStyles(s.status)}`}
                >
                  {t(`SURVEY.STATUS.${s.status}`)}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-mono">
                <div className="flex items-center gap-1">
                  <span className="text-gray-600">{t("SURVEY.SLUG")}:</span>
                  <span className="text-green-500/80 truncate max-w-[120px] sm:max-w-none">
                    /{s.slug}
                  </span>
                </div>
                <span className="hidden sm:inline text-gray-800">•</span>
                <span className="text-gray-500">
                  {s._count.questions} {t("SURVEY.QUESTIONS")}
                </span>
                <span className="hidden sm:inline text-gray-800">•</span>
                <span className="text-gray-500">
                  {t("SURVEY.CREATED")}{" "}
                  {new Date(s.createdAt).toLocaleDateString("ro-RO", {
                    day: "numeric",
                    month: "short",
                  })}
                </span>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-2 font-mono w-full md:w-auto">
              <button
                onClick={() =>
                  navigate(
                    s.status === SurveyStatus.PUBLISHED
                      ? `/admin/surveys/${s.id}/results`
                      : `/admin/surveys/${s.id}`,
                  )
                }
                className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-gray-700 text-gray-400 rounded-lg text-xs hover:text-white hover:border-gray-500 transition-all text-center"
              >
                {s.status === SurveyStatus.PUBLISHED
                  ? t("SURVEY.RESULTS")
                  : t("SURVEY.EDIT")}
              </button>

              {s.status === SurveyStatus.DRAFT && (
                <>
                  <button
                    onClick={() => openModal("PUBLISH", s.id as string)}
                    className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-green-500/40 text-green-400 rounded-lg text-xs hover:bg-green-500/10 transition-all font-bold text-center"
                  >
                    {t("SURVEY.PUBLISH")}
                  </button>
                  <button
                    onClick={() => openModal("DELETE", s.id as string)}
                    className="flex-none px-4 py-2 bg-[#1A1A22] border border-red-500/40 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-all font-bold text-center"
                  >
                    {t("SURVEY.DELETE")}
                  </button>
                </>
              )}

              {s.status === SurveyStatus.PUBLISHED && (
                <button
                  onClick={() => openModal("CLOSE", s.id as string)}
                  className="flex-1 md:flex-none px-4 py-2 bg-[#1A1A22] border border-red-500/40 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition-all font-bold text-center"
                >
                  {t("SURVEY.CLOSE")}
                </button>
              )}
            </div>
          </div>
        ))}

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
