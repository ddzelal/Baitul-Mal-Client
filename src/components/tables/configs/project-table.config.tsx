import { ColumnDef } from "@tanstack/react-table";
import { IProject } from "@/api/types/project.types.ts";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { EllipsisVertical } from "lucide-react";
import { QueryParams } from "@/api/types/global.types.ts";
import { ProjectQueries } from "@/api/queries/project.queries.ts";
import { useTranslation } from "react-i18next";
import { ProjectStatusBadge } from "@/components/common/status/project-status-badge";
import { AddCoordinatorModal } from "@/components/modals/add-coordinator-modal";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { InitialsAvatar } from "@/components/common/avatars/initials-avatar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import EditProjectModal from "@/components/modals/edit-project-modal";
import { useModal } from "@/hooks/use-modal";

// Custom hook for table logic
export function useProjectTable() {
  const [params, setParams] = useState<QueryParams<IProject>>({
    PageNumber: 1,
    PageSize: 10,
    SortByField: "",
    SortOrder: "asc",
    SearchTerm: "",
  });

  const { data } = ProjectQueries.useGetAll(params);

  const handleParamsChange = (newParams: QueryParams<IProject>) => {
    setParams(newParams);
  };

  return {
    data,
    params,
    handleParamsChange,
  };
}

export const SORTABLE_COLUMNS = ["name"] as const;

// Table columns configuration
export const columnsProject: ColumnDef<IProject>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue<string>();
      return description ? description.slice(0, 20) + "..." : "No description";
    },
  },
  {
    accessorKey: "currentCoordinators",
    header: "Coordinators",
    cell: ({ getValue }) => {
      const coordinators = getValue<Array<{ id: string; name: string }>>();
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
  {
    accessorKey: "outcomeType",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<string>();
      return <ProjectStatusBadge status={status} />;
    },
  },
];

// Table actions component
export default function ProjectTableActions(item: IProject) {
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
          <DropdownMenuItem onSelect={openModal}>
            {t("EDIT_PROJECT")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <AddCoordinatorModal
              item={item}
              organizationDomainId={item.id}
              organizationDomainType="project"
              trigger={
                <div className="w-full cursor-pointer">
                  {t("ADD_COORDINATORS")}
                </div>
              }
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditProjectModal
        project={item}
        sectorId={item.assignedToSectorId}
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}
