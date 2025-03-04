import { useState, useEffect } from "react";
import { LOCAL_STORAGE_KEYS } from "@/constants/storage.constants";
import { getStoredLanguage } from "@/lib/language.utils";
import { ApplicationSettings } from "@/interfaces/settings.interface";

export const useAppSettings = () => {
  const [settings, setSettings] = useState<ApplicationSettings>({
    currency: localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENCY) || "RSD",
    language: getStoredLanguage(),
    theme:
      (localStorage.getItem(LOCAL_STORAGE_KEYS.THEME) as "light" | "dark") ||
      "light",
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENCY, settings.currency);
    localStorage.setItem(LOCAL_STORAGE_KEYS.LANGUAGE, settings.language);
  }, [settings]);

  const updateSettings = (key: keyof ApplicationSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return { settings, updateSettings };
};
