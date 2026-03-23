import { useTranslation } from "react-i18next";
import { adminApi } from "../../../api/adminApi";
import type { ISurveyStats } from "../../../types/survey";

interface FunnelHeaderProps {
  summary: ISurveyStats;
  surveyId: string;
}

export function FunnelHeader({ summary, surveyId }: FunnelHeaderProps) {
  const { t } = useTranslation();

  const getPercent = (v: number, total: number) =>
    total > 0 ? Math.round((v / total) * 100) : 0;

  const handleExportCsv = async () => {
    try {
      const blob = await adminApi.exportSurveyCsv(surveyId);

      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;

      link.setAttribute("download", `results_${surveyId}.csv`);

      document.body.appendChild(link);
      link.click();

      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Exportul a eșuat. Verifică drepturile de acces.");
    }
  };

  const funnelSteps = [
    {
      label: t("RESULTS.FUNNEL.INVITED"),
      val: summary.invited,
      p: null,
      color: "",
    },
    {
      label: t("RESULTS.FUNNEL.SENT"),
      val: summary.sent,
      p: "100%",
      color: "bg-blue-400",
    },
    {
      label: t("RESULTS.FUNNEL.EMAIL_OPEN"),
      val: summary.emailOpened,
      p: `${getPercent(summary.emailOpened, summary.sent)}%`,
      color: "bg-emerald-400",
    },
    {
      label: t("RESULTS.FUNNEL.SURVEY_OPEN"),
      val: summary.surveyOpened,
      p: `${getPercent(summary.surveyOpened, summary.emailOpened)}%`,
      color: "bg-yellow-400",
    },
    {
      label: t("RESULTS.FUNNEL.SUBMITTED"),
      val: summary.submitted,
      p: `${getPercent(summary.submitted, summary.surveyOpened)}%`,
      color: "bg-red-400",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-serif tracking-tight text-white">
          {t("RESULTS.PAGE_TITLE")} —{" "}
          <span className="text-gray-400">{summary.title}</span>
        </h2>
        <button
          onClick={handleExportCsv}
          className="px-4 py-2 bg-[#1A1A22] border border-gray-800 rounded text-[10px] font-mono hover:text-[#e9c46a] transition-all"
        >
          📥 {t("RESULTS.EXPORT_CSV")}
        </button>
      </div>

      <div className="bg-[#111114]/50 p-8 rounded-2xl border border-gray-800/50 space-y-8">
        <div className="flex h-2 w-full bg-gray-800 rounded-full overflow-hidden">
          {funnelSteps.slice(1).map((step, i) => (
            <div
              key={i}
              className={`${step.color} h-full transition-all duration-1000`}
              style={{ width: `${getPercent(step.val, summary.invited)}%` }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {funnelSteps.map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-2xl font-serif text-white">{s.val}</div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                {s.label}
              </div>
              {s.p && (
                <div
                  className={`text-[10px] font-bold font-mono ${s.color.replace("bg-", "text-")}`}
                >
                  {s.p}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
