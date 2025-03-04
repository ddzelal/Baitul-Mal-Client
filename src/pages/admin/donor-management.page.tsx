import { DataTable } from "@/components/tables/data-table";
import {
  columnsDonor,
  SORTABLE_COLUMNS,
  useDonorTable,
} from "@/components/tables/configs/donor-table.config";

export default function DonorManagementPage() {
  const { data, params, handleParamsChange } = useDonorTable();

  return (
    <div>
      <div className="space-y-2">
        {data && (
          <DataTable
            data={data}
            columns={columnsDonor}
            onParamsChange={handleParamsChange}
            params={params}
            sortableColumns={SORTABLE_COLUMNS}
          />
        )}
      </div>
    </div>
  );
}
