import { ColumnDef } from "@tanstack/react-table";
import { ITransaction, TransactionStatus } from "@/api/types/transaction.types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, Eye, ExternalLink, Check, X } from "lucide-react";
import { QueryParams } from "@/api/types/global.types";
import { TransactionQueries } from "@/api/queries/transaction.queries";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/lib/currency.utils";
import { CurrencyCode } from "@/interfaces/organization.interface";
import { TransactionStatusBadge } from "@/components/common/status/transaction-status-badge";

export function useTransactionTable() {
  const [params, setParams] = useState<QueryParams<ITransaction>>({
    PageNumber: 1,
    PageSize: 10,
    SortByField: "createdAt",
    SortOrder: "desc",
    SearchTerm: "",
  });

  const { data } = TransactionQueries.useGetAll(params);

  const handleParamsChange = (newParams: QueryParams<ITransaction>) => {
    setParams(newParams);
  };

  return {
    data,
    params,
    handleParamsChange,
  };
}

export const SORTABLE_COLUMNS = [
  "invoiceId",
  "receivedAmount",
  "createdAt",
] as const;

export const columnsTransaction: ColumnDef<ITransaction>[] = [
  {
    accessorKey: "invoiceId",
    header: "Invoice Number",
    cell: ({ getValue, row }) => {
      const invoiceId = getValue<string>();
      return (
        <div className="font-mono text-xs">
          {invoiceId
            ? `${invoiceId.substring(0, 8)}...`
            : `${row.original.id.substring(0, 8)}...`}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<TransactionStatus>();
      return <TransactionStatusBadge status={status} />;
    },
  },
  {
    accessorKey: "receivedAmount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original.receivedAmount;
      const currency = row.original.currencyCode || "BAM";
      console.log(amount, currency, "amount, currency");
      return (
        <div className="font-medium">
          {formatCurrency(amount, currency as CurrencyCode)}
        </div>
      );
    },
  },
  {
    accessorKey: "donorFullName",
    header: "Donor",
    cell: ({ getValue }) => {
      const donorName = getValue<string>();
      return donorName || "Anonymous donor";
    },
  },
  {
    accessorKey: "creatorFullName",
    header: "Created By",
    cell: ({ getValue }) => {
      const creatorName = getValue<string>();
      return creatorName || "-";
    },
  },
  {
    accessorKey: "approverFullName",
    header: "Approved By",
    cell: ({ getValue, row }) => {
      const approverName = getValue<string>();
      return row.original.status === TransactionStatus.Approved
        ? approverName || "-"
        : "-";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ getValue }) => {
      const date = getValue<string>();
      if (!date) return "-";

      try {
        const formattedDate = new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        return formattedDate;
      } catch {
        return "Invalid date";
      }
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <TransactionTableActions {...row.original} />,
  },
];

export default function TransactionTableActions(transaction: ITransaction) {
  const { t } = useTranslation();

  const handleViewDetails = () => {
    return;
  };

  const handleViewInvoice = () => {
    if (transaction.invoiceId) {
      window.open(`/invoices/${transaction.invoiceId}`, "_blank");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">{t("OPEN_MENU")}</span>
            <EllipsisVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{t("ACTIONS")}</DropdownMenuLabel>
          <DropdownMenuItem onSelect={handleViewDetails}>
            <Eye className="mr-2 h-4 w-4" />
            {t("VIEW_DETAILS")}
          </DropdownMenuItem>
          {transaction.invoiceId && (
            <DropdownMenuItem onSelect={handleViewInvoice}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("VIEW_INVOICE")}
            </DropdownMenuItem>
          )}
          {transaction.status === TransactionStatus.Pending && (
            <>
              <DropdownMenuItem onSelect={() => {}}>
                <Check className="mr-2 h-4 w-4" />
                {t("APPROVE_TRANSACTION")}
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => {}}>
                <X className="mr-2 h-4 w-4" />
                {t("REJECT_TRANSACTION")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
