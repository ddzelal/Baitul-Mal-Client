import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { EditProjectForm } from "../forms/edit-project-form";
import { IProject } from "@/api/types/project.types";

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: IProject;
  sectorId: string;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  project,
  sectorId,
}: EditProjectModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg overflow-y-auto max-h-[85vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("EDIT_PROJECT")}
          </DialogTitle>
          <DialogDescription>{t("EDIT_PROJECT_DESCRIPTION")}</DialogDescription>
        </DialogHeader>
        <EditProjectForm
          project={project}
          sectorId={sectorId}
          onSuccess={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
