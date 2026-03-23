import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import ro from "./locales/ro.json";

/**
 * Initialize i18next for React
 *
 * This config sets up translation resources, default language, fallback language,
 * and interpolation settings for the app.
 */
i18n
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    // Define translation resources
    resources: {
      en: { translation: en }, // English translations
      ro: { translation: ro }, // Romanian translations
    },
    lng: "ro", // Default language
    fallbackLng: "en", // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already escapes values, so disable escaping
    },
  });

export default i18n;
