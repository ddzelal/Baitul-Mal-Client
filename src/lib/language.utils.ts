import i18n from "@/config/i18n";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage.constants";

export const languages = {
  en: "English",
  bs: "Bosanski",
} as const;

export type LanguageKey = keyof typeof languages;

export const getStoredLanguage = (): LanguageKey => {
  return (
    (localStorage.getItem(LOCAL_STORAGE_KEYS.LANGUAGE) as LanguageKey) || "en"
  );
};

export const changeLanguage = async (language: LanguageKey) => {
  try {
    await i18n.changeLanguage(language);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, language);
    return true;
  } catch (error) {
    console.error("Error changing language:", error);
    return false;
  }
};
