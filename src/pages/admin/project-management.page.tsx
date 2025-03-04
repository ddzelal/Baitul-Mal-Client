import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import CreateProjectModal from "@/components/modals/create-project-modal";
import ProjectTableActions, {
  columnsProject,
  SORTABLE_COLUMNS,
  useProjectTable,
} from "@/components/tables/configs/project-table.config";
import { useModal } from "@/hooks/use-modal";

export default function ProjectManagementPage() {
  const { t } = useTranslation();
  const { data, params, handleParamsChange } = useProjectTable();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <Button variant="secondary" className="mb-2" onClick={openModal}>
        {t("CREATE_PROJECT")}
        <ChevronRight />
      </Button>

      <div className="space-y-2">
        {data && (
          <DataTable
            data={data}
            columns={columnsProject}
            onParamsChange={handleParamsChange}
            params={params}
            renderRowActions={(item) => <ProjectTableActions {...item} />}
            sortableColumns={SORTABLE_COLUMNS}
          />
        )}
      </div>
      <CreateProjectModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
