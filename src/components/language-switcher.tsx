import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  languages,
  changeLanguage,
  type LanguageKey,
} from "@/lib/language.utils";

interface LanguageSwitcherProps {
  variant?: "icon" | "full";
  className?: string;
}

export const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
  const { t, i18n } = useTranslation();

  const handleLanguageChange = async (language: LanguageKey) => {
    await changeLanguage(language);
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className={cn("mt-1", className)}>
        <SelectValue placeholder={t("SELECT_LANGUAGE")} />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
