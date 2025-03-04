import { useMutation, useQuery } from "@tanstack/react-query";
import { TransactionRequests } from "@/api/requests/transaction.requests";
import {
  CreateTransactionRequestBody,
  ITransaction,
} from "@/api/types/transaction.types";
import { QueryParams } from "../types/global.types";
import { QUERY_KEYS } from "../constants/queries.constants";
import { PaginatedResponse } from "../types/global.types";

const useCreateTransaction = () => {
  return useMutation<
    CreateTransactionRequestBody,
    Error,
    CreateTransactionRequestBody
  >({
    mutationFn: TransactionRequests.create,
  });
};

const useGetAll = (params?: QueryParams<ITransaction>) => {
  return useQuery<PaginatedResponse<ITransaction>>({
    queryFn: () => TransactionRequests.getAll(params),
    queryKey: [QUERY_KEYS.TRANSACTION_GET_ALL, params],
    placeholderData: (data) =>
      data || {
        items: [],
        itemCount: 0,
        pageNumber: 0,
        pageSize: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      },
  });
};
export const TransactionQueries = {
  useCreateTransaction,
  useGetAll,
};
