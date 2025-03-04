import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import CreateSectorModal from "@/components/modals/create-sector-modal";
import SectorTableActions, {
  columnsSector,
  useSectorTable,
} from "@/components/tables/configs/sector-table.config";
import { useModal } from "@/hooks/use-modal";

export default function SectorManagementPage() {
  const { t } = useTranslation();
  const { data, params, handleParamsChange } = useSectorTable();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <Button variant="secondary" className="mb-2" onClick={openModal}>
        {t("CREATE_SECTOR")}
        <ChevronRight />
      </Button>

      <div className="space-y-2">
        {data && (
          <DataTable
            data={data}
            columns={columnsSector}
            onParamsChange={handleParamsChange}
            params={params}
            renderRowActions={(item) => <SectorTableActions {...item} />}
          />
        )}
      </div>

      <CreateSectorModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
