import { useCallback } from "react";
import { formatCurrency } from "@/lib/currency.utils";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/api/constants/queries.constants";
import { GetFullOrganizationResponse } from "@/api/types/organization.types";
import { CurrencyCode } from "@/interfaces/organization.interface";

interface FormatCurrencyOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const useCurrencyFormatter = () => {
  const queryClient = useQueryClient();
  const organization = queryClient
    .getQueryCache()
    .find({ queryKey: [QUERY_KEYS.GET_ORGANIZATION_INFO] })?.state
    .data as GetFullOrganizationResponse;

  return useCallback(
    (
      amount: number | string,
      currencyCode?: CurrencyCode,
      options?: FormatCurrencyOptions
    ) => {
      if (!organization) {
        return "";
      }

      return formatCurrency(
        amount,
        currencyCode || (organization.currencyCode as CurrencyCode),
        options
      );
    },
    [organization]
  );
};
