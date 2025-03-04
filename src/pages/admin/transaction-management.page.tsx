import { DataTable } from "@/components/tables/data-table";
import {
  columnsTransaction,
  useTransactionTable,
} from "@/components/tables/configs/transaction-table.config";

export default function TransactionManagementPage() {
  const { data, params, handleParamsChange } = useTransactionTable();

  return (
    <div>
      <div className="space-y-2">
        {data && (
          <DataTable
            data={data}
            columns={columnsTransaction}
            onParamsChange={handleParamsChange}
            params={params}
          />
        )}
      </div>
    </div>
  );
}
