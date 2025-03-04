import { ColumnDef } from "@tanstack/react-table";
import { IDonor } from "@/api/types/donor.types";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import { QueryParams } from "@/api/types/global.types";
import { DonorQueries } from "@/api/queries/donor.queries";
import { useTranslation } from "react-i18next";

export function useDonorTable() {
  const [params, setParams] = useState<QueryParams<IDonor>>({
    PageNumber: 1,
    PageSize: 10,
    SortByField: "",
    SortOrder: "asc",
    SearchTerm: "",
  });

  const { data } = DonorQueries.useGetAll(params);

  const handleParamsChange = (newParams: QueryParams<IDonor>) => {
    setParams(newParams);
  };

  return {
    data,
    params,
    handleParamsChange,
  };
}

export const SORTABLE_COLUMNS = ["name", "email"] as const;

export const columnsDonor: ColumnDef<IDonor>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ getValue }) => {
      const name = getValue<string>();
      return name ? name.slice(0, 20) + "..." : "N/A";
    },
  },
  {
    accessorKey: "lastName",
    header: "Last Name",
    cell: ({ getValue }) => {
      const lastName = getValue<string>();
      return lastName ? lastName.slice(0, 20) + "..." : "N/A";
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => {
      const email = getValue<string>();
      return email ? email.slice(0, 20) + "..." : "N/A";
    },
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    cell: ({ getValue }) => {
      const phoneNumber = getValue<string>();
      return phoneNumber ? phoneNumber.slice(0, 20) + "..." : "N/A";
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ getValue }) => {
      const description = getValue<string>();
      return description ? description.slice(0, 20) + "..." : "N/A";
    },
  },
];

export default function DonorTableActions(item: IDonor) {
  const { t } = useTranslation();
  console.log(item, "donor item");

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
      </DropdownMenuContent>
    </DropdownMenu>
  </>;
}
