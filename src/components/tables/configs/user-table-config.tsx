import { ColumnDef } from "@tanstack/react-table";
import { IUser, IUserRole } from "@/interfaces/auth.interface";
import { useState } from "react";
import { QueryParams } from "@/api/types/global.types";
import { UserQueries } from "@/api/queries/user.queries";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useModal } from "@/hooks/use-modal";
import EditUserModal from "@/components/modals/edit-user-modal";
import ConfirmModal from "@/components/modals/confirm-modal";
import { UserStatus } from "@/api/types/user.types.ts";

// Custom hook for table logic
export function useUserTable() {
  const [params, setParams] = useState<QueryParams<IUser>>({
    PageNumber: 1,
    PageSize: 10,
    SortByField: "name",
    SortOrder: "asc",
    SearchTerm: "",
  });

  const { data } = UserQueries.useGetAll(params);

  const handleParamsChange = (newParams: QueryParams<IUser>) => {
    setParams(newParams);
  };

  return {
    data,
    params,
    handleParamsChange,
  };
}

// Table columns configuration
export const columnsUser: ColumnDef<IUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => {
      const role = getValue<IUserRole>();
      return <span>{role}</span>;
    },
  },
  {
    accessorKey: "isDeleted",
    header: "Status",
    cell: ({ getValue }) => {
      const isDeleted = getValue<boolean>();
      return <span>{isDeleted ? "Disabled" : "Active"}</span>;
    },
  },
];

// Table actions component
export default function UserTableActions(item: IUser) {
  const { t } = useTranslation();
  const {
    isOpen: isEditOpen,
    openModal: openEditModal,
    closeModal: closeEditModal,
  } = useModal();

  const {
    isOpen: isHandleUserStatusOpen,
    openModal: openUserStatusModal,
    closeModal: closeUserStatusModal,
  } = useModal();

  const updateStatus = UserQueries.useUpdateUserStatus();

  const handleStatusUser = async () => {
    await updateStatus.mutateAsync({
      userId: item.id,
      status: item.isDeleted ? UserStatus.Enabled : UserStatus.Disabled,
    });
    closeUserStatusModal();
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
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={openEditModal}
            >
              {t("EDIT_USER")}
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            {item.isDeleted ? (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={openUserStatusModal}
              >
                {t("ENABLE_USER")}
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={openUserStatusModal}
              >
                {t("DELETE_USER")}
              </Button>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditUserModal user={item} isOpen={isEditOpen} onClose={closeEditModal} />

      <ConfirmModal
        isOpen={isHandleUserStatusOpen}
        onClose={closeUserStatusModal}
        title={t(item.isDeleted ? "ENABLE_USER" : "DELETE_USER")}
        message={t(
          item.isDeleted
            ? "ENABLE_USER_CONFIRM_MESSAGE"
            : "DELETE_USER_CONFIRM_MESSAGE"
        )}
        onConfirm={handleStatusUser}
        isLoading={updateStatus.isPending}
        confirmText={t("CONFIRM")}
        cancelText={t("CANCEL")}
      />
    </>
  );
}
