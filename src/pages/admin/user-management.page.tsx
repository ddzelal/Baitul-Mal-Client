import { DataTable } from "@/components/tables/data-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import CreateUserModal from "@/components/modals/create-user-modal";
import UserTableActions, {
  columnsUser,
  useUserTable,
} from "@/components/tables/configs/user-table-config";
import { useModal } from "@/hooks/use-modal";

export default function UserManagementPage() {
  const { t } = useTranslation();
  const { data, params, handleParamsChange } = useUserTable();
  const { isOpen, openModal, closeModal } = useModal();

  return (
    <div>
      <Button variant="secondary" className="mb-2" onClick={openModal}>
        {t("CREATE_USER")}
        <ChevronRight />
      </Button>

      <div className="space-y-2">
        {data && (
          <DataTable
            data={data}
            columns={columnsUser}
            onParamsChange={handleParamsChange}
            params={params}
            renderRowActions={(item) => <UserTableActions {...item} />}
          />
        )}
      </div>

      <CreateUserModal isOpen={isOpen} onClose={closeModal} />
    </div>
  );
}
