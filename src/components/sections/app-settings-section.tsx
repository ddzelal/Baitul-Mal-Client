import React from "react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import { ApplicationSettings } from "@/interfaces/settings.interface";
import { ModeToggle } from "@/components/mode-toggle.tsx";
import { LanguageSwitcher } from "@/components/language-switcher";

interface AppSettingsSectionProps {
  settings: ApplicationSettings;
  onUpdateSettings: (key: keyof ApplicationSettings, value: string) => void;
}

export const AppSettingsSection: React.FC<AppSettingsSectionProps> = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4 mt-4">
      <h2 className="text-sm font-bold">{t("APPLICATION_SETTINGS")}</h2>
      <Separator className="my-2" />
      {/* Language */}
      <Label className="mb-1 block">{t("LANGUAGE")}</Label>
      <LanguageSwitcher variant="full" />

      {/* Theme */}
      <div className="flex items-center justify-between border p-2 rounded-lg">
        <Label>{t("THEME")}</Label>
        <div className="flex  justify-end items-end relative">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
};
