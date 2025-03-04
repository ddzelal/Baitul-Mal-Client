import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import bs from "../locales/bs/translation.json";
import en from "../locales/en/translation.json";
import { getStoredLanguage } from "@/lib/language.utils";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    bs: {
      translation: bs,
    },
  },
  lng: getStoredLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
