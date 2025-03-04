import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateSectorForm from "@/components/forms/create-sector.form";
import { useTranslation } from "react-i18next";

interface CreateSectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateSectorModal({
  isOpen,
  onClose,
}: CreateSectorModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg overflow-y-auto max-h-[85vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("CREATE_SECTOR")}
          </DialogTitle>
          <DialogDescription>
            {t("CREATE_SECTOR_DESCRIPTION")}
          </DialogDescription>
        </DialogHeader>
        <CreateSectorForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
