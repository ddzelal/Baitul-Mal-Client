import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";
import { IUser } from "@/interfaces/auth.interface";
import { ProfileSectionForm } from "../forms/profile.form";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
}: EditUserModalProps) {
  const { t } = useTranslation();
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[52vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg overflow-y-auto max-h-[85vh] scrollbar-hide">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {t("EDIT_USER")}
          </DialogTitle>
          <DialogDescription>{t("EDIT_USER_DESCRIPTION")}</DialogDescription>
        </DialogHeader>
        <ProfileSectionForm user={user} isEditing={true} onEdit={() => {}} />
      </DialogContent>
    </Dialog>
  );
}
