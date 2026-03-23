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
    total > 0 ? (Math.round((v / total) * 1000) / 10).toFixed(1) : "0";

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
    }
  };

  const funnelSteps = [
    {
      label: t("RESULTS.FUNNEL.INVITED"),
      val: summary.invited,
      p: null,
      color: "rgb(122 162 247)",
      width: "20%",
    },
    {
      label: t("RESULTS.FUNNEL.SENT"),
      val: summary.sent,
      p: "100%",
      color: "rgb(180 249 248)",
      width: "20%",
    },
    {
      label: t("RESULTS.FUNNEL.EMAIL_OPEN"),
      val: summary.emailOpened,
      p: `${getPercent(summary.emailOpened, summary.sent)}%`,
      color: "rgb(115 218 202)",
      width: "20%",
    },
    {
      label: t("RESULTS.FUNNEL.SURVEY_OPEN"),
      val: summary.surveyOpened,
      p: `${getPercent(summary.surveyOpened, summary.sent)}%`,
      color: "rgb(224 175 104)",
      width: "20%",
    },
    {
      label: t("RESULTS.FUNNEL.SUBMITTED"),
      val: summary.submitted,
      p: `${getPercent(summary.submitted, summary.sent)}%`,
      color: "rgb(247 118 142)",
      width: "20%",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif tracking-tight text-[#e8e6e1]">
            {t("RESULTS.PAGE_TITLE")} —{" "}
            <span className="text-gray-500 font-light">{summary.title}</span>
          </h2>
          <p className="text-[10px] font-mono text-gray-700 mt-1 uppercase tracking-widest">
            {t("RESULTS.DATE_REALTIME")}
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 bg-[#1A1A22] border border-gray-800 rounded-lg text-[10px] font-mono text-gray-400 hover:text-[#e9c46a] transition-all"
        >
          <span>📥</span> {t("RESULTS.EXPORT_CSV")}
        </button>
      </div>

      <div className="space-y-6">
        <p className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.2em] mb-[-10px]">
          {t("RESULTS.FUNNEL.TITLE")}
        </p>

        <div className="flex h-1 w-full bg-gray-900 rounded-full overflow-hidden">
          {funnelSteps.map((step, i) => (
            <div
              key={i}
              className="h-full transition-all duration-1000"
              style={{ backgroundColor: step.color, width: step.width }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {funnelSteps.map((s, i) => (
            <div key={i} className="text-center space-y-1">
              <div className="text-[32px] font-serif text-[#e8e6e1] leading-tight">
                {s.val}
              </div>
              <div className="text-[9px] text-gray-600 uppercase tracking-widest font-mono">
                {s.label}
              </div>
              {s.p && (
                <div
                  className="text-[12px] font-bold font-mono mt-1"
                  style={{
                    color: "#5ef0b4",
                    textShadow: "0 0 10px rgba(94, 240, 180, 0.3)",
                  }}
                >
                  {s.p}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2 text-[10px] font-mono text-gray-700">
          {t("RESULTS.FUNNEL.BOUNCE")}: {summary.bounced || 0} &nbsp; · &nbsp;
          {t("RESULTS.FUNNEL.COMPLETION_RATE")}:{" "}
          <span className="text-gray-500">
            {getPercent(summary.submitted, summary.surveyOpened)}%
          </span>
        </div>
      </div>
    </div>
  );
}
