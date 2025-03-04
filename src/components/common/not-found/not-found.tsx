import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface NotFoundProps {
  type: "SECTOR" | "PROJECT" | "USER" | "DEFAULT";
  customTitle?: string;
  customMessage?: string;
  emoji?: string;
}

export function NotFound({
  type = "DEFAULT",
  customTitle,
  customMessage,
  emoji,
}: NotFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardContent className="text-center space-y-4">
          <div className="text-4xl text-gray-400 mb-2">
            {emoji || t(`NOT_FOUND.${type}.EMOJI`)}
          </div>
          <h2 className="text-2xl font-semibold text-gray-700">
            {customTitle || t(`NOT_FOUND.${type}.TITLE`)}
          </h2>
          <p className="text-gray-500">
            {customMessage || t(`NOT_FOUND.${type}.MESSAGE`)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
