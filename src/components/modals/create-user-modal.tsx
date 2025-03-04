import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CreateUserForm from "@/components/forms/create-user.form";
import { useTranslation } from "react-i18next";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateUserModal({
  isOpen,
  onClose,
}: CreateUserModalProps) {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg overflow-y-auto max-h-[85vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("CREATE_USER")}
          </DialogTitle>
          <DialogDescription>{t("CREATE_USER_DESCRIPTION")}</DialogDescription>
        </DialogHeader>
        <CreateUserForm onSuccess={onClose} />
      </DialogContent>
    </Dialog>
  );
}
