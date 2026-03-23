import { useTranslation } from "react-i18next";

export function StatusBadge({ status }: { status: string }) {
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