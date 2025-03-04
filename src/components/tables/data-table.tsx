import React, { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  OnChangeFn,
  PaginationState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PaginatedResponse, QueryParams } from "@/api/types/global.types.ts";
import { DataTablePagination } from "@/components/tables/data-table-pagination.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { DataTableSearch } from "@/components/tables/data-table-search.tsx";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { useAuth } from "@/hooks/use-auth.hook.tsx";
import { IUserRole } from "@/interfaces/auth.interface.ts";

interface DataTableProps<T> {
  data: PaginatedResponse<T>;
  columns: ColumnDef<T>[];
  params: QueryParams<T>;
  onParamsChange: (params: QueryParams<T>) => void;
  renderRowActions?: (item: T) => React.ReactNode;
  sortableColumns?: readonly string[];
}

export function DataTable<T>({
  data,
  columns,
  params,
  onParamsChange,
  renderRowActions,
  sortableColumns = [],
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const table = useReactTable({
    data: data.items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(data.itemCount / (params.PageSize || 10)),
    state: {
      pagination: {
        pageIndex: (params.PageNumber || 1) - 1,
        pageSize: params.PageSize || 10,
      },
      columnVisibility,
    },
    onPaginationChange: ((updaterOrValue) => {
      if (typeof updaterOrValue === "function") {
        onParamsChange({
          ...params,
          PageNumber:
            (updaterOrValue(table.getState().pagination).pageIndex || 0) + 1,
          PageSize: updaterOrValue(table.getState().pagination).pageSize || 10,
        });
      } else {
        onParamsChange({
          ...params,
          PageNumber: (updaterOrValue.pageIndex || 0) + 1,
          PageSize: updaterOrValue.pageSize || 10,
        });
      }
    }) as OnChangeFn<PaginationState>,
    onColumnVisibilityChange: setColumnVisibility,
  });

  const handleSortByFieldChange = (value: string) => {
    if (params.SortByField === value) {
      onParamsChange({
        ...params,
        SortByField: "",
      });
    } else {
      onParamsChange({
        ...params,
        SortByField: value,
      });
    }
  };

  const isSortable = (columnId: string) => {
    return sortableColumns.includes(columnId);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <DataTableSearch params={params} onParamsChange={onParamsChange} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                {t("COLUMNS")} <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          {user?.role === IUserRole.Admin && (
            <div className="flex items-center space-x-2 pl-2">
              <Switch
                id="includeDeleted"
                checked={params.IncludeDeleted || false}
                onCheckedChange={(checked) =>
                  onParamsChange({
                    ...params,
                    IncludeDeleted: checked,
                  })
                }
              />
              <Label htmlFor="includeDeleted" className="text-sm font-medium">
                {t("INCLUDE_DELETED")}
              </Label>
            </div>
          )}
        </div>
      </div>
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      onClick={() => {
                        if (isSortable(header.column.id)) {
                          handleSortByFieldChange(
                            header.column.columnDef.header as string
                          );
                        }
                      }}
                      className={
                        isSortable(header.column.id) ? "cursor-pointer" : ""
                      }
                    >
                      <div className="flex items-center space-x-2">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {isSortable(header.column.id) &&
                          (params.SortByField ===
                          header.column.columnDef.header ? (
                            <ArrowUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </TableHead>
                  ))}
                  {renderRowActions && (
                    <TableHead className={"text-end"}>{t("ACTIONS")}</TableHead>
                  )}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t("NO_DATA_FOUND")}
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    {renderRowActions && (
                      <TableCell className={"text-end"}>
                        {renderRowActions(row.original)}
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
