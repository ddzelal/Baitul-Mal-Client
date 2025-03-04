import { useState } from "react";
import { useAppSettings } from "@/hooks/use-app-settings.hook";
import { ProfileSectionForm } from "@/components/forms/profile.form";
import { AppSettingsSection } from "@/components/sections/app-settings-section";
import { Button } from "@/components/ui/button";
import { Edit, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

export default function AccountSettingsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const { settings, updateSettings } = useAppSettings();
  const { t } = useTranslation();

  return (
    <div className="mobile:max-w-md mobile:mx-auto pb-12 px-4 sm:px-6 md:px-8">
      <div className="rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold">{t("ACCOUNT_SETTINGS")}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <X size={16} /> : <Edit size={16} />}
          </Button>
        </div>

        <Separator className="my-2" />

        <div className="space-y-4">
          <ProfileSectionForm isEditing={isEditing} onEdit={setIsEditing} />
        </div>
      </div>

      <AppSettingsSection
        settings={settings}
        onUpdateSettings={updateSettings}
      />
    </div>
  );
}
