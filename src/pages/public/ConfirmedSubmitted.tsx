import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../components/LanguageSwitcher";

const SurveySuccess = () => {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen bg-[#121214] flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-4 right-4 md:top-8 md:right-8">
        <LanguageSwitcher />
      </div>

      <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
        <div className="text-6xl mb-8 drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <span role="img" aria-label="Success icon">
            ✅
          </span>
        </div>

        <h1 className="text-white text-3xl md:text-5xl font-serif mb-4 max-w-2xl leading-tight">
          {t("SURVEY.SUCCESS_PAGE_TITLE")}
        </h1>

        <p className="text-zinc-500 text-lg font-mono tracking-tight max-w-md">
          {t("SURVEY.SUCCESS_PAGE_SUBTITLE")}
        </p>
      </div>
    </div>
  );
};

export default SurveySuccess;
