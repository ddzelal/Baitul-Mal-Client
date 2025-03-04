import { TransactionStatus } from "@/api/types/transaction.types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check, FileText, X } from "lucide-react";

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
  className?: string;
  showIcon?: boolean;
}

export function TransactionStatusBadge({
  status,
  className,
  showIcon = true,
}: TransactionStatusBadgeProps) {
  const getStatusConfig = (status: TransactionStatus) => {
    switch (status) {
      case TransactionStatus.Pending:
        return {
          label: "Pending",
          icon: <FileText className="mr-2 h-4 w-4" />,
          className:
            "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900 dark:text-amber-100 dark:hover:bg-amber-800",
        };
      case TransactionStatus.Approved:
        return {
          label: "Approved",
          icon: <Check className="mr-2 h-4 w-4" />,
          className:
            "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-100 dark:hover:bg-green-800",
        };
      case TransactionStatus.Rejected:
        return {
          label: "Rejected",
          icon: <X className="mr-2 h-4 w-4" />,
          className:
            "bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-100 dark:hover:bg-red-800",
        };
      default:
        return {
          label: "Unknown",
          icon: null,
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      className={cn(
        config.className,
        "transition-colors duration-200 flex items-center",
        className
      )}
    >
      {showIcon && config.icon}
      {config.label}
    </Badge>
  );
}
