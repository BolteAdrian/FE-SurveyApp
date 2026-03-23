import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

export default function AlreadySubmitted() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#111114] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <LanguageSwitcher />
      </div>

      <div className="mb-12">
        <div className="w-16 h-16 border-2 border-[#82d9a9] flex items-center justify-center rounded-sm">
          <span className="text-[#82d9a9] text-3xl font-bold">✓</span>
        </div>
      </div>

      <h2 className="text-4xl md:text-5xl font-serif text-[#e8e6e1] mb-6 tracking-tight leading-tight">
        {t("SURVEY.ALREADY_SUBMITTED_TITLE")}
      </h2>

      <p className="text-gray-500 font-mono text-sm md:text-base max-w-lg mx-auto leading-relaxed tracking-wider opacity-70">
        {t("SURVEY.ALREADY_SUBMITTED_SUBTITLE")}
      </p>
    </div>
  );
}
