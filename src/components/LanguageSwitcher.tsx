import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ isMobile = false }) {
  const { i18n } = useTranslation();

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <div
      className={`flex items-center gap-1 shrink-0 ${
        isMobile
          ? "justify-center mt-2"
          : "border border-gray-700 rounded-lg overflow-hidden"
      }`}
    >
      <button
        onClick={() => changeLang("ro")}
        className={`px-2 py-1 text-xs min-w-[40px] h-[28px] ${
          i18n.language === "ro" ? "bg-[#e9c46a] text-black" : "text-gray-400"
        }`}
      >
        RO
      </button>

      <button
        onClick={() => changeLang("en")}
        className={`px-2 py-1 text-xs min-w-[40px] h-[28px] ${
          i18n.language === "en" ? "bg-[#e9c46a] text-black" : "text-gray-400"
        }`}
      >
        EN
      </button>
    </div>
  );
}
