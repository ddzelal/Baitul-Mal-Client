import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import CreateProjectForm from "@/components/forms/create-project-form";
import { Sector } from "@/api/types/sector.types";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  sector?: Sector;
}

export default function CreateProjectModal({
  isOpen,
  onClose,
  sector,
}: CreateProjectModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg overflow-y-auto max-h-[85vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("CREATE_PROJECT")}
          </DialogTitle>
          <DialogDescription>
            {t("CREATE_PROJECT_DESCRIPTION")} for sector : {sector?.name}
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm sector={sector} onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
