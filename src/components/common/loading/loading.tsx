import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingProps {
  type?: "SECTOR" | "PROJECT" | "USER" | "DEFAULT";
  customMessage?: string;
}

export function Loading({ type = "DEFAULT", customMessage }: LoadingProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <CardContent className="text-center space-y-6">
          <div className="flex justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-700">
              {t(`LOADING.${type}.TITLE`)}
            </h2>
            <p className="text-gray-500">
              {customMessage || t(`LOADING.${type}.MESSAGE`)}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
