import { useState } from "react";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { QueryParams } from "@/api/types/global.types.ts";
import { useTranslation } from "react-i18next";

interface DataTableSearchProps<T> {
  params: QueryParams<T>;
  onParamsChange: (params: QueryParams<T>) => void;
}

export function DataTableSearch<T>({
  params,
  onParamsChange,
}: DataTableSearchProps<T>) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState(params.SearchTerm || "");

  const handleSearchTermChange = debounce((value: string) => {
    onParamsChange({
      ...params,
      SearchTerm: value,
      PageNumber: 1, // Reset to first page when search term changes
    });
  }, 300);

  return (
    <div className="flex items-center space-x-2">
      <Input
        type="search"
        placeholder={t("SEARCH_PLACEHOLDER")}
        className="h-10 w-64 lg:w-96"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          handleSearchTermChange(e.target.value);
        }}
      />
    </div>
  );
}
