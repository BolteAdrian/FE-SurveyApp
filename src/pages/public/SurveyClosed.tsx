import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function SurveyClosed() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#111114] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <LanguageSwitcher />
      </div>

      <div className="mb-12 relative">
        <span className="text-7xl shadow-2xl drop-shadow-[0_0_15px_rgba(233,196,106,0.2)]">
          🔒
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif text-[#e8e6e1] mb-6 tracking-tight leading-tight">
        {t("SURVEY.CLOSED_TITLE")}
      </h2>

      <p className="text-gray-500 font-mono text-sm md:text-base max-w-md mx-auto leading-relaxed tracking-wide opacity-80">
        {t("SURVEY.CLOSED_SUBTITLE")}
      </p>
    </div>
  );
}