import { LucideIcon } from "lucide-react";
import { useCurrencyFormatter } from "@/hooks/use-currency-formatter.hook";

type BudgetType = "assigned" | "unassigned" | "pending" | "reserved" | "spent";

interface BudgetCardProps {
  type: BudgetType;
  icon: LucideIcon;
  label: string;
  amount: number | string;
}

const TYPE_STYLES = {
  assigned: {
    background: "bg-green-50",
    border: "border-green-200",
    iconColor: "text-green-600",
    textColor: "text-green-900",
    amountColor: "text-green-700",
  },
  unassigned: {
    background: "bg-gray-50",
    border: "border-gray-200",
    iconColor: "text-gray-600",
    textColor: "text-gray-900",
    amountColor: "text-gray-700",
  },
  pending: {
    background: "bg-yellow-50",
    border: "border-yellow-200",
    iconColor: "text-yellow-600",
    textColor: "text-yellow-900",
    amountColor: "text-yellow-700",
  },
  reserved: {
    background: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "text-blue-600",
    textColor: "text-blue-900",
    amountColor: "text-blue-700",
  },
  spent: {
    background: "bg-red-50",
    border: "border-red-200",
    iconColor: "text-red-600",
    textColor: "text-red-900",
    amountColor: "text-red-700",
  },
};

export function BudgetCard({
  type,
  icon: Icon,
  label,
  amount,
}: BudgetCardProps) {
  const styles = TYPE_STYLES[type];
  const formatCurrency = useCurrencyFormatter();

  return (
    <div
      className={`flex flex-col p-4 ${styles.background} rounded-lg border ${styles.border} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center space-x-3 mb-2">
        <Icon className={`w-6 h-6 ${styles.iconColor}`} />
        <span className={`font-medium ${styles.textColor}`}>{label}</span>
      </div>
      <span className={`text-2xl font-bold ${styles.amountColor}`}>
        {formatCurrency(amount)}
      </span>
    </div>
  );
}
