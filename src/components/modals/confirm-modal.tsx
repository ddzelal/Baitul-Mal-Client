import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ButtonLoader } from "@/components/button-loader";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  onConfirm: () => Promise<void> | void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  isLoading = false,
  confirmText = "Yes",
  cancelText = "No",
}: ConfirmModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed left-[50vw] top-[50vh] -translate-x-1/2 -translate-y-1/2 w-[90vw] sm:w-[80vw] sm:max-w-[425px] rounded-lg">
        <div className="flex flex-col items-center text-center space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
            <DialogDescription className="text-center">
              {message}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-center gap-3 w-full mt-6">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {cancelText}
            </Button>
            <ButtonLoader
              variant="destructive"
              onClick={onConfirm}
              isLoading={isLoading}
              className="min-w-[100px]"
            >
              {confirmText}
            </ButtonLoader>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
