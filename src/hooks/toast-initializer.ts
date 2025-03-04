import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import type { ToastProps } from "@/components/ui/toast";

let toastFunction: ((options: ToastProps) => void) | undefined;

export const ToastInitializer = () => {
  const { toast } = useToast();

  useEffect(() => {
    toastFunction = toast;
  }, [toast]);

  return null;
};

export const showToast = (options: ToastProps) => {
  console.log("showToast called with options:", options);
  if (toastFunction) {
    console.log("toastFunction is defined, showing toast");
    toastFunction(options);
  } else {
    console.error("Toast function is not initialized.");
  }
};
