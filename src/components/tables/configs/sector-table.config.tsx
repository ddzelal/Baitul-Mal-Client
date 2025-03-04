import { ColumnDef } from "@tanstack/react-table";
import { Coordinator, Sector } from "@/api/types/sector.types.ts";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EllipsisVertical } from "lucide-react";
import CreateProjectModal from "@/components/modals/create-project-modal.tsx";
import { useModal } from "@/hooks/use-modal";
import { QueryParams } from "@/api/types/global.types.ts";
import { SectorQueries } from "@/api/queries/sector.queries.ts";
import { useTranslation } from "react-i18next";
import { AddCoordinatorModal } from "@/components/modals/add-coordinator-modal";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Custom hook for table logic
export function useSectorTable() {
  const [params, setParams] = useState<QueryParams<Sector>>({
    PageNumber: 1,
    PageSize: 10,
    SortByField: "",
    SortOrder: "asc",
    SearchTerm: "",
  });

  const { data } = SectorQueries.useGetAll(params);

  const handleParamsChange = (newParams: QueryParams<Sector>) => {
    setParams(newParams);
  };

  return {
    data,
    params,
    handleParamsChange,
  };
}

// Table columns configuration
export const columnsSector: ColumnDef<Sector>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "currentCoordinators",
    header: "Coordinators",
    cell: ({ getValue }) => {
      const coordinators = getValue<Coordinator[]>();
      return (
        <div className="flex -space-x-2">
          {coordinators
            ?.slice(0, 3)
            .map((coordinator) => (
              <InitialsAvatar
                key={coordinator.id}
                name={coordinator.name}
                className="h-8 w-8 border-2 border-background"
              />
            ))}
          {coordinators && coordinators.length > 3 && (
            <Avatar className="h-8 w-8 border-2 border-background bg-muted">
              <AvatarFallback>+{coordinators.length - 3}</AvatarFallback>
            </Avatar>
          )}
        </div>
      );
    },
  },
];

// Table actions component
export default function SectorTableActions(item: Sector) {
  const { t } = useTranslation();
  const { isOpen, openModal, closeModal } = useModal();

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
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <AddCoordinatorModal
              item={item}
              organizationDomainId={item.id}
              organizationDomainType="sector"
              trigger={
                <div className="w-full cursor-pointer">
                  {t("ADD_COORDINATORS")}
                </div>
              }
            />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={openModal}
            >
              {t("CREATE_PROJECT")}
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateProjectModal sector={item} isOpen={isOpen} onClose={closeModal} />
    </>
  );
}
