import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonLoaderProps extends ButtonProps {
  isLoading?: boolean;
}

export const ButtonLoader = React.forwardRef<
  HTMLButtonElement,
  ButtonLoaderProps
>(({ children, isLoading = false, className, disabled, ...props }, ref) => {
  return (
    <Button
      className={cn("flex items-center justify-center", className)}
      disabled={isLoading || disabled}
      ref={ref}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </Button>
  );
});

ButtonLoader.displayName = "ButtonLoader";
